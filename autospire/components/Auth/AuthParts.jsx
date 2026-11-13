"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/Icon/Icon";
import { useAuth, logout, firstName, safeNext } from "@/lib/authStore";
import styles from "./Auth.module.css";

/* little icons that are not in your Icon set */
export function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ off }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

/* label + input box + error message */
export function Field({ id, label, error, lead, trail, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <div className={`${styles.control} ${error ? styles.hasError : ""} ${trail ? styles.hasTrail : ""}`}>
        {lead && <span className={styles.lead}>{lead}</span>}
        {children}
        {trail}
      </div>
      {error && <p id={`${id}-error`} className={styles.fieldError} role="alert">{error}</p>}
    </div>
  );
}

/* password box with a show / hide eye */
export function PasswordField({ id, label, value, onChange, error, autoComplete, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <Field
      id={id} label={label} error={error} lead={<LockIcon />}
      trail={
        <button type="button" className={styles.eye} onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>
          <EyeIcon off={show} />
        </button>
      }
    >
      <input
        id={id} className={styles.input} type={show ? "text" : "password"}
        value={value} onChange={onChange} autoComplete={autoComplete} placeholder={placeholder}
        aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
      />
    </Field>
  );
}

/* glass dropdown (replaces the browser's own select list).
   options = ["Dubai", "Sharjah", ...]  or  [{ value, label }, ...]
   Keyboard: arrows to move, Enter to choose, Esc to close. */
export function GlassSelect({ id, label, value, onChange, options, lead }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);        // the row the mouse or keyboard is on
  const wrap = useRef(null);

  const list = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const selected = list.find((o) => o.value === value);

  // close when the visitor clicks anywhere else
  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  function openMenu() {
    setActive(Math.max(0, list.findIndex((o) => o.value === value)));
    setOpen(true);
  }
  function choose(i) {
    onChange(list[i].value);
    setOpen(false);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      if (open) { e.preventDefault(); setOpen(false); }
    } else if (e.key === "Tab") {
      setOpen(false);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return openMenu();
      setActive((a) => (e.key === "ArrowDown" ? Math.min(list.length - 1, a + 1) : Math.max(0, a - 1)));
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      setActive(list.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) choose(active); else openMenu();
    }
  }

  return (
    <div className={styles.field} ref={wrap}>
      <span id={`${id}-label`} className={styles.label}>{label}</span>
      <div className={styles.control}>
        {lead && <span className={styles.lead}>{lead}</span>}

        <button
          type="button" id={id} role="combobox"
          className={`${styles.input} ${styles.selectBtn}`}
          aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`}
          aria-labelledby={`${id}-label ${id}`}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onKeyDown}
        >
          {selected ? selected.label : "Select"}
        </button>

        <span className={`${styles.chev} ${open ? styles.chevUp : ""}`}><Icon name="down" size={14} sw={2.6} /></span>

        {open && (
          <ul id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className={styles.menu}>
            {list.map((o, i) => (
              <li
                key={o.value} role="option" aria-selected={o.value === value}
                className={`${styles.option} ${i === active ? styles.optionActive : ""} ${o.value === value ? styles.optionOn : ""}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
              >
                <span>{o.label}</span>
                {o.value === value && <Icon name="check" size={16} sw={3} />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* shown instead of the form when the visitor is already logged in */
export function AlreadyIn() {
  const { user, ready } = useAuth();
  const next = safeNext(useSearchParams().get("next"));
  if (!ready || !user) return null;
  return (
    <div className={styles.already}>
      <span className={styles.avatar}>{user.initials}</span>
      <div>
        <b>You&apos;re logged in, {firstName(user.name)}</b>
        <small>{user.email}</small>
      </div>
      <a href={next} className={`btn ${styles.submit}`}>Continue <Icon name="arrow" size={18} sw={2.2} /></a>
      <button type="button" className={styles.link} onClick={logout}>Log out</button>
    </div>
  );
}