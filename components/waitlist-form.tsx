"use client";

import { FormEvent, useMemo, useState } from "react";

import { siteContent } from "@/config/world";

import { SectionHeading } from "./section-heading";
import { SectionReveal } from "./section-reveal";

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
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "exists">(
    "idle"
  );
  const [serverMessage, setServerMessage] = useState<string>("");

  const isValid = useMemo(() => {
    return form.email.trim() !== "" && /\S+@\S+\.\S+/.test(form.email) && form.favoriteMmorpg.trim() !== "";
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

    setStatus("submitting");
    setServerMessage("");

    const payload = {
      ...form
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
      setStatus("success");
      setServerMessage("");
    } catch {
      setStatus("error");
      setServerMessage("Network trouble kept us from recording your name. Please try again.");
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
                    label="Interested in Alpha Testing"
                    value={form.alphaTesting}
                    onChange={(value) => updateField("alphaTesting", value)}
                    options={["Yes", "No"]}
                  />
                </div>

                <button type="submit" disabled={!isValid || status === "submitting"} className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
                  {status === "submitting" ? "Calling the banners..." : "Join the Waitlist"}
                </button>

                <p className="text-sm text-stone-400">
                  Signups are sent to a secure Next.js endpoint and stored in Supabase.
                </p>

                {status === "success" ? (
                  <p className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                    Your name has been recorded. We will call when the gates of Mittlemarch open.
                  </p>
                ) : null}

                {status === "error" ? (
                  <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                    {serverMessage || "A few details still need attention before we can add you to the waitlist."}
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
                <li>Help shape the future of Mittlemarch by telling us what kind of MMORPG world you want to inhabit.</li>
                <li>Give your community a rally point before the first campaign begins.</li>
              </ul>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200/75">Backend Ready</p>
                <p className="mt-3 text-base leading-relaxed text-stone-300">
                  The submit flow is now wired for Supabase through the server route, so you can keep the frontend stable as the backend grows.
                </p>
              </div>
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
  return (
    <label className="block">
      <span className="mb-2 block text-sm uppercase tracking-[0.24em] text-stone-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none transition focus:border-amber-300/40 focus:bg-black/30"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
