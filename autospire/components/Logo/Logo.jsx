import { BRAND } from "@/lib/data";
import { makeCx } from "@/lib/cx";
import styles from "./Logo.module.css";
const cx = makeCx(styles);

export default function Logo({ size = 62, text = true }) {
  return (
    <span className={cx("logo")}>
      <svg viewBox="60 40 600 490" width={size} height={Math.round((size * 490) / 600)} aria-hidden="true">
        <polygon points="345,62 410,62 425,135 375,200 280,335 190,332" fill="#1a9fb4" />
        <polygon points="412,62 557,340 470,345 375,200 425,135" fill="#22f2f0" />
        <polygon points="557,340 470,345 540,510 645,510" fill="#1fcfc9" />
        <polygon points="190,335 278,338 170,510 75,510" fill="#22f2f0" />
        <polygon points="310,342 435,352 448,372 428,402 330,415 250,432" fill="#1de8e6" />
      </svg>
      {text && <span>{BRAND}</span>}
    </span>
  );
}