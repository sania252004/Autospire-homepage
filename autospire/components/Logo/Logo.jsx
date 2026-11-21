import { BRAND } from "@/lib/data";
import styles from "./Logo.module.css";

// size  = width of the "K" mark in pixels
// text  = false shows only the mark, without the name
// color = optional, paints the whole mark one colour (used in the footer)
export default function Logo({ size = 62, text = true, color }) {
  return (
    <span className={styles.logo}>

      {/* the "K" mark, drawn from five coloured shapes */}
      <svg viewBox="105 57 545 458" width={size} height={Math.round((size * 458) / 545)} aria-hidden="true">
        <polygon points="110,62 235,62 235,300 110,300" fill={color || "#1a9fb4"} />
        <polygon points="110,300 235,300 235,510 110,510" fill={color || "#22f2f0"} />
        <polygon points="235,300 410,62 560,62 345,345 235,400" fill={color || "#22f2f0"} />
        <polygon points="330,335 460,335 645,510 505,510" fill={color || "#1fcfc9"} />
        <polygon points="235,400 345,345 395,365 235,450" fill={color || "#1de8e6"} />
      </svg>

      {/* the brand name next to the mark */}
      {text && <span className={styles.name}>{BRAND}</span>}
    </span>
  );
}