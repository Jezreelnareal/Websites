import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const routePath = fileURLToPath(
  new URL("../app/api/contact/route.ts", import.meta.url),
);
const compiled = ts.transpileModule(fs.readFileSync(routePath, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const payload = {
  name: "Test",
  email: "test@example.com",
  message: "Test inquiry",
  turnstileToken: "valid-token",
};

function handler(
  fetch,
  env = { RESEND_API_KEY: "test-resend", TURNSTILE_SECRET_KEY: "test-secret" },
) {
  const exports = {};
  // Isolated environment and fetch: never load real keys or make network requests.
  vm.runInNewContext(
    compiled,
    {
      exports,
      require: createRequire(routePath),
      process: { env },
      fetch,
      AbortSignal,
    },
    { filename: routePath },
  );
  return exports.POST;
}
const request = (body) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
const noNetwork = () => {
  assert.fail("Unexpected network request");
};
const replyDraft = (html) => {
  const match = html.match(/href="([^"]+)"[^>]*>Reply to sender/);
  assert.ok(match, "Reply link must be present");
  return new URL(match[1].replaceAll("&amp;", "&").replaceAll("&#39;", "'"));
};

test("missing configuration blocks sending", async () => {
  for (const env of [
    {},
    { RESEND_API_KEY: "test" },
    { TURNSTILE_SECRET_KEY: "test" },
  ]) {
    assert.equal((await handler(noNetwork, env)(request(payload))).status, 503);
  }
});

test("malformed payloads and missing/oversized tokens never reach providers", async () => {
  for (const body of [
    null,
    [],
    "invalid",
    {},
    ...[undefined, "", " ", 123, "x".repeat(2049)].map((turnstileToken) => ({
      ...payload,
      turnstileToken,
    })),
  ]) {
    assert.equal((await handler(noNetwork)(request(body))).status, 400);
  }
  const malformed = new Request("http://localhost/api/contact", {
    method: "POST",
    body: "{",
  });
  assert.equal((await handler(noNetwork)(malformed)).status, 400);
});

test("invalid, expired, reused, and wrong-action tokens cannot send email", async () => {
  for (const result of [
    { success: false },
    { success: false, "error-codes": ["timeout-or-duplicate"] },
    { success: true, action: "login" },
    { success: true },
    { success: "true", action: "contact" },
  ]) {
    let calls = 0;
    const post = handler(async (url) => {
      calls++;
      assert.equal(
        url,
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      );
      return Response.json(result);
    });
    assert.equal((await post(request(payload))).status, 400);
    assert.equal(calls, 1);
  }
});

test("Cloudflare network, HTTP, and malformed-response failures block email", async () => {
  for (const response of [
    null,
    new Response("", { status: 503 }),
    new Response("not json"),
  ]) {
    const post = handler(async (url) => {
      assert.equal(
        url,
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      );
      if (!response) throw new Error("Network unavailable");
      return response;
    });
    assert.equal((await post(request(payload))).status, 503);
  }
});

test("valid verification precedes Resend and keeps verification secrets out of email", async () => {
  const calls = [];
  const post = handler(async (url, options) => {
    calls.push(url);
    const body = JSON.parse(options.body);
    if (calls.length === 1) {
      assert.deepEqual(body, {
        secret: "test-secret",
        response: "valid-token",
      });
      assert.equal(options.cache, "no-store");
      assert.ok(options.signal instanceof AbortSignal);
      return Response.json({ success: true, action: "contact" });
    }
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(body.reply_to, payload.email);
    assert.ok(!options.body.includes("test-secret"));
    assert.ok(!options.body.includes("valid-token"));
    return Response.json({ id: "mock-email" });
  });
  assert.equal((await post(request(payload))).status, 200);
  assert.equal(calls.length, 2);
});

test("email-provider failure still returns retryable feedback after verification", async () => {
  const post = handler(async (url) =>
    url.includes("siteverify")
      ? Response.json({ success: true, action: "contact" })
      : new Response("Unavailable", { status: 503 }),
  );
  assert.equal((await post(request(payload))).status, 502);
});

test("inquiry email escapes submitted content and preserves message line breaks", async () => {
  const submitted = {
    ...payload,
    name: '<img src=x onerror="alert(1)">',
    projectType: "Design & development",
    timeline: "<next month>",
    message: '<script>alert("hello")</script>\nSecond line & details',
  };
  let email;
  const post = handler(async (url, options) => {
    if (url.includes("siteverify")) {
      return Response.json({ success: true, action: "contact" });
    }
    email = JSON.parse(options.body);
    return Response.json({ id: "mock-email" });
  });
  assert.equal((await post(request(submitted))).status, 200);
  assert.ok(!email.html.includes("<script>"));
  assert.ok(!email.html.includes("<img src=x"));
  assert.ok(
    email.html.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"),
  );
  assert.ok(email.html.includes("Design &amp; development"));
  assert.ok(email.html.includes("&lt;next month&gt;"));
  assert.ok(
    email.html.includes("&lt;/script&gt;<br />Second line &amp; details"),
  );
  assert.ok(email.text.includes(submitted.message));
  assert.equal(email.reply_to, submitted.email);
});

test("invalid call dates, past times, and unsupported intents never reach providers", async () => {
  const tomorrow = new Date(Date.now() + 2 * 86400000)
    .toISOString()
    .slice(0, 10);
  for (const fields of [
    { intent: "confirmed-booking" },
    ...[
      {},
      { preferredDate: "2000-01-01", preferredTime: "12:00" },
      { preferredDate: "2099-02-30", preferredTime: "12:00" },
      { preferredDate: tomorrow, preferredTime: "24:00" },
      { preferredDate: tomorrow, preferredTime: "12:60" },
      { preferredDate: tomorrow, preferredTime: "12:00+00:00" },
      { preferredDate: 123, preferredTime: "12:00" },
    ].map((fields) => ({ intent: "appointment", ...fields })),
  ]) {
    assert.equal(
      (await handler(noNetwork)(request({ ...payload, ...fields }))).status,
      400,
    );
  }
});

test("verified call requests include Philippine time and stay pending without booking", async () => {
  const tomorrow = new Date(Date.now() + 2 * 86400000)
    .toISOString()
    .slice(0, 10);
  const calls = [];
  const post = handler(async (url, options) => {
    calls.push(url);
    if (url.includes("siteverify")) {
      assert.equal(JSON.parse(options.body).response, "valid-token");
      return Response.json({ success: true, action: "contact" });
    }
    const email = JSON.parse(options.body);
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(email.subject, "Call Request from Test");
    assert.equal(email.reply_to, payload.email);
    const draft = replyDraft(email.html);
    assert.equal(draft.protocol, "mailto:");
    assert.equal(decodeURIComponent(draft.pathname), payload.email);
    assert.equal(
      draft.searchParams.get("subject"),
      "Re: Your call request | Jezreel Borlongan",
    );
    const message = draft.searchParams.get("body");
    assert.ok(message.startsWith("Hi Test,\r\n"));
    assert.ok(message.includes("confirm our introductory call"));
    assert.ok(message.includes("3:30 PM"));
    assert.ok(message.includes("Philippine time, UTC+8"));
    assert.ok(message.includes("30 minutes"));
    assert.ok(
      message.includes(
        "Meeting link: [Add your Google Meet or Zoom link here]",
      ),
    );
    assert.ok(message.includes("Jezreel Borlongan"));
    for (const body of [email.html, email.text]) {
      assert.ok(body.includes("Philippine time, UTC+8"));
      assert.ok(body.includes("3:30 PM"));
      assert.ok(body.includes("30 minutes"));
      assert.ok(body.includes("Pending confirmation"));
      assert.ok(!body.includes("FORGED APPOINTMENT"));
    }
    return Response.json({ id: "mock-email" });
  });
  const response = await post(
    request({
      ...payload,
      intent: "appointment",
      preferredDate: tomorrow,
      preferredTime: "15:30",
      appointment: "FORGED APPOINTMENT",
      timeline: "FORGED APPOINTMENT",
    }),
  );
  assert.equal(response.status, 200);
  assert.match((await response.json()).message, /Pending confirmation/);
  assert.equal(calls.length, 2);
});

test("call requests require successful Cloudflare verification", async () => {
  const tomorrow = new Date(Date.now() + 2 * 86400000)
    .toISOString()
    .slice(0, 10);
  const post = handler(async (url) => {
    assert.ok(url.includes("siteverify"));
    return Response.json({ success: false });
  });
  assert.equal(
    (
      await post(
        request({
          ...payload,
          intent: "appointment",
          preferredDate: tomorrow,
          preferredTime: "15:30",
        }),
      )
    ).status,
    400,
  );
});

test("inquiry reply draft safely encodes recipient, subject, and message", async () => {
  const submitted = {
    ...payload,
    name: "Alex & Jamie",
    email: "alex+studio@example.com",
    projectType:
      "Design & development?cc=another@example.com\r\nBcc: nobody@example.com",
    timeline: "October & November",
  };
  const post = handler(async (url, options) => {
    if (url.includes("siteverify"))
      return Response.json({ success: true, action: "contact" });
    const email = JSON.parse(options.body);
    const draft = replyDraft(email.html);
    assert.equal(decodeURIComponent(draft.pathname), submitted.email);
    assert.deepEqual([...draft.searchParams.keys()], ["subject", "body"]);
    assert.equal(
      draft.searchParams.get("subject"),
      `Re: ${submitted.projectType.replace(/[\r\n]+/g, " ")} inquiry`,
    );
    assert.ok(!/[\r\n]/.test(draft.searchParams.get("subject")));
    const message = draft.searchParams.get("body");
    assert.ok(message.startsWith("Hi Alex & Jamie,\r\n\r\n"));
    assert.ok(message.includes("Your preferred timeline: October & November"));
    assert.ok(
      message.includes("[Add your response and suggested next steps here]"),
    );
    assert.ok(!message.includes("confirm our introductory call"));
    return Response.json({ id: "mock-email" });
  });
  assert.equal((await post(request(submitted))).status, 200);
});
