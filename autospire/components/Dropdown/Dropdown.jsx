"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon/Icon";
import { makeCx } from "@/lib/cx";
import styles from "./Dropdown.module.css";
const cx = makeCx(styles);

export default function Dropdown({ value, onChange, options, placeholder, icon, variant = "field", format = (v) => v, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const out = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", out);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", out); document.removeEventListener("keydown", esc); };
  }, []);
  return (
    <div className={cx("dropd", variant, open && "open")} ref={ref}>
      <button type="button" className={cx("dbtn")} aria-haspopup="listbox" aria-expanded={open} aria-label={label || placeholder} onClick={() => setOpen(!open)}>
        {icon && <Icon name={icon} size={variant === "mini" ? 16 : 20} fill={variant === "mini" ? "currentColor" : "none"} sw={variant === "mini" ? 0 : 1.6} />}
        <span className={cx(!value && "ph")}>{value ? format(value) : placeholder}</span>
        <Icon name="down" size={variant === "mini" ? 13 : 16} sw={2.6} />
      </button>
      {open && (
        <ul className={cx("dlist")} role="listbox">
          {options.map((o) => (
            <li key={o}><button type="button" role="option" aria-selected={o === value} onClick={() => { onChange(o); setOpen(false); }}>{format(o)}</button></li>
          ))}
        </ul>
      )}
    </div>
  );
}
