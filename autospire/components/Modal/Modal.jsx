"use client";
import { useEffect } from "react";
import Icon from "@/components/Icon/Icon";
import styles from "./Modal.module.css";

// onClose  = function that closes the pop-up
// children = whatever is shown inside the pop-up
// wide     = true makes the pop-up wider (used by the garage pop-up)
export default function Modal({ onClose, children, wide }) {
  // While the pop-up is open: Escape closes it, and the page behind can't scroll
  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    // clicking the dark area outside the box closes the pop-up
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">

      {/* the box itself (clicks inside it must NOT close the pop-up) */}
      <div className={`${styles.modal} ${wide ? styles.wide : ""}`} onClick={(event) => event.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <Icon name="close" size={20} sw={2} />
        </button>
        {children}
      </div>

    </div>
  );
}