import Icon from "@/components/Icon/Icon";
import Logo from "@/components/Logo/Logo";
import styles from "./Auth.module.css";

const BENEFITS = [
  { icon: "scale", title: "Compare competing quotes",  text: "3 verified garages send itemised quotations." },
  { icon: "tag",   title: "Book at a fixed price",     text: "See the price before you pay." },
  { icon: "car",   title: "Every vehicle in one place", text: "Reminders, history and documents." },
];

/* the full-screen page: glowing background, benefits on the left, glass card on the right */
export default function AuthShell({ title, subtitle, footer, children }) {
  return (
    <main className={styles.auth}>
      <span className={`${styles.orb} ${styles.orbA}`} aria-hidden="true" />
      <span className={`${styles.orb} ${styles.orbB}`} aria-hidden="true" />
      <span className={`${styles.orb} ${styles.orbC}`} aria-hidden="true" />

      <div className={styles.top}>
        <a href="/" aria-label="Autospire home"><Logo size={40} /></a>
        <a href="/" className={styles.back}>← Back to home</a>
      </div>

      <section className={styles.brand}>
        <h1>Your car,<br /><span className={styles.hl}>fully managed.</span></h1>
        <p className={styles.lead2}>The automotive marketplace and vehicle manager for the UAE.</p>
        <ul className={styles.benefits}>
          {BENEFITS.map((b) => (
            <li key={b.title} className={styles.benefit}>
              <span className={styles.benefitIcon}><Icon name={b.icon} size={24} sw={1.6} /></span>
              <span><b>{b.title}</b><small>{b.text}</small></span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <header className={styles.cardHead}>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </header>
        {children}
        <p className={styles.footer}>{footer}</p>
      </section>
    </main>
  );
}