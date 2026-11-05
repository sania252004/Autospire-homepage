import { makeCx } from "@/lib/cx";
import styles from "./Footer.module.css";
const cx = makeCx(styles);

export default function Footer() {
  return (
    <footer className={cx("ft")}>
      <p className={cx("copy")}>© {new Date().getFullYear()} Autospire. All rights reserved.</p>

      <div className={cx("panel")}>
        <svg className={cx("shape")} viewBox="0 0 600 142" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="ftg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#20f4f4" />
              <stop offset=".3" stopColor="#03edee" />
              <stop offset=".8" stopColor="#05e6de" />
              <stop offset="1" stopColor="#02d9d3" />
            </linearGradient>
            <linearGradient id="ftsl" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#3ff0f4" stopOpacity=".55" />
              <stop offset="1" stopColor="#3ff0f4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M232 142 L260 142 L338 34 Q342 28 338 28 Z" fill="url(#ftsl)" />
          <path d="M260 142 L338 34 Q346 24 362 21 L545 0 L600 0 L600 142 Z" fill="url(#ftg)" />
        </svg>

        <div className={cx("tag")}>
          <span>Drive Better. Service Smarter.</span>
          <svg className={cx("mark")} viewBox="0 0 100 94" aria-hidden="true">
            <path d="M8 94 L46 4 Q50 -2 54 4 L92 94 L72 94 L50 40 L28 94 Z" fill="#0b3558" />
            <path d="M20 72 L78 54 L84 68 L26 86 Z" fill="#0b3558" />
          </svg>
        </div>
      </div>
    </footer>
  );
}