"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon/Icon";
import AuthShell from "./AuthShell";
import { Field, PasswordField, GlassSelect, AlreadyIn } from "./AuthParts";
import { registerUser, safeNext } from "@/lib/authStore";
import { addNotification } from "@/lib/notificationStore";
import { emirates } from "@/lib/data";
import styles from "./Auth.module.css";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UAE_MOBILE = /^(?:\+?971|0)?5\d{8}$/;      // 05X XXX XXXX, 5X XXX XXXX or +971 5X XXX XXXX
const INTL_MOBILE = /^\+\d{8,15}$/;              // any international number, e.g. +91 74393 99960
const LABELS = ["", "Weak", "Fair", "Good", "Strong"];

/* 0 = empty, 1 = weak ... 4 = strong */
function strengthOf(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++;
  return Math.max(1, s);
}

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const query = params.get("next") ? `?next=${encodeURIComponent(params.get("next"))}` : "";

  const [f, setF] = useState({ name: "", email: "", phone: "", emirate: "Dubai", password: "", confirm: "", terms: false });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (key, value) => setF((old) => ({ ...old, [key]: value }));

  const strength = strengthOf(f.password);

  function validate() {
    const e = {};
    if (f.name.trim().length < 2) e.name = "Please enter your full name.";

    if (!f.email.trim()) e.email = "Please enter your email.";
    else if (!EMAIL_OK.test(f.email.trim())) e.email = "That doesn't look like a valid email.";

    const phone = f.phone.replace(/[\s\-()]/g, "");
    if (!phone) e.phone = "Please enter your mobile number.";
    else if (!UAE_MOBILE.test(phone) && !INTL_MOBILE.test(phone)) e.phone = "Enter a valid number, e.g. 050 123 4567 or +91 74393 99960.";

    if (f.password.length < 8) e.password = "Use at least 8 characters.";
    else if (!/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)) e.password = "Include at least one letter and one number.";

    if (!f.confirm) e.confirm = "Please repeat your password.";
    else if (f.confirm !== f.password) e.confirm = "The passwords don't match.";

    if (!f.terms) e.terms = "Please accept the terms to continue.";
    return e;
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    const res = await registerUser({ name: f.name, email: f.email, phone: f.phone, emirate: f.emirate, password: f.password });
    if (!res.ok) {
      setErrors({ [res.field || "form"]: res.error });
      setBusy(false);
      return;
    }
    addNotification({ title: "Welcome to Autospire", text: "Add your vehicle to get service reminders and quick booking.", href: "/my-vehicles" });
    router.push(next);
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free for customers. Compare quotes, book and track every service."
      footer={<>Already have an account? <a href={`/login${query}`} className={styles.link}>Log in</a></>}
    >
      <AlreadyIn />

      <form className={styles.form} onSubmit={submit} noValidate>
        {errors.form && <p className={styles.alert} role="alert">{errors.form}</p>}

        <Field id="name" label="Full name" error={errors.name} lead={<Icon name="user" size={20} sw={1.8} />}>
          <input id="name" className={styles.input} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" autoComplete="name"
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        </Field>

        <Field id="email" label="Email" error={errors.email} lead={<Icon name="mail" size={20} sw={1.8} />}>
          <input id="email" className={styles.input} type="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" autoComplete="email"
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
        </Field>

        <Field id="phone" label="Mobile" error={errors.phone} lead={<Icon name="phone" size={20} sw={1.8} />}>
          <input id="phone" className={styles.input} type="tel" inputMode="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="05X XXX XXXX" autoComplete="tel"
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
        </Field>

        <GlassSelect
          id="emirate" label="Emirate" value={f.emirate} onChange={(v) => set("emirate", v)}
          options={emirates} lead={<Icon name="pin" size={20} sw={1.8} />}
        />

        <PasswordField id="password" label="Password" value={f.password} onChange={(e) => set("password", e.target.value)} error={errors.password} autoComplete="new-password" placeholder="At least 8 characters" />

        {f.password && (
          <div className={styles.strength} aria-live="polite">
            <div className={styles.meter} data-level={strength}><i /><i /><i /><i /></div>
            <small>Password strength: <b>{LABELS[strength]}</b></small>
          </div>
        )}

        <PasswordField id="confirm" label="Confirm password" value={f.confirm} onChange={(e) => set("confirm", e.target.value)} error={errors.confirm} autoComplete="new-password" placeholder="Repeat your password" />

        <div>
          <label className={styles.check}>
            <input type="checkbox" checked={f.terms} onChange={(e) => set("terms", e.target.checked)} aria-invalid={!!errors.terms} />
            <span>I agree to the <a href="#" className={styles.link}>Terms of Service</a> and <a href="#" className={styles.link}>Privacy Policy</a>.</span>
          </label>
          {errors.terms && <p className={styles.fieldError} role="alert">{errors.terms}</p>}
        </div>

        <button className={`btn ${styles.submit}`} type="submit" disabled={busy}>
          {busy ? "Creating account…" : <>Create account <Icon name="arrow" size={18} sw={2.2} /></>}
        </button>
      </form>
    </AuthShell>
  );
}