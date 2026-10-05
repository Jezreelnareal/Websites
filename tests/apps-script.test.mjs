import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const code = fs.readFileSync(new URL("../apps-script/Code.gs", import.meta.url), "utf8");
const submission = {
  secret: "test-secret", submissionId: "6c7ab16c-83ee-4abe-857b-b022ee9ba634",
  name: "Alex", email: "alex@example.com", requestType: "inquiry", projectType: "Website",
  message: "Hello\nSecond line", timeline: "Next month", notificationMode: "apps-script",
};

// Entire Google runtime is mocked: no credentials, network, emails or real sheet writes.
function runtime() {
  const rows = [Array(10).fill("").concat("Confirmation status", "Owner notification status")];
  const properties = { FORM_SECRET: "test-secret", SPREADSHEET_ID: "test-sheet", OWNER_EMAIL: "owner@example.com" };
  const sent = [];
  const state = { quota: 100, failTo: "", locked: false, failAppend: false };
  const range = (row, column, height = 1, width = 1) => ({
    getValue: () => rows[row - 1]?.[column - 1] ?? "",
    setValue: value => { rows[row - 1][column - 1] = value; },
    getValues: () => Array.from({ length: height }, (_, r) => Array.from({ length: width }, (_, c) => rows[row + r - 1]?.[column + c - 1] ?? "")),
    getDisplayValues() { return this.getValues().map(r => r.map(String)); },
    setNumberFormat() {},
    createTextFinder: value => ({
      matchEntireCell() { return this; }, matchCase() { return this; }, useRegularExpression() { return this; },
      findNext() {
        const index = rows.findIndex((r, i) => i >= row - 1 && i < row - 1 + height && r[column - 1] === value);
        return index < 0 ? null : { getRow: () => index + 1 };
      },
    }),
  });
  const sheet = {
    getRange: range, getLastRow: () => rows.length, getMaxRows: () => 1000,
    appendRow: row => {
      if (state.failAppend) throw Error("save failed");
      // Sheets consumes the leading apostrophe used to force literal text.
      rows.push(row.map(v => typeof v === "string" ? v.replace(/^'(?=[=+@-])/, "") : v));
    },
  };
  const lock = {
    waitLock() { state.locked = true; }, tryLock() { if (state.locked) return false; state.locked = true; return true; },
    hasLock: () => state.locked, releaseLock() { state.locked = false; },
  };
  const context = vm.createContext({
    console: { log() {}, error() {} },
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => properties[key], setProperty: (key, value) => { properties[key] = value; } }) },
    LockService: { getScriptLock: () => lock },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }), flush() {} },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
    MailApp: {
      getRemainingDailyQuota: () => state.quota,
      sendEmail: mail => {
        assert.ok(state.locked, "Send and status update must share the script lock");
        assert.ok(rows.length > 1, "Save before sending");
        if (mail.to === state.failTo) throw Error("mail unavailable");
        assert.ok(state.quota > 0); state.quota--; sent.push(mail);
      },
    },
  });
  vm.runInContext(code, context);
  return { rows, properties, sent, state, context, post: (data = submission) => context.doPost({ postData: { contents: JSON.stringify(data) } }) };
}

test("Apps Script saves one row, sends two separate designed messages and never resends completed mail", () => {
  const r = runtime();
  const result = r.post({ ...submission, ownerEmail: "attacker@example.com" });
  assert.equal(result.ok, true); assert.equal(result.notificationHandler, "apps-script");
  assert.equal(result.confirmationSent, true); assert.equal(result.ownerNotificationSent, true);
  assert.equal(r.rows.length, 2); assert.deepEqual(r.sent.map(m => m.to), [submission.email, "owner@example.com"]);
  assert.equal(r.sent[1].replyTo, submission.email);
  for (const mail of r.sent) { assert.ok(mail.body); assert.ok(mail.htmlBody.includes("nav-logo.png")); }
  assert.equal(r.post().duplicate, true); r.context.retryPendingConfirmations();
  assert.equal(r.rows.length, 2); assert.equal(r.sent.length, 2); assert.equal(r.state.locked, false);
});

test("owner failure stays Pending; scheduled retry does not repeat visitor mail", () => {
  const r = runtime(); r.state.failTo = "owner@example.com";
  assert.equal(r.post().ok, true); assert.equal(r.rows[1][10], "Sent"); assert.equal(r.rows[1][11], "Pending");
  r.state.failTo = ""; r.context.retryPendingConfirmations();
  assert.deepEqual(r.sent.map(m => m.to), [submission.email, "owner@example.com"]);
  assert.equal(r.rows[1][11], "Sent");
});

test("visitor failure does not prevent owner mail and retries independently", () => {
  const r = runtime(); r.state.failTo = submission.email;
  assert.equal(r.post().ok, true); assert.equal(r.rows[1][10], "Pending"); assert.equal(r.rows[1][11], "Sent");
  r.state.failTo = ""; r.post();
  assert.deepEqual(r.sent.map(m => m.to), ["owner@example.com", submission.email]);
});

test("exhausted quota saves both Pending then sends when allowance is available", () => {
  const r = runtime(); r.state.quota = 0;
  assert.equal(r.post().ok, true); assert.equal(r.sent.length, 0);
  assert.equal(r.rows[1][10], "Pending"); assert.equal(r.rows[1][11], "Pending");
  r.state.quota = 1; r.context.retryPendingConfirmations();
  assert.equal(r.rows[1][10], "Sent"); assert.equal(r.rows[1][11], "Pending");
  r.state.quota = 1; r.context.retryPendingConfirmations(); assert.equal(r.sent.length, 2);
});

test("deployment migration leaves old Resend notifications and historical rows alone", () => {
  const r = runtime(); const old = { ...submission }; delete old.notificationMode;
  r.post(old); assert.equal(r.sent.length, 1); assert.equal(r.rows[1][11], "");
  r.post(); r.context.retryPendingConfirmations(); assert.equal(r.sent.length, 1);
  r.rows[1][10] = ""; r.context.prepareOwnerNotifications();
  r.context.retryPendingConfirmations(); assert.equal(r.sent.length, 1);
});

test("preparation preserves properties and existing mail statuses and sends nothing", () => {
  const r = runtime(); r.rows[0][11] = "";
  r.context.prepareOwnerNotifications();
  assert.equal(r.properties.FORM_SECRET, "test-secret");
  assert.equal(r.properties.OWNER_EMAIL, "owner@example.com");
  assert.equal(r.rows[0][11], "Owner notification status"); assert.equal(r.sent.length, 0);
  r.rows[0][11] = "My unrelated data";
  assert.throws(() => r.context.prepareOwnerNotifications(), /Expected header/);
  assert.equal(r.rows[0][11], "My unrelated data");
});

test("bad secret, missing fields, recipient lists and invalid owner configuration cannot write or send", () => {
  for (const data of [{ ...submission, secret: "wrong" }, { ...submission, email: "" },
    { ...submission, email: "a@example.com,b@example.com" }]) {
    const r = runtime(); assert.equal(r.post(data).ok, false); assert.equal(r.rows.length, 1); assert.equal(r.sent.length, 0);
  }
  const r = runtime(); r.properties.OWNER_EMAIL = "bad";
  assert.equal(r.post().ok, false); assert.equal(r.rows.length, 1);
});

test("save failure never sends mail and releases lock", () => {
  const r = runtime(); r.state.failAppend = true;
  assert.equal(r.post().ok, false); assert.equal(r.sent.length, 0); assert.equal(r.state.locked, false);
});

test("owner HTML escapes untrusted content, preserves newlines and safely encodes reply drafts", () => {
  const r = runtime();
  r.post({ ...submission, name: '<img src=x onerror="alert(1)">',
    projectType: "Design & development?cc=another@example.com\r\nBcc: nobody@example.com",
    message: '<script>alert("hello")</script>\nSecond line & details', timeline: "<next month>" });
  const mail = r.sent[1];
  assert.ok(!mail.htmlBody.includes("<script>")); assert.ok(!mail.htmlBody.includes("<img src=x"));
  assert.ok(mail.htmlBody.includes("&lt;next month&gt;"));
  assert.ok(mail.htmlBody.includes("&lt;/script&gt;<br />Second line &amp; details"));
  assert.ok(!/[\r\n]/.test(mail.subject));
  const link = mail.htmlBody.match(/href="([^"]+)"[^>]*>Reply to sender/)[1];
  const draft = new URL(link.replaceAll("&amp;", "&").replaceAll("&#39;", "'"));
  assert.equal(decodeURIComponent(draft.pathname), submission.email);
  assert.deepEqual([...draft.searchParams.keys()], ["subject", "body"]);
  assert.ok(!/[\r\n]/.test(draft.searchParams.get("subject")));
  assert.ok(draft.searchParams.get("body").includes("[Add your response and suggested next steps here]"));
});

test("call emails preserve date/time, pending status and the existing reply draft", () => {
  const r = runtime(); r.post({ ...submission, requestType: "appointment", preferredDate: "2099-01-01", preferredTime: "15:30" });
  for (const mail of r.sent) assert.match(mail.body, /pending confirmation/i);
  const mail = r.sent[1];
  for (const body of [mail.body, mail.htmlBody]) {
    assert.ok(body.includes("2099-01-01 at 15:30")); assert.ok(body.includes("Philippine time, UTC+8"));
    assert.ok(body.includes("30 minutes"));
  }
  const draft = new URL(mail.htmlBody.match(/href="([^"]+)"[^>]*>Reply to sender/)[1].replaceAll("&amp;", "&").replaceAll("&#39;", "'"));
  assert.ok(draft.searchParams.get("body").includes("Meeting link: [Add your Google Meet or Zoom link here]"));
});

test("formula-looking fields are stored literally and lock contention defers retry", () => {
  const r = runtime(); r.post({ ...submission, message: '=HYPERLINK("evil")' });
  assert.ok(r.sent[1].body.includes('=HYPERLINK("evil")'));
  assert.equal(vm.runInContext('safeText("=1+1", 100)', r.context), "'=1+1");
  r.state.locked = true; r.context.retryPendingConfirmations(); assert.equal(r.sent.length, 2);
});
