"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import { loginUser } from "@/lib/authStore";
import styles from "./LoginModal.module.css";

const DEMO_CODE = "1234"; // TODO: remove when real SMS is connected

// open    = true shows the pop-up, false hides it
// onClose = function that closes the pop-up
export default function LoginModal({ open, onClose }) {
  const [step, setStep] = useState("phone"); // "phone" = step 1, "code" = step 2
  const [mobile, setMobile] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // pop-up is closed, so show nothing
  if (!open) return null;

  // close the pop-up and start again from step 1 next time
  function close() {
    setStep("phone");
    setCode("");
    setError("");
    onClose();
  }

  // STEP 1: user clicks "Send OTP"
  function sendOtp(event) {
    event.preventDefault();
    if (mobile.replace(/\D/g, "").length < 9) {
      return setError("Please enter a valid mobile number.");
    }
    setError("");
    setStep("code");
  }

  // STEP 2: user clicks "Verify"
  async function verify(event) {
    event.preventDefault();
    if (code.length < 4) return setError("Please enter the 4-digit code.");
    if (code !== DEMO_CODE) return setError("That code is not correct. Please try again.");

    const result = await loginUser({ phone: mobile, remember: keepLoggedIn });
    if (!result.ok) return setError(result.error);

    close(); // logged in, so the header now shows the user's name
  }

  return createPortal(
    // clicking the dark area closes the pop-up
    <div className={styles.overlay} onClick={close}>

      {/* the box (clicks inside it must NOT close the pop-up) */}
      <div className={styles.box} onClick={(event) => event.stopPropagation()}>
        <button type="button" className={styles.close} onClick={close} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </svg>
        </button>

        {/* ---------- STEP 1: mobile number ---------- */}
        {step === "phone" && (
          <>
            <h2>Welcome back</h2>
            <p className={styles.sub}>Log in to manage your vehicles, quotes and bookings.</p>

            <form onSubmit={sendOtp}>
              {error && <p className={styles.alert} role="alert">{error}</p>}

              <label>Mobile number</label>
              <input
                type="tel"
                placeholder="05X XXX XXXX"
                value={mobile}
                onChange={(event) => { setMobile(event.target.value); setError(""); }}
                required
              />

              <div className={styles.row}>
                <label className={styles.check}>
                  <input
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={(event) => setKeepLoggedIn(event.target.checked)}
                  />
                  Keep me logged in
                </label>

                <a href="#" className={styles.link}>Forgot password?</a>
              </div>

              <button type="submit" className={styles.button}>Send OTP</button>
            </form>

            <p className={styles.footer}>
              New to Karevo? <a href="/register">Create an account</a>
            </p>
          </>
        )}

        {/* ---------- STEP 2: enter the 4-digit code ---------- */}
        {step === "code" && (
          <>
            <h2>Enter your code</h2>
            <p className={styles.sub}>
              If {mobile} has a Karevo account, we have texted it a one-time code.
            </p>

            <form onSubmit={verify}>
              {error && <p className={styles.alert} role="alert">{error}</p>}

              <label>Enter the 4-digit code</label>
              <input
                className={styles.codeInput}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={4}
                placeholder="••••"
                autoFocus
                value={code}
                onChange={(event) => {
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 4));
                  setError("");
                }}
              />

              <div className={styles.row}>
                <button type="button" className={styles.linkButton} onClick={() => { setStep("phone"); setCode(""); setError(""); }}>
                  Change number
                </button>
                <button type="button" className={styles.linkButton} onClick={() => setCode("")}>
                  Resend code
                </button>
              </div>

              <button type="submit" className={styles.button}>Verify</button>
            </form>
          </>
        )}
      </div>

    </div>,
    document.body
  );
}