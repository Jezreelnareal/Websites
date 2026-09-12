"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Copy, LoaderCircle } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  projectType: "Website / Web App",
  timeline: "",
  message: "",
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
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const update = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setStatus(null);
    setCopied(false);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;
    if (!form.name.trim() || !form.message.trim()) {
      setStatus({
        type: "error",
        message: "Please add your name and a short message.",
      });
      return;
    }
    setIsSending(true);
    setStatus(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(
          response.status === 503
            ? "The form is unavailable right now. Please email me directly."
            : result?.message ||
                "Couldn't send your message. Try again or email me directly.",
        );
      setForm(initialForm);
      setStatus({
        type: "success",
        message: "Message sent. Thanks for getting in touch!",
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
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Name: ${form.name}\nEmail: ${form.email}\nProject: ${form.projectType}\nTimeline: ${form.timeline || "Not specified"}\n\n${form.message}`,
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
          <label htmlFor="timeline">
            Timeline <span>(optional)</span>
            <input
              id="timeline"
              name="timeline"
              value={form.timeline}
              onChange={(event) => update("timeline", event.target.value)}
              placeholder="A date, or just exploring"
              maxLength={120}
            />
          </label>
        </div>
        <label htmlFor="message">
          Tell me about it *
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder="The idea, what you need help with, and anything else I should know."
            rows={5}
            maxLength={3000}
            required
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="send-button">
            {isSending ? "Sending…" : "Send message"}
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
          <span>No long brief needed.</span>
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
