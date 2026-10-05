import { NextResponse } from "next/server";
import type { ContactPayload } from "@/lib/contact/email";
import { randomUUID } from "node:crypto";
import { saveToGoogleSheets } from "@/lib/contact/google-sheets";

const isValidEmail = (email: string) =>
  /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email.trim());

const normalizeText = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
};

export async function POST(request: Request) {
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  if (
    !turnstileSecret ||
    !process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    !process.env.GOOGLE_SHEETS_WEBHOOK_SECRET
  ) {
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

  const submissionId =
    body.submissionId === undefined ? randomUUID() : body.submissionId;

  if (
    typeof submissionId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      submissionId,
    )
  ) {
    return NextResponse.json(
      { message: "Please refresh the page and try again." },
      { status: 400 },
    );
  }

  const isCall = body.intent === "appointment";

  try {
    await saveToGoogleSheets({
      submissionId,
      name: payload.name,
      email: payload.email,
      requestType: isCall ? "appointment" : "inquiry",
      projectType: payload.projectType,
      timeline: isCall ? "" : (payload.timeline ?? ""),
      message: payload.message,
      preferredDate: isCall ? normalizeText(body.preferredDate, 10) : "",
      preferredTime: isCall ? normalizeText(body.preferredTime, 5) : "",
    });
  } catch (error) {
    console.error(
      "Google Sheets save failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      {
        message:
          "Your submission could not be saved right now. Please retry without changing your details.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    message: payload.appointment
      ? "Call request sent. Pending confirmation by email."
      : "Message sent successfully.",
  });
}
