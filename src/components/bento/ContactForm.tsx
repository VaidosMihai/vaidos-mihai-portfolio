"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { CONTACT_EMAIL, FORMSUBMIT_ENDPOINT } from "@/lib/site";
import { getSafeFormSubmitUrl } from "@/lib/url";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const INQUIRY_TOPICS = [
  "Test Automation / QA Engineering",
  "Embedded & Automotive Systems",
  "Backend / C# .NET Architecture",
  "General Collaboration",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 3000;
const REQUEST_TIMEOUT_MS = 12000;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>(INQUIRY_TOPICS[0]);
  const [message, setMessage] = useState("");
  const [honey, setHoney] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [validationNotice, setValidationNotice] = useState("");

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const isSubmittingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      abortControllerRef.current?.abort();
    };
  }, []);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMsg = message.trim();

    if (trimmedName.length < 2) {
      next.name = "Please enter your name (at least 2 characters).";
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = "Please enter a valid email address.";
    }
    if (trimmedMsg.length < 10) {
      next.message = "Please include at least 10 characters in your message.";
    } else if (trimmedMsg.length > MAX_MESSAGE_LENGTH) {
      next.message = `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`;
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingRef.current || status === "submitting") return;

    const rawHoney = new FormData(e.currentTarget).get("_honey");
    const honeyValue =
      typeof rawHoney === "string" ? rawHoney.trim() : honey.trim();

    // Silent honeypot guard against automated bots (React or direct DOM fill)
    if (honeyValue.length > 0) {
      setErrors({});
      setValidationNotice("");
      setStatus("success");
      setFeedbackMessage("Thank you! Your inquiry has been received.");
      setName("");
      setEmail("");
      setTopic(INQUIRY_TOPICS[0]);
      setMessage("");
      setHoney("");
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("idle");
      setFeedbackMessage("");
      const errorCount = Object.keys(validationErrors).length;
      setValidationNotice(
        `Form not submitted. Please review ${errorCount} invalid ${errorCount === 1 ? "field" : "fields"}.`
      );
      if (validationErrors.name) nameInputRef.current?.focus();
      else if (validationErrors.email) emailInputRef.current?.focus();
      else if (validationErrors.message) messageInputRef.current?.focus();
      return;
    }

    const safeEndpoint = getSafeFormSubmitUrl(FORMSUBMIT_ENDPOINT);
    if (!safeEndpoint) {
      setValidationNotice("");
      setStatus("error");
      setFeedbackMessage(
        `Invalid FormSubmit endpoint configuration. Please email ${CONTACT_EMAIL} directly.`
      );
      return;
    }

    isSubmittingRef.current = true;
    setErrors({});
    setValidationNotice("");
    setStatus("submitting");
    setFeedbackMessage("");

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(safeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic,
          message: message.trim(),
          _subject: `Portfolio Inquiry (${topic}) — ${name.trim()}`,
          _replyto: email.trim(),
          _template: "table",
          _honey: honeyValue,
        }),
        signal: controller.signal,
      });

      const rawJson: unknown = await response.json().catch(() => null);
      const parsed =
        rawJson !== null && typeof rawJson === "object"
          ? (rawJson as { success?: boolean | string; message?: unknown })
          : null;

      const isSucceeded =
        response.ok &&
        (parsed === null ||
          parsed.success === true ||
          parsed.success === "true" ||
          parsed.success === undefined);

      if (!isSucceeded) {
        const serverMsg =
          parsed && typeof parsed.message === "string"
            ? parsed.message.trim()
            : "";
        throw new Error(
          serverMsg || `Delivery service responded with status ${response.status}.`
        );
      }

      setStatus("success");
      setFeedbackMessage(
        "Message sent successfully via FormSubmit! I will get back to you shortly."
      );
      setName("");
      setEmail("");
      setTopic(INQUIRY_TOPICS[0]);
      setMessage("");
    } catch (err) {
      setStatus("error");
      if (err instanceof DOMException && err.name === "AbortError") {
        setFeedbackMessage(
          `Request timed out. Please try again or email ${CONTACT_EMAIL} directly.`
        );
      } else if (err instanceof Error && err.message) {
        setFeedbackMessage(
          `${err.message} You can also reach out directly at ${CONTACT_EMAIL}.`
        );
      } else {
        setFeedbackMessage(
          `Unable to send message right now. Please email ${CONTACT_EMAIL} directly.`
        );
      }
    } finally {
      isSubmittingRef.current = false;
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-line-subtle text-left print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-lg font-bold text-ink-primary">
            Send a Direct Message
          </h3>
          <p className="text-xs font-mono text-ink-muted mt-0.5">
            Powered by FormSubmit HTTPS relay — delivered straight to{" "}
            <span className="text-accent-cyan-ink">{CONTACT_EMAIL}</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-status-emerald-ink bg-status-emerald/10 border border-status-emerald/30 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          TLS &amp; Honeypot Protected
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Honeypot anti-spam trap (strictly hidden & non-focusable) */}
        <input
          type="text"
          name="_honey"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          className="hidden"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label
              htmlFor="contact-name"
              className="block text-xs font-mono font-semibold text-ink-primary mb-1.5"
            >
              Your Name <span className="text-status-rose" aria-hidden="true">*</span>
            </label>
            <input
              ref={nameInputRef}
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={MAX_NAME_LENGTH}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              placeholder="e.g. Andrei Popescu / Hiring Team"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface-recessed border border-slate-500/80 dark:border-slate-400/50 focus:border-line-strong text-sm text-ink-primary placeholder:text-ink-muted transition-colors"
            />
            {errors.name && (
              <p
                id="contact-name-error"
                className="text-xs font-mono text-status-rose mt-1.5"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="contact-email"
              className="block text-xs font-mono font-semibold text-ink-primary mb-1.5"
            >
              Email Address <span className="text-status-rose" aria-hidden="true">*</span>
            </label>
            <input
              ref={emailInputRef}
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={MAX_EMAIL_LENGTH}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              placeholder="you@company.com"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface-recessed border border-slate-500/80 dark:border-slate-400/50 focus:border-line-strong text-sm text-ink-primary placeholder:text-ink-muted transition-colors"
            />
            {errors.email && (
              <p
                id="contact-email-error"
                className="text-xs font-mono text-status-rose mt-1.5"
              >
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Topic */}
        <div>
          <label
            htmlFor="contact-subject"
            className="block text-xs font-mono font-semibold text-ink-primary mb-1.5"
          >
            Inquiry Topic
          </label>
          <select
            id="contact-subject"
            name="subject"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface-recessed border border-slate-500/80 dark:border-slate-400/50 focus:border-line-strong text-sm text-ink-primary transition-colors cursor-pointer"
          >
            {INQUIRY_TOPICS.map((item) => (
              <option key={item} value={item} className="bg-surface text-ink-primary">
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="contact-message"
              className="block text-xs font-mono font-semibold text-ink-primary"
            >
              Message <span className="text-status-rose" aria-hidden="true">*</span>
            </label>
            <span
              id="contact-message-count"
              className="text-[11px] font-mono text-ink-muted tabular-nums"
            >
              {message.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
          <textarea
            ref={messageInputRef}
            id="contact-message"
            name="message"
            rows={4}
            required
            maxLength={MAX_MESSAGE_LENGTH}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.message) {
                setErrors((prev) => ({ ...prev, message: undefined }));
              }
            }}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message
                ? "contact-message-error contact-message-count"
                : "contact-message-count"
            }
            placeholder="Share role details, project scope, or technical questions..."
            className="w-full min-h-[112px] px-3.5 py-2.5 rounded-xl bg-surface-recessed border border-slate-500/80 dark:border-slate-400/50 focus:border-line-strong text-sm text-ink-primary placeholder:text-ink-muted transition-colors resize-y"
          />
          {errors.message && (
            <p
              id="contact-message-error"
              className="text-xs font-mono text-status-rose mt-1.5"
            >
              {errors.message}
            </p>
          )}
        </div>

        {/* Persistent Live Regions for Validation & Delivery Status */}
        <div role="status" aria-live="polite" className={status === "success" ? "" : "sr-only"}>
          {status === "success" ? (
            <div className="p-3.5 rounded-xl bg-status-emerald/10 border border-status-emerald/35 text-xs font-mono text-status-emerald-ink flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{feedbackMessage}</span>
            </div>
          ) : (
            validationNotice
          )}
        </div>

        <div
          role="alert"
          aria-live="assertive"
          className={status === "error" ? "" : "sr-only"}
        >
          {status === "error" ? (
            <div className="p-3.5 rounded-xl bg-accent-crimson/15 border border-accent-crimson/35 text-xs font-mono text-status-rose flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{feedbackMessage}</span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-[11px] font-mono text-ink-muted">
            First submission on a new domain activates FormSubmit via email confirmation.
          </span>

          <button
            type="submit"
            disabled={status === "submitting"}
            aria-busy={status === "submitting"}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-accent-cobalt hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-mono font-semibold shadow-card transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
