// Source for scripts/build-contact-script.mjs. Paste generated Code.gs into Google.
// A:J retain existing headers; K tracks visitor mail, L tracks owner mail.

function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet.getSheetByName("Submissions")) {
    throw new Error('Rename your sheet tab to "Submissions" first.');
  }
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty("SPREADSHEET_ID", spreadsheet.getId());
  if (!properties.getProperty("FORM_SECRET")) {
    properties.setProperty("FORM_SECRET", Utilities.getUuid() + Utilities.getUuid());
  }
}

function doPost(event) {
  let lock;
  try {
    const data = JSON.parse(event.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty("FORM_SECRET");
    if (!secret || !data || data.secret !== secret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }
    const required = ["submissionId", "name", "email", "message"];
    if (required.some(key =>
      typeof data[key] !== "string" || !data[key].trim()
    )) {
      return jsonResponse({ ok: false, error: "Missing required details" });
    }
    if (
      !/^[a-zA-Z0-9_-]{16,100}$/.test(data.submissionId) ||
      !["inquiry", "appointment"].includes(data.requestType) ||
      !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(data.email) ||
      data.email.length > 180
    ) {
      return jsonResponse({ ok: false, error: "Invalid submission" });
    }

    lock = LockService.getScriptLock();
    lock.waitLock(10000);

    const sheet = SpreadsheetApp
      .openById(properties.getProperty("SPREADSHEET_ID"))
      .getSheetByName("Submissions");
    if (!sheet) throw new Error('Missing "Submissions" tab.');
    if (sheet.getRange(1, 11).getValue() !== "Confirmation status") {
      throw new Error('Set K1 to "Confirmation status" before deploying.');
    }
    const ownerNotifications = data.notificationMode === "apps-script";
    if (ownerNotifications) {
      if (sheet.getRange(1, 12).getValue() !== "Owner notification status") {
        throw new Error("Run prepareOwnerNotifications before deploying.");
      }
      ownerEmail(); // Check server-owned recipient configuration before saving.
    }

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existing = sheet
        .getRange(2, 1, lastRow - 1, 1)
        .createTextFinder(data.submissionId)
        .matchEntireCell(true)
        .matchCase(true)
        .useRegularExpression(false)
        .findNext();
      if (existing) {
        const delivery = sendRowEmails(sheet, existing.getRow());
        return jsonResponse({ ok: true, duplicate: true, ...delivery,
          notificationHandler: "apps-script" });
      }
    }

    const isCall = data.requestType === "appointment";
    // Preserve ISO dates and clock times as text, independent of sheet locale.
    const nextRow = sheet.getLastRow() + 1;
    if (nextRow > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 1);
    sheet.getRange(nextRow, 1, 1, 10).setNumberFormat("@");
    sheet.appendRow([
      data.submissionId,
      new Date().toISOString(),
      safeText(data.name, 120),
      safeText(data.email, 180),
      data.requestType,
      safeText(data.projectType, 120),
      isCall ? "" : safeText(data.timeline, 120),
      safeText(data.message, 3000),
      isCall ? safeText(data.preferredDate, 10) : "",
      isCall ? safeText(data.preferredTime, 5) : "",
      "Pending",
      // Old website versions still notify via Resend; do not send twice.
      ownerNotifications ? "Pending" : ""
    ]);
    SpreadsheetApp.flush();

    const delivery = sendRowEmails(sheet, sheet.getLastRow());
    return jsonResponse({ ok: true, ...delivery, notificationHandler: "apps-script" });
  } catch (error) {
    console.error(
      "Submission save failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return jsonResponse({ ok: false, error: "Could not save submission" });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function safeText(value, maxLength) {
  const text = typeof value === "string" ? value.trim().slice(0, maxLength) : "";
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function checkSpreadsheet() {
  const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("SPREADSHEET_ID is missing. Run setup.");
  const spreadsheet = SpreadsheetApp.openById(id);
  const sheet = spreadsheet.getSheetByName("Submissions");
  console.log("Target spreadsheet: " + spreadsheet.getUrl());
  if (!sheet) throw new Error('The "Submissions" tab was not found.');
  console.log("Spreadsheet access OK.");
  console.log("Last used row: " + sheet.getLastRow());
}

function sendConfirmationForRow(sheet, row) {
  const status = sheet.getRange(row, 11);
  if (status.getValue() === "Sent") return true;
  if (status.getValue() !== "Pending") return false;

  const email = String(sheet.getRange(row, 4).getValue()).trim();
  if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)) {
    status.setValue("Invalid email");
    return false;
  }

  const isCall = sheet.getRange(row, 5).getValue() === "appointment";
  status.setValue("Pending");
  try {
    if (MailApp.getRemainingDailyQuota() < 1) return false;
    MailApp.sendEmail({
      to: email,
      name: "Jezreel Borlongan",
      subject: isCall ? "Your call request has been received" : "Your inquiry has been received",
      htmlBody: buildConfirmationHtml(isCall),
      body: isCall
        ? "Hello,\n\nThanks for getting in touch! Your call request has been received.\n\nYour requested time is pending confirmation. I will reply to agree on a time and share a meeting link.\n\nBest,\nJezreel Borlongan"
        : "Hello,\n\nThanks for getting in touch! Your inquiry was submitted successfully.\n\nI will review your message and reply as soon as I can.\n\nBest,\nJezreel Borlongan",
    });
    status.setValue("Sent");
    SpreadsheetApp.flush();
    return true;
  } catch {
    console.error("Confirmation email is still pending. Check the email quota and permissions.");
    return false;
  }
}

function buildConfirmationHtml(isCall) {
  const title = isCall ? "Call request received." : "Inquiry received.";
  const intro = isCall
    ? "Thanks for getting in touch. Your call request has been submitted successfully."
    : "Thanks for getting in touch. Your inquiry has been submitted successfully.";
  const nextStep = isCall
    ? "Your requested time is pending confirmation. I will reply to agree on a time and share a meeting link."
    : "I will review your message and reply as soon as I can. In the meantime, you can reply to this email if you would like to add anything.";

  // The logo uses the same public asset as the portfolio. No additional
  // Apps Script permissions are required; clients may ask to show images.
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#101211;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${intro}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#101211" style="background-color:#101211;">
    <tr><td align="center" style="padding:32px 16px;">
      <!--[if mso]><table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#1b1e1c" style="max-width:560px;background-color:#1b1e1c;border:1px solid #343831;border-radius:12px;">
        <tr><td style="padding:30px 28px 26px;border-bottom:1px solid #343831;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td width="58" valign="middle"><img src="https://jezreel-portfolio.vercel.app/pics/nav-logo.png" width="42" height="49" alt="JB" style="display:block;width:42px;height:49px;border:0;color:#d9c5a3;font-family:Georgia,serif;font-size:24px;"></td>
              <td valign="middle" style="color:#eeeae2;font-size:14px;line-height:21px;font-weight:bold;">Jezreel Borlongan<br><span style="color:#a7ada4;font-size:12px;font-weight:normal;">A note from my portfolio</span></td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:32px 28px 12px;">
          <p style="margin:0 0 14px;color:#d9c5a3;font-size:11px;line-height:18px;font-weight:bold;letter-spacing:2px;">MESSAGE RECEIVED</p>
          <h1 style="margin:0 0 18px;color:#f1eee7;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:42px;font-weight:normal;">${title}</h1>
          <p style="margin:0;color:#c6cbc2;font-size:15px;line-height:25px;">${intro}</p>
        </td></tr>
        <tr><td style="padding:14px 28px 26px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#242922" style="background-color:#242922;border-left:2px solid #d9c5a3;">
            <tr><td style="padding:18px 20px;">
              <p style="margin:0 0 8px;color:#d9c5a3;font-size:11px;line-height:18px;font-weight:bold;letter-spacing:1px;">WHAT HAPPENS NEXT</p>
              <p style="margin:0;color:#d7dbd1;font-size:14px;line-height:23px;">${nextStep}</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 28px 32px;">
          <p style="margin:0 0 5px;color:#a7ada4;font-size:14px;line-height:22px;">Best,</p>
          <p style="margin:0;color:#eeeae2;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:30px;">Jezreel</p>
        </td></tr>
        <tr><td style="padding:18px 28px;border-top:1px solid #343831;">
          <a href="https://jezreel-portfolio.vercel.app" style="color:#d9c5a3;font-size:12px;line-height:20px;text-decoration:underline;">Visit my portfolio</a>
          <p style="margin:6px 0 0;color:#a7ada4;font-size:11px;line-height:18px;">An automatic acknowledgment of your form submission.</p>
        </td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body>
</html>`;
}

function authorizeConfirmationEmails() {
  console.log("Remaining email recipients today: " + MailApp.getRemainingDailyQuota());
}

// Keep this name so an existing hourly trigger continues working for both mails.
function retryPendingConfirmations() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
    const sheet = SpreadsheetApp.openById(id).getSheetByName("Submissions");
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return;
    const statuses = sheet.getRange(2, 11, lastRow - 1, 2).getValues();
    let attempted = 0;
    for (let index = 0; index < statuses.length; index++) {
      if (!statuses[index].includes("Pending")) continue;
      if (attempted >= 20 || MailApp.getRemainingDailyQuota() < 1) break;
      sendRowEmails(sheet, index + 2);
      attempted++;
    }
  } finally {
    lock.releaseLock();
  }
}

function ownerEmail() {
  const email = PropertiesService.getScriptProperties().getProperty("OWNER_EMAIL") || "";
  if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)) {
    throw new Error("Set OWNER_EMAIL to one valid address in Script Properties.");
  }
  return email;
}

// Run once in the editor. This prepares columns/properties and sends no email.
function prepareOwnerNotifications() {
  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty("OWNER_EMAIL")) {
    properties.setProperty("OWNER_EMAIL", "jezreelborlongan7@gmail.com");
  }
  ownerEmail();
  const sheet = SpreadsheetApp.openById(properties.getProperty("SPREADSHEET_ID"))
    .getSheetByName("Submissions");
  if (!sheet) throw new Error('Missing "Submissions" tab.');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    ["Confirmation status", "Owner notification status"].forEach((header, index) => {
      const cell = sheet.getRange(1, 11 + index);
      const existing = cell.getValue();
      if (existing && existing !== header) throw new Error("Expected header: " + header);
    });
    sheet.getRange(1, 11).setValue("Confirmation status");
    sheet.getRange(1, 12).setValue("Owner notification status");
    SpreadsheetApp.flush();
    console.log("Email columns ready. No email sent. Existing rows were not queued.");
  } finally {
    lock.releaseLock();
  }
}

function sendRowEmails(sheet, row) {
  const results = {};
  // One mail failure must not prevent the other mail or turn a saved row into an error.
  [["confirmationSent", sendConfirmationForRow], ["ownerNotificationSent", sendOwnerForRow]]
    .forEach(([key, send]) => {
      try { results[key] = send(sheet, row); }
      catch { results[key] = false; console.error(key + " is pending. Check execution logs and configuration."); }
    });
  return results;
}

function sendOwnerForRow(sheet, row) {
  const status = sheet.getRange(row, 12);
  if (status.getValue() === "Sent") return true;
  // Blank historical rows belong to the old Resend flow. Never backfill automatically.
  if (status.getValue() !== "Pending") return false;
  if (MailApp.getRemainingDailyQuota() < 1) return false;
  const values = sheet.getRange(row, 1, 1, 10).getDisplayValues()[0];
  const email = values[3].trim();
  if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)) {
    status.setValue("Invalid email");
    return false;
  }
  const isCall = values[4] === "appointment";
  const payload = {
    name: values[2], email, projectType: values[5],
    timeline: isCall ? "" : values[6], message: values[7],
    appointment: isCall
      ? `${values[8]} at ${values[9]} (Philippine time, UTC+8) · 30 minutes`
      : undefined,
  };
  MailApp.sendEmail({
    to: ownerEmail(),
    replyTo: email,
    name: "Portfolio inquiries",
    subject: `${isCall ? "Call Request" : "Project Inquiry"} from ${payload.name.replace(/[\r\n]+/g, " ")}`,
    body: buildTextEmail(payload),
    htmlBody: buildHtmlEmail(payload),
  });
  status.setValue("Sent");
  SpreadsheetApp.flush();
  return true;
}

