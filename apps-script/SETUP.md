# Switch both portfolio emails to Apps Script

Deploy the Google script FIRST, then the website. Website source changes alone
do not update your existing Google Apps Script deployment.

1. Run `npm run build:contact-script`, then open the generated
   `apps-script/Code.gs` and copy the entire file. This bundle is ignored by Git;
   the source files and generator are committed instead.
2. In your existing **Portfolio Form Connection** Apps Script project, replace
   the contents of `Code.gs` and save. Keep the same project and Script Properties;
   do not regenerate `FORM_SECRET` or change `SPREADSHEET_ID`.
3. Select **prepareOwnerNotifications** in the editor's function dropdown and
   click **Run**. This sends no email. It keeps K1 as **Confirmation status** and
   adds L1 **Owner notification status**. It leaves existing row statuses alone.
   Column L must be unused or already have that exact heading.
4. Under **Project Settings → Script Properties**, check **OWNER_EMAIL**.
   Preparation defaults it to `jezreelborlongan7@gmail.com` only if absent.
   This is the address that receives your inquiry details. It is never taken
   from the visitor's request. Keep your existing spreadsheet ID and secret.
5. Run **authorizeConfirmationEmails** if you need to authorize email access.
   This logs remaining quota without sending anything.
6. Open **Triggers** (alarm-clock icon). Keep your existing hourly trigger for
   **retryPendingConfirmations**. If absent, add one: function
   `retryPendingConfirmations`, deployment **Head**, source **Time-driven**,
   **Hour timer**, **Every hour**. Do not create a second copy of the same trigger.
   Despite its old name, it now retries both kinds of email.
7. Choose **Deploy → Manage deployments → Edit (pencil) → New version → Deploy**.
   Retain **Execute as: Me** and **Who has access: Anyone**. The shared secret
   still authenticates submissions. Update the existing deployment so its `/exec`
   URL stays the same; don't create a separate deployment.
8. Commit/push the website changes and let Vercel deploy them. Keep these variables
   in Vercel and `.env.local`:
   - `GOOGLE_SHEETS_WEBHOOK_URL` — existing `/exec` URL
   - `GOOGLE_SHEETS_WEBHOOK_SECRET` — matches Apps Script `FORM_SECRET`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET_KEY`
   `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONTACT_TO_EMAIL` are no longer used
   by this route. They can remain during rollout; remove them afterward if no
   other application feature uses them. Do not remove old deployment settings
   before the new website is live.
9. Submit one inquiry with an email address you control. Expect one sheet row,
   a visitor acknowledgment, and an owner notification. Check K and L become
   **Sent**. Reply on the owner notification should address the visitor.
   Test a call request too: it should remain pending confirmation, with the date
   and time shown in Philippine time. No calendar booking occurs automatically.

## Sending status and retries

- **Sent** means MailApp accepted the send, not that it reached the inbox.
- **Pending** means an email is waiting for allowance or a retry. The inquiry is
  still saved successfully. The hourly trigger processes at most 20 pending rows
  (up to 40 recipients), stopping when the email quota is depleted.
- **Invalid email** means a saved recipient address needs correction. After
  correcting it, set that email's status to **Pending** to retry it.
- Blank status cells on historical rows are skipped. They are not automatically
  converted into a backlog of new emails.
- If **Pending** persists, check Apps Script Executions, the trigger, permissions,
  quota, and `OWNER_EMAIL`. Google enforces per-account sending quotas.

Retries use the submission ID and separate K/L statuses to avoid normal duplicate
rows and repeat emails. MailApp has no idempotency key: an interruption after the
send but before the status is saved can still cause a duplicate on retry.

Both messages are sent by the Google account running the script. A notification
to that same account is effectively mail to yourself; check All Mail/Sent as
well as Inbox/Spam. Sending with Google does not guarantee inbox placement.

## Rollout compatibility

The new website includes `notificationMode: "apps-script"`. Only new rows with
that flag queue owner mail. The previous website can therefore keep sending its
owner notifications through Resend while the script is upgraded first. Existing
rows without an owner status stay untouched even if resubmitted later.

The website checks the script response for `notificationHandler: "apps-script"`
to detect an outdated deployment. If you accidentally deploy the website first,
the old script may save the row before the website displays an error. Update the
script, inspect that row, and manually set L to **Pending** only if no owner email
was already sent. Do not blindly queue historical rows.

## Maintaining the code

Edit `apps-script/receiver.gs` for saving, confirmation templates and retry logic.
Edit `lib/contact/email.ts` for the owner's existing HTML/text and reply drafts.
Then run `npm run build:contact-script` to regenerate `apps-script/Code.gs`.
Copy the generated file to Google and deploy a new version after every script
change. `npm test` regenerates the bundle and tests provider
failures with mocked Google services; it sends no emails.

References: [MailApp](https://developers.google.com/apps-script/reference/mail/mail-app),
[quotas](https://developers.google.com/apps-script/guides/services/quotas),
[updating deployments](https://developers.google.com/apps-script/concepts/deployments).
