import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>

      {/* COPYRIGHT (the year is filled in automatically) */}
      <p className={styles.copyright}>© {new Date().getFullYear()} Autospire. All rights reserved.</p>

      {/* TEAL SHAPE ON THE RIGHT, with the tagline on top of it */}
      <div className={styles.panel}>

        {/* the angled teal shape, drawn as a picture (you rarely need to edit this) */}
        <svg className={styles.shape} viewBox="0 0 600 142" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="footerShape" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#20f4f4" />
              <stop offset=".3" stopColor="#03edee" />
              <stop offset=".8" stopColor="#05e6de" />
              <stop offset="1" stopColor="#02d9d3" />
            </linearGradient>
            <linearGradient id="footerSlant" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#3ff0f4" stopOpacity=".55" />
              <stop offset="1" stopColor="#3ff0f4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M232 142 L260 142 L338 34 Q342 28 338 28 Z" fill="url(#footerSlant)" />
          <path d="M260 142 L338 34 Q346 24 362 21 L545 0 L600 0 L600 142 Z" fill="url(#footerShape)" />
        </svg>

        {/* tagline and the small "A" logo mark */}
        <div className={styles.tagline}>
          <span>Drive Better. Service Smarter.</span>
          <svg className={styles.logoMark} viewBox="0 0 100 94" aria-hidden="true">
            <path d="M8 94 L46 4 Q50 -2 54 4 L92 94 L72 94 L50 40 L28 94 Z" fill="#0b3558" />
            <path d="M20 72 L78 54 L84 68 L26 86 Z" fill="#0b3558" />
          </svg>
        </div>

      </div>
    </footer>
  );
}