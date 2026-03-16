"use client";

import { FormEvent, KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from "react";

import { siteContent } from "@/config/world";

import { SectionHeading } from "./section-heading";
import { SectionReveal } from "./section-reveal";
import { TurnstileWidget } from "./turnstile-widget";

type FormState = {
  email: string;
  playerName: string;
  favoriteMmorpg: string;
  playstyle: string;
  alphaTesting: string;
};

const initialState: FormState = {
  email: "",
  playerName: "",
  favoriteMmorpg: "",
  playstyle: "Exploration",
  alphaTesting: "Yes"
};

const playstyles = ["PvP", "PvE", "Exploration", "Crafting", "Raids"];

export function WaitlistForm() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const captchaEnabled = turnstileSiteKey !== "";
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "exists">(
    "idle"
  );
  const [serverMessage, setServerMessage] = useState<string>("");
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetNonce, setTurnstileResetNonce] = useState(0);

  const isValid = useMemo(() => {
    return (
      form.email.trim() !== "" &&
      /\S+@\S+\.\S+/.test(form.email) &&
      form.favoriteMmorpg.trim() !== ""
    );
  }, [form.email, form.favoriteMmorpg]);

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.favoriteMmorpg.trim()) {
      nextErrors.favoriteMmorpg = "Tell us your favorite MMORPG.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      setServerMessage("");
      setStatus("error");
      return;
    }

    if (captchaEnabled && !turnstileToken) {
      setServerMessage("Please complete the CAPTCHA challenge.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    const payload = {
      ...form,
      website: honeypot,
      turnstileToken
    };

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as { ok?: boolean; error?: string; code?: string };

      if (!response.ok) {
        if (response.status === 409 || data.code === "already_exists") {
          setStatus("exists");
          setServerMessage(data.error ?? "This email is already on the waitlist.");
          return;
        }

        setStatus("error");
        setServerMessage(data.error ?? "We could not save your signup just now.");
        return;
      }

      setForm(initialState);
      setHoneypot("");
      setStatus("success");
      setServerMessage("");
    } catch {
      setStatus("error");
      setServerMessage("Network trouble kept us from recording your name. Please try again.");
    } finally {
      if (captchaEnabled) {
        setTurnstileToken("");
        setTurnstileResetNonce((current) => current + 1);
      }
    }
  };

  return (
    <section id="waitlist" className="relative py-24 sm:py-28">
      <div className="container-shell">
        <SectionReveal>
          <SectionHeading
            eyebrow="First Call"
            title={siteContent.waitlist.title}
            description={siteContent.waitlist.description}
          />
        </SectionReveal>

        <SectionReveal delay={0.1} className="mt-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
            <div className="panel gold-frame p-8 sm:p-10">
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div
                  aria-hidden="true"
                  className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
                >
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Email"
                    required
                    value={form.email}
                    onChange={(value) => updateField("email", value)}
                    error={errors.email}
                    type="email"
                    placeholder="you@domain.com"
                  />
                  <Field
                    label="Player Name"
                    value={form.playerName}
                    onChange={(value) => updateField("playerName", value)}
                    placeholder="Optional"
                  />
                </div>

                <Field
                  label="Favorite MMORPG"
                  required
                  value={form.favoriteMmorpg}
                  onChange={(value) => updateField("favoriteMmorpg", value)}
                  error={errors.favoriteMmorpg}
                  placeholder="World of Warcraft, FFXIV, ESO..."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField
                    label="Preferred Playstyle"
                    value={form.playstyle}
                    onChange={(value) => updateField("playstyle", value)}
                    options={playstyles}
                  />
                  <SelectField
                    label="Alpha Testing Interest"
                    value={form.alphaTesting}
                    onChange={(value) => updateField("alphaTesting", value)}
                    options={["Yes", "No"]}
                  />
                </div>

                {captchaEnabled ? (
                  <TurnstileWidget
                    siteKey={turnstileSiteKey}
                    resetNonce={turnstileResetNonce}
                    onChange={(token) => {
                      setTurnstileToken(token);
                      if (token) {
                        setServerMessage("");
                      }
                    }}
                    onError={(message) => {
                      setServerMessage(message);
                    }}
                  />
                ) : null}

                <button
                  type="submit"
                  disabled={!isValid || status === "submitting"}
                  className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "submitting" ? "Calling the banners..." : "Join the Waitlist"}
                </button>

                <p className="text-sm text-stone-400">
                  Signups are screened for spam, rate limited, and stored securely for future
                  communications and early access.
                </p>

                {status === "success" ? (
                  <p className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                    Your name has been recorded. We will call when the gates of Mittlemarch open.
                  </p>
                ) : null}

                {status === "error" ? (
                  <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                    {serverMessage ||
                      "A few details still need attention before we can add you to the waitlist."}
                  </p>
                ) : null}

                {status === "exists" ? (
                  <p className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                    {serverMessage || "This email is already on the waitlist."}
                  </p>
                ) : null}
              </form>
            </div>

            <aside className="panel gold-frame p-8 sm:p-10">
              <p className="section-kicker">Why Join Early</p>
              <ul className="mt-6 space-y-5 font-[family-name:var(--font-serif)] text-2xl leading-relaxed text-stone-200/82">
                <li>Be first to hear about alpha testing, reveals, and faction announcements.</li>
                <li>
                  Help shape the future of Mittlemarch by telling us what kind of world you want to
                  inhabit.
                </li>
                <li>Give your community a rally point before the first campaign begins.</li>
              </ul>
            </aside>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

type SharedFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
};

function Field({
  label,
  value,
  onChange,
  required,
  error,
  type = "text",
  placeholder
}: SharedFieldProps & { type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm uppercase tracking-[0.24em] text-stone-300">
        {label} {required ? <span className="text-amber-200">*</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-300/40 focus:bg-black/30"
      />
      {error ? <span className="mt-2 block text-sm text-rose-300">{error}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: SharedFieldProps & { options: string[] }) {
  const [open, setOpen] = useState(false);
  const fieldId = useId();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);

    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option === value)
  );

  const moveSelection = (direction: 1 | -1) => {
    const nextIndex = (selectedIndex + direction + options.length) % options.length;
    onChange(options[nextIndex]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }

      moveSelection(1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }

      moveSelection(-1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((current) => !current);
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <label className="block">
      <span className="mb-2 block text-sm uppercase tracking-[0.24em] text-stone-300">{label}</span>
      <div ref={wrapperRef} className="relative">
        <button
          id={fieldId}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${fieldId}-label ${fieldId}`}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-[22px] border px-4 py-3 text-left transition outline-none ${
            open
              ? "border-amber-300/45 bg-[linear-gradient(180deg,rgba(42,28,13,0.55),rgba(12,16,24,0.94))] shadow-[0_0_0_1px_rgba(242,204,143,0.16),0_0_32px_rgba(213,154,67,0.14)]"
              : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(8,12,18,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-amber-200/20 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(10,14,22,0.94))]"
          }`}
        >
          <span className="block text-[11px] uppercase tracking-[0.34em] text-amber-200/60">
            Choose a path
          </span>
          <span className="mt-1 block font-[family-name:var(--font-serif)] text-xl leading-none text-stone-100">
            {value}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-amber-100/85">
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className={`h-4 w-4 fill-current transition ${open ? "rotate-180" : ""}`}
            >
              <path d="M5.2 7.4a1 1 0 0 1 1.4 0L10 10.8l3.4-3.4a1 1 0 1 1 1.4 1.4l-4.1 4.1a1 1 0 0 1-1.4 0L5.2 8.8a1 1 0 0 1 0-1.4Z" />
            </svg>
          </span>
        </button>

        {open ? (
          <div className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-20 overflow-hidden rounded-[24px] border border-amber-200/18 bg-[linear-gradient(180deg,rgba(14,19,28,0.98),rgba(8,11,18,0.98))] p-2 shadow-[0_30px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
            <ul role="listbox" aria-labelledby={fieldId} className="space-y-1">
              {options.map((option) => {
                const isSelected = option === value;

                return (
                  <li key={option}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(option);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left transition ${
                        isSelected
                          ? "bg-amber-300/12 text-amber-50 shadow-[inset_0_0_0_1px_rgba(242,204,143,0.18)]"
                          : "text-stone-300 hover:bg-white/5 hover:text-stone-100"
                      }`}
                    >
                      <span className="font-[family-name:var(--font-serif)] text-lg">{option}</span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full transition ${
                          isSelected
                            ? "bg-amber-200 shadow-[0_0_14px_rgba(242,204,143,0.55)]"
                            : "bg-white/10"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </label>
  );
}
