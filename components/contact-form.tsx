"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Copy, LoaderCircle } from "lucide-react";
import { TurnstileVerification } from "@/components/turnstile-verification";

const initialForm = {
  name: "",
  email: "",
  projectType: "Website / Web App",
  timeline: "",
  message: "",
  preferredDate: "",
  preferredTime: "",
};
const projectTypes = [
  "Website / Web App",
  "Frontend Development",
  "Backend / System",
  "Blockchain Project",
  "Graphic Design",
  "Video Editing",
  "Something else",
];

export function ContactForm() {
  const [intent, setIntent] = useState<"inquiry" | "appointment">("inquiry");
  const isAppointment = intent === "appointment";
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const update = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setStatus(null);
    setCopied(false);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;
    if (!turnstileToken) {
      setStatus({
        type: "error",
        message: "Please complete the verification before sending.",
      });
      return;
    }
    if (!form.name.trim() || !form.message.trim()) {
      setStatus({
        type: "error",
        message: "Please add your name and a short message.",
      });
      return;
    }
    if (isAppointment) {
      const requestedTime = new Date(
        `${form.preferredDate}T${form.preferredTime}:00+08:00`,
      );
      if (
        !Number.isFinite(requestedTime.getTime()) ||
        requestedTime.getTime() <= Date.now()
      ) {
        setStatus({
          type: "error",
          message: "Choose a future date and time in Philippine time (UTC+8).",
        });
        return;
      }
    }
    setIsSending(true);
    setStatus(null);
    setTurnstileToken("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, intent, turnstileToken }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(
          result?.message ||
            "Couldn't send your message. Try again or email me directly.",
        );
      setForm(initialForm);
      setStatus({
        type: "success",
        message: isAppointment
          ? "Call request sent — pending confirmation. I'll email you to agree on a time and share the meeting link."
          : "Message sent. Thanks for getting in touch!",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Couldn't send your message. Try again or email me directly.",
      });
    } finally {
      setIsSending(false);
      // Cloudflare tokens are single-use, including attempts where email fails.
      setTurnstileToken("");
      setVerificationAttempt((attempt) => attempt + 1);
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Name: ${form.name}\nEmail: ${form.email}\nProject: ${form.projectType}\n${
          isAppointment
            ? `Call request: ${form.preferredDate} at ${form.preferredTime} (Philippine time, UTC+8), 30 minutes, pending confirmation`
            : `Timeline: ${form.timeline || "Not specified"}`
        }\n\n${form.message}`,
      );
      setCopied(true);
    } catch {
      setStatus({
        type: "error",
        message: "Copy didn't work. You can select and copy the text instead.",
      });
    }
  };
  return (
    <form className="contact-form" onSubmit={submit}>
      <div
        className="contact-intent"
        role="group"
        aria-label="How would you like to connect?"
      >
        {(
          [
            ["inquiry", "Send an inquiry"],
            ["appointment", "Request a call"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={intent === value}
            disabled={isSending}
            onClick={() => {
              if (intent === value) return;
              setIntent(value);
              setStatus(null);
              setCopied(false);
              setTurnstileToken("");
              setVerificationAttempt((attempt) => attempt + 1);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {isAppointment && (
        <div className="appointment-note">
          <strong>A 30-minute introduction.</strong>A little time to meet,
          explore your idea, and see how I can help. Suggest a time below. I&apos;ll
          confirm availability and send a meeting link by email.
        </div>
      )}
      <p className="form-intro">
        A few details to get started.<span>* Required</span>
      </p>
      <fieldset disabled={isSending} aria-busy={isSending}>
        <legend className="sr-only">Your contact and project details</legend>
        <div className="form-pair">
          <label htmlFor="name">
            Your name *
            <input
              id="name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="What should I call you?"
              maxLength={120}
              required
            />
          </label>
          <label htmlFor="email">
            Email address *
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="you@example.com"
              maxLength={180}
              required
            />
          </label>
        </div>
        <div className="form-pair">
          <div>
            <label htmlFor="project-type">What do you need?</label>
            <select
              id="project-type"
              name="projectType"
              value={form.projectType}
              onChange={(event) => update("projectType", event.target.value)}
            >
              {projectTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          {!isAppointment && (
            <label htmlFor="timeline">
              Timeline <span>(optional)</span>
              <input
                id="timeline"
                name="timeline"
                value={form.timeline}
                onChange={(event) => update("timeline", event.target.value)}
                placeholder="A date, or flexible"
                maxLength={120}
              />
            </label>
          )}
        </div>
        {isAppointment && (
          <>
            <div className="form-pair">
              <label htmlFor="preferred-date">
                Preferred date *
                <input
                  id="preferred-date"
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={(event) =>
                    update("preferredDate", event.target.value)
                  }
                  aria-describedby="appointment-timezone"
                  required
                />
              </label>
              <label htmlFor="preferred-time">
                Preferred time *
                <input
                  id="preferred-time"
                  name="preferredTime"
                  type="time"
                  value={form.preferredTime}
                  onChange={(event) =>
                    update("preferredTime", event.target.value)
                  }
                  aria-describedby="appointment-timezone"
                  required
                />
              </label>
            </div>
            <p className="appointment-timezone" id="appointment-timezone">
              Philippine time (UTC+8) · 30 minutes
              <br />
              This is a request. Your appointment is pending until I confirm it
              by email.
            </p>
          </>
        )}
        <label htmlFor="message">
          {isAppointment
            ? "What would you like to discuss? *"
            : "Tell me about it *"}
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder={
              isAppointment
                ? "A little about your idea and what you'd like to cover on our call."
                : "The idea, what you need help with, and anything else I should know."
            }
            rows={5}
            maxLength={3000}
            required
          />
        </label>
        <TurnstileVerification
          key={verificationAttempt}
          onToken={setTurnstileToken}
        />
        <div className="form-actions">
          <button
            type="submit"
            className="send-button"
            disabled={isSending || !turnstileToken}
            aria-describedby="contact-verification-status"
          >
            {isSending
              ? "Sending…"
              : isAppointment
                ? "Request a call"
                : "Send message"}
            {isSending ? (
              <LoaderCircle
                size={20}
                className="send-spinner"
                aria-hidden="true"
              />
            ) : (
              <ArrowUpRight size={20} aria-hidden="true" />
            )}
          </button>
          <span>
            {isAppointment ? "I'll confirm by email." : "No long brief needed."}
          </span>
        </div>
      </fieldset>
      <div aria-live="polite" aria-atomic="true" className="form-status">
        {status && (
          <p
            className={status.type === "error" ? "form-error" : "form-success"}
          >
            {status.type === "success" && <CheckCircle2 size={18} />}
            {status.message}
          </p>
        )}
      </div>
      {status?.type === "error" && (
        <button type="button" className="text-link" onClick={copy}>
          <Copy size={15} />
          {copied ? "Message copied" : "Copy your message"}
        </button>
      )}
    </form>
  );
}
