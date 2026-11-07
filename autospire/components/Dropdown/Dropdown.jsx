"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon/Icon";
import styles from "./Dropdown.module.css";

// value       = the currently chosen item
// onChange    = function that runs with the new item when one is picked
// options     = the list of items to choose from
// placeholder = grey text shown when nothing is chosen yet
// icon        = icon on the left (optional)
// variant     = "field" (default) or "mini"
// format      = changes how an item is shown, e.g. "Dubai" -> "Dubai, UAE"
// label       = a name for screen readers (optional)
export default function Dropdown({ value, onChange, options, placeholder, icon, variant = "field", format = (item) => item, label }) {
  const [isOpen, setIsOpen] = useState(false); // is the list showing?
  const boxRef = useRef(null);                 // the whole dropdown, used to detect outside clicks
  const isMini = variant === "mini";

  // Close the list when the visitor clicks elsewhere or presses the Escape key
  useEffect(() => {
    function closeIfClickedOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) setIsOpen(false);
    }
    function closeOnEscape(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", closeIfClickedOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeIfClickedOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  // Runs when the visitor picks an item
  function chooseItem(item) {
    onChange(item);
    setIsOpen(false);
  }

  return (
    <div className={`${styles.dropdown} ${styles[variant]} ${isOpen ? styles.open : ""}`} ref={boxRef}>

      {/* THE BOX YOU CLICK: icon, chosen item (or placeholder), little arrow */}
      <button
        type="button"
        className={styles.button}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label || placeholder}
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon && <Icon name={icon} size={isMini ? 16 : 20} fill={isMini ? "currentColor" : "none"} sw={isMini ? 0 : 1.6} />}
        <span className={value ? undefined : styles.placeholder}>{value ? format(value) : placeholder}</span>
        <Icon name="down" size={isMini ? 13 : 16} sw={2.6} />
      </button>

      {/* THE LIST (only shown while open) */}
      {isOpen && (
        <ul className={styles.list} role="listbox">
          {options.map((item) => (
            <li key={item}>
              <button type="button" role="option" aria-selected={item === value} onClick={() => chooseItem(item)}>
                {format(item)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}