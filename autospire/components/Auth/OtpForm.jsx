"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon/Icon";
import AuthShell from "./AuthShell";
import { loginUser } from "@/lib/authStore";
import styles from "./Auth.module.css";

const DEMO_CODE = "1234"; // TODO: remove when real SMS is connected

export default function OtpForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // get the number saved by the login page (no number = back to login)
  useEffect(() => {
    const saved = sessionStorage.getItem("pendingPhone");
    if (!saved) router.replace("/login");
    else setPhone(saved);
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    if (code.length < 4) return setError("Please enter the 4-digit code.");
    if (code !== DEMO_CODE) return setError("That code is not correct. Please try again.");

    const remember = sessionStorage.getItem("pendingRemember") !== "0";
    const res = await loginUser({ phone, remember });
    if (!res.ok) return setError(res.error);

    sessionStorage.removeItem("pendingPhone");
    sessionStorage.removeItem("pendingRemember");
    router.push("/");
  }

  return (
    <AuthShell
      title="Enter your code"
      subtitle={`If ${phone} has an Autospire account, we have texted it a one-time code.`}
    >
      <form className={styles.form} onSubmit={submit}>
        {error && <p className={styles.alert} role="alert">{error}</p>}

        <label className={styles.otpLabel} htmlFor="code">Enter the 4-digit code</label>
        <input
          id="code"
          className={styles.otpInput}
          value={code}
          onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={4}
          placeholder="••••"
          autoFocus
        />

        <div className={styles.checks}>
          <a href="/login" className={styles.link}>Change number</a>
          <button type="button" className={styles.link} onClick={() => setCode("")}>Resend code</button>
        </div>

        <button className={`btn ${styles.submit}`} type="submit">
          Verify <Icon name="arrow" size={18} sw={2.2} />
        </button>
      </form>
    </AuthShell>
  );
}