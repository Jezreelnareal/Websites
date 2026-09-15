import { NextResponse } from "next/server";

type ContactPayload = {
  name: string;
  email: string;
  projectType: string;
  timeline?: string;
  message: string;
};

const resendApiUrl = "https://api.resend.com/emails";
const fallbackToEmail = "jezreelborlongan7@gmail.com";
const defaultFromEmail = "Portfolio Contact <onboarding@resend.dev>";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const normalizeText = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
};

const buildTextEmail = (payload: ContactPayload) =>
  [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Project Type: ${payload.projectType}`,
    `Timeline: ${payload.timeline || "Not specified"}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildHtmlEmail = (payload: ContactPayload) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New portfolio inquiry</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0e0f0f; color:#e8e5dc; font-family:Arial, Helvetica, sans-serif; -webkit-text-size-adjust:100%;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">A new inquiry from ${escapeHtml(payload.name)} about ${escapeHtml(payload.projectType)}.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#0e0f0f" style="background-color:#0e0f0f;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <!--[if mso]><table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; table-layout:fixed;">
            <tr>
              <td style="padding:0 8px 28px;">
                <p style="margin:0; color:#d9c5a3; font-size:15px; font-weight:bold; line-height:24px;">Jezreel Borlongan<span style="color:#a5a6a0; font-weight:normal;"> / Portfolio</span></p>
              </td>
            </tr>
            <tr>
              <td bgcolor="#191b19" style="background-color:#191b19; border:1px solid #333630; border-radius:16px; padding:32px 24px; overflow-wrap:anywhere; word-wrap:break-word;">
                <p style="margin:0 0 18px; color:#d9c5a3; font-size:11px; font-weight:bold; letter-spacing:2px; line-height:18px; text-transform:uppercase;">Let's talk / New inquiry</p>
                <h1 style="margin:0 0 14px; color:#e8e5dc; font-size:32px; font-weight:normal; line-height:40px;">A new idea.<br /><em style="color:#d9c5a3; font-family:Georgia, 'Times New Roman', serif; font-size:40px; line-height:48px;">A new connection.</em></h1>
                <p style="margin:0 0 28px; color:#a5a6a0; font-size:14px; line-height:24px;">Someone reached out through your portfolio. Here are the details.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="table-layout:fixed;">
                  <tr><td style="padding:0 0 18px;">
                    <p style="margin:0 0 5px; color:#a5a6a0; font-size:11px; letter-spacing:1px; line-height:18px; text-transform:uppercase;">From</p>
                    <p style="margin:0; color:#e8e5dc; font-size:18px; font-weight:bold; line-height:26px;">${escapeHtml(payload.name)}</p>
                    <a href="mailto:${escapeHtml(encodeURIComponent(payload.email))}" style="color:#d9c5a3; font-size:14px; line-height:24px; text-decoration:underline; word-break:break-all;">${escapeHtml(payload.email)}</a>
                  </td></tr>
                  <tr><td style="padding:0 0 18px;">
                    <p style="margin:0 0 5px; color:#a5a6a0; font-size:11px; letter-spacing:1px; line-height:18px; text-transform:uppercase;">Project</p>
                    <p style="margin:0; color:#e8e5dc; font-size:15px; line-height:24px;">${escapeHtml(payload.projectType)}</p>
                  </td></tr>
                  <tr><td style="padding:0 0 26px;">
                    <p style="margin:0 0 5px; color:#a5a6a0; font-size:11px; letter-spacing:1px; line-height:18px; text-transform:uppercase;">Timeline</p>
                    <p style="margin:0; color:#e8e5dc; font-size:15px; line-height:24px;">${escapeHtml(payload.timeline || "Not specified")}</p>
                  </td></tr>
                  <tr><td bgcolor="#0e0f0f" style="padding:20px; background-color:#0e0f0f; border-radius:10px; border-left:2px solid #d9c5a3;">
                    <p style="margin:0 0 12px; color:#d9c5a3; font-size:11px; letter-spacing:1px; line-height:18px; text-transform:uppercase;">The idea</p>
                    <p style="margin:0; color:#e8e5dc; font-size:15px; line-height:26px; overflow-wrap:anywhere; word-wrap:break-word;">${escapeHtml(payload.message).replace(/\r\n|\r|\n/g, "<br />")}</p>
                  </td></tr>
                  <tr><td style="padding:28px 0 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
                      <td bgcolor="#d9c5a3" style="background-color:#d9c5a3; border-radius:6px; text-align:center; mso-padding-alt:16px 24px;">
                        <a href="mailto:${escapeHtml(encodeURIComponent(payload.email))}" style="display:inline-block; padding:16px 24px; color:#0e0f0f; font-size:14px; font-weight:bold; line-height:20px; text-decoration:none;">Reply to inquiry &nbsp; &#8599;</a>
                      </td>
                    </tr></table>
                    <p style="margin:14px 0 0; color:#a5a6a0; font-size:12px; line-height:20px;">You can also reply directly to this email to reach the sender.</p>
                  </td></tr>
                </table>
              </td>
            </tr>
            <tr><td style="padding:24px 8px 0;">
              <p style="margin:0; color:#a5a6a0; font-size:12px; line-height:20px;">Jezreel Borlongan<br />Web Designer &amp; Developer</p>
            </td></tr>
          </table>
          <!--[if mso]></td></tr></table><![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  if (!apiKey || !turnstileSecret) {
    return NextResponse.json(
      {
        message:
          "The contact form is unavailable right now. Please email me directly.",
      },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { message: "Invalid form submission." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { message: "Invalid form submission." },
      { status: 400 },
    );
  }

  const payload: ContactPayload = {
    name: normalizeText(body.name, 120),
    email: normalizeText(body.email, 180),
    projectType: normalizeText(body.projectType, 120) || "Project Inquiry",
    timeline: normalizeText(body.timeline, 120),
    message: normalizeText(body.message, 3000),
  };

  if (!payload.name || !payload.email || !payload.message) {
    return NextResponse.json(
      { message: "Please complete your name, email, and message." },
      { status: 400 },
    );
  }

  if (!isValidEmail(payload.email)) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const token = body.turnstileToken;
  if (typeof token !== "string" || !token.trim() || token.length > 2048) {
    return NextResponse.json(
      { message: "Please complete the verification before sending." },
      { status: 400 },
    );
  }

  try {
    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: turnstileSecret, response: token }),
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
      },
    );
    if (!verification.ok) throw new Error("Verification unavailable");
    const result = await verification.json();
    if (result?.success !== true || result?.action !== "contact") {
      return NextResponse.json(
        {
          message:
            "Verification failed or expired. Please verify again and retry.",
        },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json(
      {
        message:
          "Verification is unavailable right now. Please try again or email me directly.",
      },
      { status: 503 },
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || fallbackToEmail;
  const fromEmail = process.env.RESEND_FROM_EMAIL || defaultFromEmail;
  const subject = `Project Inquiry from ${payload.name}`;

  const resendResponse = await fetch(resendApiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: payload.email,
      subject,
      text: buildTextEmail(payload),
      html: buildHtmlEmail(payload),
    }),
  });

  if (!resendResponse.ok) {
    return NextResponse.json(
      {
        message:
          "Message could not be sent right now. Please try again or copy your message.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "Message sent successfully." });
}
