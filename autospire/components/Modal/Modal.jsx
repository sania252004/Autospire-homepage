"use client";
import { useEffect } from "react";
import Icon from "@/components/Icon/Icon";
import { makeCx } from "@/lib/cx";
import styles from "./Modal.module.css";
const cx = makeCx(styles);
export default function Modal({ onClose, children, wide }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className={cx("ovl")} onClick={onClose} role="dialog" aria-modal="true">
      <div className={cx("modal", wide && "wide")} onClick={(e) => e.stopPropagation()}>
        <button className={cx("mclose")} onClick={onClose} aria-label="Close"><Icon name="close" size={20} sw={2} /></button>
        {children}
      </div>
    </div>
  );
}
