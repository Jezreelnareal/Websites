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
    payload.message
  ].join("\n");

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildHtmlEmail = (payload: ContactPayload) => `
  <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
    <h2 style="margin: 0 0 16px;">New Portfolio Inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Project Type:</strong> ${escapeHtml(payload.projectType)}</p>
    <p><strong>Timeline:</strong> ${escapeHtml(
      payload.timeline || "Not specified"
    )}</p>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
    <p style="white-space: pre-wrap;">${escapeHtml(payload.message)}</p>
  </div>
`;

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        message:
          "The contact form is not configured yet. Add RESEND_API_KEY to enable direct sending."
      },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { message: "Invalid form submission." },
      { status: 400 }
    );
  }

  const payload: ContactPayload = {
    name: normalizeText(body.name, 120),
    email: normalizeText(body.email, 180),
    projectType: normalizeText(body.projectType, 120) || "Project Inquiry",
    timeline: normalizeText(body.timeline, 120),
    message: normalizeText(body.message, 3000)
  };

  if (!payload.name || !payload.email || !payload.message) {
    return NextResponse.json(
      { message: "Please complete your name, email, and message." },
      { status: 400 }
    );
  }

  if (!isValidEmail(payload.email)) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || fallbackToEmail;
  const fromEmail = process.env.RESEND_FROM_EMAIL || defaultFromEmail;
  const subject = `Project Inquiry from ${payload.name}`;

  const resendResponse = await fetch(resendApiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: payload.email,
      subject,
      text: buildTextEmail(payload),
      html: buildHtmlEmail(payload)
    })
  });

  if (!resendResponse.ok) {
    return NextResponse.json(
      {
        message:
          "Message could not be sent right now. Please try again or copy your message."
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: "Message sent successfully." });
}
