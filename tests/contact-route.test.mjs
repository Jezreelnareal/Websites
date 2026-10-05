import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const compile = (path) => ts.transpileModule(fs.readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const route = compile("../app/api/contact/route.ts");
const sheets = compile("../lib/contact/google-sheets.ts");
const defaults = {
  TURNSTILE_SECRET_KEY: "test-turnstile",
  GOOGLE_SHEETS_WEBHOOK_URL: "https://script.google.com/macros/s/test/exec",
  GOOGLE_SHEETS_WEBHOOK_SECRET: "test-sheets",
};
const payload = {
  name: "Test", email: "test@example.com", message: "Test inquiry",
  turnstileToken: "valid-token", submissionId: "6c7ab16c-83ee-4abe-857b-b022ee9ba634",
};
function handler(fetch, env = defaults) {
  const shared = { fetch, process: { env }, AbortSignal, console: { error() {} } };
  const helper = { exports: {}, ...shared };
  vm.runInNewContext(sheets, helper);
  const context = { exports: {}, ...shared, require: (name) =>
    name === "@/lib/contact/google-sheets" ? helper.exports : createRequire(import.meta.url)(name) };
  vm.runInNewContext(route, context);
  return context.exports.POST;
}
const request = (body) => new Request("http://localhost/api/contact", {
  method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" },
});
const noNetwork = () => assert.fail("Unexpected provider call");
const verified = () => Response.json({ success: true, action: "contact" });

test("missing Turnstile or Sheets configuration blocks before any providers", async () => {
  for (const key of Object.keys(defaults)) {
    const env = { ...defaults }; delete env[key];
    assert.equal((await handler(noNetwork, env)(request(payload))).status, 503);
  }
});

test("malformed submissions, unsafe recipient lists and invalid tokens cannot reach providers", async () => {
  for (const body of [null, [], "bad", {},
    ...[undefined, "", " ", 123, "x".repeat(2049)].map(turnstileToken => ({ ...payload, turnstileToken })),
    ...["a@example.com,b@example.com", "a@example.com;b@example.com", "<a@example.com>"]
      .map(email => ({ ...payload, email })),
  ]) assert.equal((await handler(noNetwork)(request(body))).status, 400);
  assert.equal((await handler(noNetwork)(new Request("http://localhost/api/contact", {
    method: "POST", body: "{",
  }))).status, 400);
});

test("failed or wrong-action verification never reaches Sheets", async () => {
  for (const result of [{ success: false }, { success: true }, { success: true, action: "login" },
    { success: "true", action: "contact" }, { success: false, "error-codes": ["timeout-or-duplicate"] }]) {
    let calls = 0;
    const post = handler(async url => {
      calls++; assert.ok(url.includes("siteverify")); return Response.json(result);
    });
    assert.equal((await post(request(payload))).status, 400); assert.equal(calls, 1);
  }
});

test("Cloudflare outages return retryable feedback", async () => {
  for (const result of [null, new Response("", { status: 503 }), new Response("bad json")]) {
    const post = handler(async url => {
      assert.ok(url.includes("siteverify")); if (!result) throw Error("offline"); return result;
    });
    assert.equal((await post(request(payload))).status, 503);
  }
});

test("verified inquiry uses Apps Script only, stable ID and separate secrets; no Resend key needed", async () => {
  const calls = [];
  const post = handler(async (url, options) => {
    calls.push(url);
    const body = JSON.parse(options.body);
    assert.equal(options.cache, "no-store"); assert.ok(options.signal instanceof AbortSignal);
    if (calls.length === 1) {
      assert.ok(url.includes("siteverify"));
      assert.deepEqual(body, { secret: "test-turnstile", response: "valid-token" });
      return verified();
    }
    assert.equal(url, defaults.GOOGLE_SHEETS_WEBHOOK_URL);
    assert.equal(body.secret, "test-sheets");
    assert.equal(body.notificationMode, "apps-script");
    assert.equal(body.submissionId, payload.submissionId);
    assert.equal(body.requestType, "inquiry");
    assert.equal(body.email, payload.email);
    assert.ok(!options.body.includes("valid-token"));
    assert.ok(!options.body.includes("test-turnstile"));
    return Response.json({ ok: true, notificationHandler: "apps-script", confirmationSent: false, ownerNotificationSent: false });
  });
  assert.equal((await post(request(payload))).status, 200);
  assert.equal(calls.length, 2);
});

test("Sheets errors, timeouts and an outdated deployment produce retryable feedback", async () => {
  for (const result of [null, new Response("", { status: 503 }), new Response("not json"),
    Response.json({ ok: false, error: "Unauthorized" }), Response.json({ ok: true })]) {
    const post = handler(async url => {
      if (url.includes("siteverify")) return verified();
      if (!result) throw Error("timeout"); return result;
    });
    assert.equal((await post(request(payload))).status, 503);
  }
});

test("invalid dates, past times and unsupported intents are rejected before providers", async () => {
  for (const fields of [{ intent: "confirmed-booking" }, ...[
    {}, { preferredDate: "2000-01-01", preferredTime: "12:00" },
    { preferredDate: "2099-02-30", preferredTime: "12:00" },
    { preferredDate: "2099-01-01", preferredTime: "24:00" },
    { preferredDate: "2099-01-01", preferredTime: "12:60" },
    { preferredDate: 123, preferredTime: "12:00" },
  ].map(fields => ({ intent: "appointment", ...fields }))]) {
    assert.equal((await handler(noNetwork)(request({ ...payload, ...fields }))).status, 400);
  }
});

test("call date/time use Philippine time, ignoring forged confirmation", async () => {
  const post = handler(async (url, options) => {
    if (url.includes("siteverify")) return verified();
    const body = JSON.parse(options.body);
    assert.equal(body.requestType, "appointment");
    assert.equal(body.preferredDate, "2099-01-01"); assert.equal(body.preferredTime, "15:30");
    assert.equal(body.timeline, ""); assert.ok(!options.body.includes("FORGED"));
    return Response.json({ ok: true, notificationHandler: "apps-script" });
  });
  const response = await post(request({ ...payload, intent: "appointment",
    preferredDate: "2099-01-01", preferredTime: "15:30", appointment: "FORGED", timeline: "FORGED" }));
  assert.equal(response.status, 200);
  assert.match((await response.json()).message, /Pending confirmation/);
});

test("invalid submission IDs cannot reach Sheets", async () => {
  const post = handler(async url => { assert.ok(url.includes("siteverify")); return verified(); });
  assert.equal((await post(request({ ...payload, submissionId: "bad" }))).status, 400);
});
