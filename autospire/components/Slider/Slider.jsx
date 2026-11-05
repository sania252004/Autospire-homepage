"use client";
import { useRef } from "react";
import Icon from "@/components/Icon/Icon";
import { makeCx } from "@/lib/cx";
import styles from "./Slider.module.css";
const cx = makeCx(styles);

// variant: "services" | "garages" | "reviews" (see Slider.module.css)
export default function Slider({ children, variant = "services", label }) {
  const ref = useRef(null);
  const go = (dir) => {
    const el = ref.current; if (!el || !el.firstChild) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 0;
    el.scrollBy({ left: dir * (el.firstChild.offsetWidth + gap), behavior: "smooth" });
  };
  return (
    <div className={cx("slider", variant)}>
      <button className={cx("arr", "prev")} onClick={() => go(-1)} aria-label={`Previous ${label || ""}`}><Icon name="left" size={20} sw={2.2} /></button>
      <div className={cx("track")} ref={ref} data-track>{children}</div>
      <button className={cx("arr", "next")} onClick={() => go(1)} aria-label={`Next ${label || ""}`}><Icon name="right" size={20} sw={2.2} /></button>
    </div>
  );
}