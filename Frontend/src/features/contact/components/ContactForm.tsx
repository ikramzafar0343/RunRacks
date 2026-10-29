"use client";

/**
 * Contact message form — posts to /api/v1/contact.
 * Never claims success until real mail transport exists.
 */
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  CONTACT_FORM,
  CONTACT_TOPICS,
  type ContactTopic,
} from "@/features/contact/model/contactContent";
import type { ApiErrorBody, ContactRequest } from "@/shared/lib/apiContracts";

type FieldErrors = Partial<Record<keyof ContactRequest, string>>;

type FormStatus =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "not_configured"; message: string }
  | { kind: "error"; message: string };

const TOPIC_VALUES = new Set<string>(CONTACT_TOPICS.map((t) => t.value));

function validateClient(values: ContactRequest): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (name.length < 2 || name.length > 80) {
    errors.name = "Name must be 2–80 characters.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!TOPIC_VALUES.has(values.topic)) {
    errors.topic = "Choose a topic.";
  }
  if (message.length < 20 || message.length > 4000) {
    errors.message = "Message must be 20–4000 characters.";
  }
  return errors;
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<ContactTopic>("engineers");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: ContactRequest = { name, email, topic, message };
    const clientErrors = validateClient(payload);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setStatus({ kind: "idle" });
      return;
    }

    setFieldErrors({});
    setStatus({ kind: "pending" });

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as ApiErrorBody | { ok: true };

      if (!res.ok || !("ok" in body) || body.ok !== true) {
        const err = body as ApiErrorBody;
        const code = err.error?.code;
        const details = err.error?.details as
          | { fields?: FieldErrors }
          | undefined;

        if (code === "VALIDATION_ERROR" && details?.fields) {
          setFieldErrors(details.fields);
          setStatus({ kind: "idle" });
          return;
        }

        if (code === "NOT_CONFIGURED") {
          setStatus({
            kind: "not_configured",
            message: err.error?.message || CONTACT_FORM.notConfigured,
          });
          return;
        }

        setStatus({
          kind: "error",
          message:
            err.error?.message ||
            "Something went wrong. Try again or use Pricing.",
        });
        return;
      }

      setStatus({
        kind: "error",
        message:
          "Unexpected success response without mail transport. Please try Pricing.",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Network error. Check your connection and try again.",
      });
    }
  }

  const pending = status.kind === "pending";

  return (
    <div className="contactFormPanel">
      <h2 id="contact-form-heading" className="contactFormHeading">
        {CONTACT_FORM.heading}
      </h2>
      <p className="contactFormLead">{CONTACT_FORM.lead}</p>

      {status.kind === "not_configured" ? (
        <p className="contactFormBanner" role="status">
          {status.message}{" "}
          <Link href="/pricing">View plans</Link>
          {" · "}
          <Link href="/ai">RunRacks AI</Link>
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p className="contactFormBanner" role="alert">
          {status.message}
        </p>
      ) : null}

      <form className="contactForm" onSubmit={onSubmit} noValidate>
        <div className="contactField">
          <label className="contactFieldLabel" htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            className="contactFieldControl"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={pending}
            required
            minLength={2}
            maxLength={80}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={
              fieldErrors.name ? "contact-name-error" : undefined
            }
          />
          {fieldErrors.name ? (
            <p id="contact-name-error" className="contactFieldError">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className="contactField">
          <label className="contactFieldLabel" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            className="contactFieldControl"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            required
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={
              fieldErrors.email ? "contact-email-error" : undefined
            }
          />
          {fieldErrors.email ? (
            <p id="contact-email-error" className="contactFieldError">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className="contactField">
          <label className="contactFieldLabel" htmlFor="contact-topic">
            Topic
          </label>
          <select
            id="contact-topic"
            className="contactFieldControl"
            name="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value as ContactTopic)}
            disabled={pending}
            required
            aria-invalid={Boolean(fieldErrors.topic)}
            aria-describedby={
              fieldErrors.topic ? "contact-topic-error" : undefined
            }
          >
            {CONTACT_TOPICS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors.topic ? (
            <p id="contact-topic-error" className="contactFieldError">
              {fieldErrors.topic}
            </p>
          ) : null}
        </div>

        <div className="contactField">
          <label className="contactFieldLabel" htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            className="contactFieldControl contactFieldControl--area"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={pending}
            required
            minLength={20}
            maxLength={4000}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={
              fieldErrors.message ? "contact-message-error" : undefined
            }
          />
          {fieldErrors.message ? (
            <p id="contact-message-error" className="contactFieldError">
              {fieldErrors.message}
            </p>
          ) : null}
        </div>

        <div className="contactFormActions">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? CONTACT_FORM.pendingLabel : CONTACT_FORM.submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
