"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon/Icon";
import AuthShell from "./AuthShell";
import { Field } from "./AuthParts";
import { cleanPhone } from "@/lib/authStore";
import styles from "./Auth.module.css";

export default function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (cleanPhone(phone).length < 9) return setError("Please enter a valid mobile number.");

    // save the number for the next page, then go to the code page
    sessionStorage.setItem("pendingPhone", phone);
    sessionStorage.setItem("pendingRemember", remember ? "1" : "0");
    router.push("/verify");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your vehicles, quotes and bookings."
      footer={<>New to Autospire? <a href="/register" className={styles.link}>Create an account</a></>}
    >
      <form className={styles.form} onSubmit={submit}>
        {error && <p className={styles.alert}>{error}</p>}

        <Field id="phone" label="Mobile number" lead={<Icon name="phone" size={20} sw={1.8} />}>
          <input
            id="phone" className={styles.input} type="tel"
            value={phone} onChange={(e) => { setPhone(e.target.value); setError(""); }}
            placeholder="05X XXX XXXX"
          />
        </Field>

        <div className={styles.checks}>
          <label className={styles.check}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Keep me logged in
          </label>
          <a href="/forgot-password" className={styles.link}>Forgot password?</a>
        </div>

        <button className={`btn ${styles.submit}`} type="submit">
          Send OTP 
        </button>
      </form>
    </AuthShell>
  );
}