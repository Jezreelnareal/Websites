import { NextResponse } from "next/server";

type ContactPayload = {
  name: string;
  email: string;
  projectType: string;
  timeline?: string;
  message: string;
  appointment?: string;
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
    payload.appointment
      ? "CALL REQUEST — PENDING CONFIRMATION"
      : "NEW PROJECT INQUIRY",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Project Type: ${payload.projectType}`,
    ...(payload.appointment
      ? [
          `Requested call: ${payload.appointment}`,
          "Status: Pending confirmation. Reply to agree on a time and share a meeting link.",
        ]
      : payload.timeline
        ? [`Timeline: ${payload.timeline}`]
        : []),
    "",
    payload.appointment ? "Discussion topic:" : "Message:",
    payload.message,
  ].join("\n");

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildReplyLink = (payload: ContactPayload) => {
  const subject = payload.appointment
    ? "Re: Your call request | Jezreel Borlongan"
    : `Re: ${payload.projectType.replace(/[\r\n]+/g, " ")} inquiry`;
  const message = [
    `Hi ${payload.name.replace(/[\r\n]+/g, " ")},`,
    "",
    ...(payload.appointment
      ? [
          "Thanks for reaching out. I'm happy to confirm our introductory call.",
          "",
          `Date and time: ${payload.appointment}`,
          `Topic: ${payload.projectType}`,
          "Meeting link: [Add your Google Meet or Zoom link here]",
          "",
          "If you need to reschedule, please reply to this email.",
          "Looking forward to discussing your project!",
        ]
      : [
          `Thanks for getting in touch about your ${payload.projectType} project.`,
          ...(payload.timeline
            ? [`Your preferred timeline: ${payload.timeline}`]
            : []),
          "",
          "[Add your response and suggested next steps here]",
        ]),
    "",
    "Best,",
    "Jezreel Borlongan",
  ].join("\r\n");

  return `mailto:${encodeURIComponent(payload.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
};

const buildHtmlEmail = (payload: ContactPayload) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${payload.appointment ? "New call request" : "New portfolio inquiry"}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0e0f0f; color:#e8e5dc; font-family:Arial, Helvetica, sans-serif; -webkit-text-size-adjust:100%;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">${escapeHtml(payload.name)} · ${escapeHtml(payload.appointment || payload.projectType)}${payload.appointment ? " · Pending confirmation" : ""}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#0e0f0f" style="background-color:#0e0f0f;">
      <tr>
        <td align="left" style="padding:28px 20px;">
          <!--[if mso]><table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; table-layout:fixed;">
            <tr>
              <td style="overflow-wrap:anywhere; word-wrap:break-word;">
                <img src="https://jezreel-portfolio.vercel.app/pics/nav-logo.png" width="42" height="49" alt="JB" style="display:block; width:42px; height:49px; margin:0 0 24px; border:0; color:#d9c5a3; font-family:Georgia, serif; font-size:24px;" />
                <h1 style="margin:0 0 20px; color:#e8e5dc; font-size:24px; font-weight:bold; line-height:32px;">${payload.appointment ? "Call request" : "New project inquiry"}</h1>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="table-layout:fixed;">
                  ${
                    payload.appointment
                      ? `<tr><td style="padding:0 0 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="table-layout:fixed;"><tr>
                      <td style="padding:0;">
                        <p style="margin:0 0 8px; color:#d9c5a3; font-size:12px; font-weight:bold; line-height:20px;">Pending confirmation</p>
                        <p style="margin:0 0 4px; color:#a5a6a0; font-size:12px; line-height:20px;">Requested date &amp; time</p>
                        <p style="margin:0; color:#e8e5dc; font-size:16px; font-weight:bold; line-height:26px;">${escapeHtml(payload.appointment)}</p>
                        <p style="margin:12px 0 0; color:#a5a6a0; font-size:13px; line-height:22px;">Reply to confirm or suggest another time. Include a meeting link when confirming.</p>
                      </td>
                    </tr></table>
                  </td></tr>`
                      : ""
                  }
                  <tr><td style="padding:0 0 18px;">
                    <p style="margin:0; color:#e8e5dc; font-size:15px; line-height:24px;"><strong style="color:#a5a6a0;">From:</strong> ${escapeHtml(payload.name)}</p>
                    <a href="mailto:${escapeHtml(encodeURIComponent(payload.email))}" style="color:#d9c5a3; font-size:14px; line-height:24px; text-decoration:underline; word-break:break-all;">${escapeHtml(payload.email)}</a>
                  </td></tr>
                  <tr><td style="padding:0 0 18px;">
                    <p style="margin:0; color:#e8e5dc; font-size:15px; line-height:24px;"><strong style="color:#a5a6a0;">Project:</strong> ${escapeHtml(payload.projectType)}</p>
                  </td></tr>
                  ${
                    !payload.appointment && payload.timeline
                      ? `<tr><td style="padding:0 0 18px;">
                    <p style="margin:0; color:#e8e5dc; font-size:15px; line-height:24px;"><strong style="color:#a5a6a0;">Timeline:</strong> ${escapeHtml(payload.timeline)}</p>
                  </td></tr>`
                      : ""
                  }
                  <tr><td style="padding:6px 0 0;">
                    <p style="margin:0 0 10px; color:#a5a6a0; font-size:14px; font-weight:bold; line-height:22px;">${payload.appointment ? "Discussion topic" : "Message"}</p>
                    <p style="margin:0; color:#e8e5dc; font-size:15px; line-height:26px; overflow-wrap:anywhere; word-wrap:break-word;">${escapeHtml(payload.message).replace(/\r\n|\r|\n/g, "<br />")}</p>
                  </td></tr>
                  <tr><td style="padding:20px 0 0;">
                    <a href="mailto:${escapeHtml(encodeURIComponent(payload.email))}" style="display:inline-block; padding:10px 0; color:#d9c5a3; font-size:14px; font-weight:bold; line-height:24px; text-decoration:underline;">Reply to sender &nbsp; &#8599;</a>
                  </td></tr>
                </table>
              </td>
            </tr>
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

  if (
    body.intent !== undefined &&
    body.intent !== "inquiry" &&
    body.intent !== "appointment"
  ) {
    return NextResponse.json(
      { message: "Please choose an inquiry or a call request." },
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

  if (body.intent === "appointment") {
    const date =
      typeof body.preferredDate === "string" ? body.preferredDate : "";
    const time =
      typeof body.preferredTime === "string" ? body.preferredTime : "";
    const requested = new Date(`${date}T${time}:00+08:00`);
    const timestamp = requested.getTime();
    // Compare the wall-clock date too: JavaScript otherwise normalizes dates such as February 30.
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !/^\d{2}:\d{2}$/.test(time) ||
      !Number.isFinite(timestamp) ||
      timestamp <= Date.now() ||
      new Date(timestamp + 8 * 60 * 60 * 1000).toISOString().slice(0, 16) !==
        `${date}T${time}`
    ) {
      return NextResponse.json(
        {
          message:
            "Choose a valid future date and time in Philippine time (UTC+8).",
        },
        { status: 400 },
      );
    }
    payload.appointment = `${new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(requested)} (Philippine time, UTC+8) · 30 minutes`;
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
  const subject = `${payload.appointment ? "Call Request" : "Project Inquiry"} from ${payload.name}`;

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

  return NextResponse.json({
    message: payload.appointment
      ? "Call request sent. Pending confirmation by email."
      : "Message sent successfully.",
  });
}
