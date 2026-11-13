"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon/Icon";
import AuthShell from "./AuthShell";
import { Field, PasswordField, AlreadyIn } from "./AuthParts";
import { loginUser, safeNext } from "@/lib/authStore";
import styles from "./Auth.module.css";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const query = params.get("next") ? `?next=${encodeURIComponent(params.get("next"))}` : "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function submit(e) {
    e.preventDefault();
    setNotice("");
    const errs = {};
    if (!email.trim()) errs.email = "Please enter your email.";
    else if (!EMAIL_OK.test(email.trim())) errs.email = "That doesn't look like a valid email.";
    if (!password) errs.password = "Please enter your password.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    const res = await loginUser({ email, password, remember });
    if (!res.ok) {
      setErrors({ form: res.error });
      setBusy(false);
      return;
    }
    router.push(next);
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your vehicles, quotes and bookings."
      footer={<>New to Autospire? <a href={`/register${query}`} className={styles.link}>Create an account</a></>}
    >
      <AlreadyIn />

      <form className={styles.form} onSubmit={submit} noValidate>
        {errors.form && <p className={styles.alert} role="alert">{errors.form}</p>}
        {notice && <p className={styles.info} role="status">{notice}</p>}

        <Field id="email" label="Email" error={errors.email} lead={<Icon name="mail" size={20} sw={1.8} />}>
          <input
            id="email" className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com" autoComplete="email"
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>

        <PasswordField id="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} autoComplete="current-password" placeholder="Your password" />

        <div className={styles.checks}>
          <label className={styles.check}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Keep me logged in
          </label>
          <button type="button" className={styles.link} onClick={() => setNotice("Password reset will be available once the backend is connected.")}>
            Forgot password?
          </button>
        </div>

        <button className={`btn ${styles.submit}`} type="submit" disabled={busy}>
          {busy ? "Logging in…" : <>Log in <Icon name="arrow" size={18} sw={2.2} /></>}
        </button>
      </form>
    </AuthShell>
  );
}