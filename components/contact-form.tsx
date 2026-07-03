"use client";

import {
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  useState
} from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Send,
  TriangleAlert
} from "lucide-react";

type ContactFormState = {
  name: string;
  email: string;
  projectType: string;
  timeline: string;
  message: string;
};

type FormStatus = {
  type: "success" | "error";
  message: string;
};

const initialForm: ContactFormState = {
  name: "",
  email: "",
  projectType: "Website / Web App",
  timeline: "",
  message: ""
};

const fieldClass =
  "h-12 w-full border border-white/10 bg-[#464646]/20 px-4 text-sm text-[#ededed] outline-none transition placeholder:text-[#ededed]/42 focus:border-[#dac5a7]/70 focus:bg-[#464646]/28";

const projectTypes = [
  "Website / Web App",
  "Frontend Development",
  "Backend / System",
  "Blockchain Project",
  "Graphic Design",
  "Video Editing"
];

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const buildEmailBody = (form: ContactFormState) =>
  [
    `Name: ${form.name.trim()}`,
    `Email: ${form.email.trim()}`,
    `Project Type: ${form.projectType}`,
    `Timeline: ${form.timeline.trim() || "Not specified"}`,
    "",
    "Message:",
    form.message.trim()
  ].join("\n");

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [status, setStatus] = useState<FormStatus | null>(null);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleChange =
    (field: keyof ContactFormState) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value
      }));

      if (status) {
        setStatus(null);
      }
    };

  const handleProjectTypeChange = (projectType: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      projectType
    }));
    setIsProjectMenuOpen(false);

    if (status) {
      setStatus(null);
    }
  };

  const handleProjectMenuBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocus = event.relatedTarget;

    if (!nextFocus || !event.currentTarget.contains(nextFocus as Node)) {
      setIsProjectMenuOpen(false);
    }
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return "Please complete your name, email, and message.";
    }

    if (!isValidEmail(form.email)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validateForm();

    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    setIsSending(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const result = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(result?.message || "Message could not be sent.");
      }

      setForm(initialForm);
      setStatus({
        type: "success",
        message: result?.message || "Message sent successfully."
      });
    } catch (sendError) {
      setStatus({
        type: "error",
        message:
          sendError instanceof Error
            ? sendError.message
            : "Message could not be sent. Please try again."
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = async () => {
    const error = validateForm();

    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    try {
      await navigator.clipboard.writeText(buildEmailBody(form));
      setStatus({ type: "success", message: "Message copied." });
    } catch {
      setStatus({
        type: "error",
        message: "Copy failed. Please select and copy your message manually."
      });
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#dac5a7]/58"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange("name")}
            required
            placeholder="Your name"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#dac5a7]/58"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange("email")}
            required
            placeholder="your@email.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#dac5a7]/58"
            htmlFor="project-type"
          >
            Project
          </label>
          <div
            className="relative"
            onBlur={handleProjectMenuBlur}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setIsProjectMenuOpen(false);
              }
            }}
          >
            <input type="hidden" name="projectType" value={form.projectType} />
            <button
              type="button"
              id="project-type"
              aria-haspopup="listbox"
              aria-expanded={isProjectMenuOpen}
              aria-controls="project-type-options"
              onClick={() =>
                setIsProjectMenuOpen((currentValue) => !currentValue)
              }
              className={`${fieldClass} flex items-center justify-between gap-3 pr-3 text-left`}
            >
              <span>{form.projectType}</span>
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 flex-none text-[#dac5a7]/70 transition duration-300 ${
                  isProjectMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProjectMenuOpen ? (
              <div
                id="project-type-options"
                role="listbox"
                aria-label="Project type"
                className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden border border-[#dac5a7]/20 bg-[#101111]/95 shadow-[0_18px_45px_rgba(0,0,0,.36)] backdrop-blur-xl"
              >
                {projectTypes.map((projectType) => {
                  const isSelected = form.projectType === projectType;

                  return (
                    <button
                      key={projectType}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleProjectTypeChange(projectType)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition hover:bg-[#dac5a7]/[0.08] hover:text-[#dac5a7] ${
                        isSelected
                          ? "bg-[#dac5a7]/[0.07] text-[#dac5a7]"
                          : "text-[#ededed]/70"
                      }`}
                    >
                      <span>{projectType}</span>
                      {isSelected ? (
                        <Check aria-hidden="true" className="h-4 w-4" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <label
            className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#dac5a7]/58"
            htmlFor="timeline"
          >
            Timeline
          </label>
          <input
            type="text"
            id="timeline"
            name="timeline"
            value={form.timeline}
            onChange={handleChange("timeline")}
            placeholder="Optional"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label
          className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#dac5a7]/58"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange("message")}
          required
          placeholder="Tell me about your project."
          rows={6}
          className={`${fieldClass} min-h-40 resize-y py-3 leading-7`}
        />
      </div>

      {status ? (
        <p
          className={`flex items-center gap-2 text-sm ${
            status.type === "success" ? "text-[#dac5a7]" : "text-red-300"
          }`}
          aria-live="polite"
        >
          {status.type === "success" ? (
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
          ) : (
            <TriangleAlert aria-hidden="true" className="h-4 w-4" />
          )}
          <span>{status.message}</span>
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSending}
          className="inline-flex h-14 flex-1 items-center justify-center gap-3 border border-[#dac5a7]/35 bg-[#dac5a7]/[0.07] px-6 text-sm uppercase tracking-[0.14em] text-[#dac5a7] transition hover:border-[#dac5a7]/60 hover:bg-[#dac5a7]/[0.14] disabled:cursor-wait disabled:opacity-60"
          data-hover-load="button"
        >
          <Send aria-hidden="true" className="h-4 w-4" />
          <span>{isSending ? "Sending..." : "Send Message"}</span>
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-14 items-center justify-center gap-3 border border-white/10 bg-white/[0.03] px-6 text-sm text-[#ededed]/72 transition hover:border-[#dac5a7]/35 hover:text-[#dac5a7]"
          data-hover-load="button"
        >
          <Copy aria-hidden="true" className="h-4 w-4" />
          <span>Copy</span>
        </button>
      </div>
    </form>
  );
}
