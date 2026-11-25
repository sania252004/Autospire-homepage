"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import { reviews } from "@/lib/data";
import styles from "./HowItWorks.module.css";

/* ---------- INLINE STEP & TOGGLE ICONS (guaranteed to render) ---------- */
function StepIcon({ name, size = 20, sw = 1.8 }) {
  const paths = {
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
    layers: (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    badge: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </>
    ),
    briefcase: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const CLIENT_STEPS = [
  {
    num: "01",
    icon: "edit",
    title: "Tell Us What Your Car Needs",
    desc: "Pick your car and service in seconds.",
  },
  {
    num: "02",
    icon: "layers",
    title: "Receive & Compare Quotes",
    desc: "Compare itemized prices and ratings.",
  },
  {
    num: "03",
    icon: "check",
    title: "Choose Workshop & Book",
    desc: "Confirm your slot with zero hidden fees.",
  },
];

const GARAGE_STEPS = [
  {
    num: "01",
    icon: "search",
    title: "Target Leads Your Way",
    desc: "Get requests matched to your workshop.",
  },
  {
    num: "02",
    icon: "send",
    title: "Send Itemized Quotations",
    desc: "Submit transparent parts and labour quotes.",
  },
  {
    num: "03",
    icon: "badge",
    title: "Win Bookings & Grow",
    desc: "Pay a simple fee only when you win.",
  },
];

export default function HowItWorks() {
  const [audience, setAudience] = useState("clients");
  const [slide, setSlide] = useState(0);

  const steps = audience === "clients" ? CLIENT_STEPS : GARAGE_STEPS;
  const totalReviews = reviews.length;
  const currentReview = reviews[slide] || reviews[0];

  const prevReview = () => setSlide((i) => (i <= 0 ? totalReviews - 1 : i - 1));
  const nextReview = () => setSlide((i) => (i >= totalReviews - 1 ? 0 : i + 1));

  return (
    <section id="how" className={styles.section}>
      <div className="wrap">
        <div className={styles.splitGrid}>
          {/* ---------- LEFT SIDE: HOW IT WORKS ---------- */}
          <div className={styles.leftCol}>
            <header className={styles.head}>
              <h2>How It Works</h2>
              <p>Your service journey made simple, clear, and secure</p>

              <div className={styles.toggleWrap} role="tablist" aria-label="How it works audience">
                <button
                  type="button"
                  role="tab"
                  aria-selected={audience === "clients"}
                  className={`${styles.toggleBtn} ${audience === "clients" ? styles.toggleActive : ""}`}
                  onClick={() => setAudience("clients")}
                >
                  <StepIcon name="user" size={15} sw={2} />
                  For Clients
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={audience === "garages"}
                  className={`${styles.toggleBtn} ${audience === "garages" ? styles.toggleActive : ""}`}
                  onClick={() => setAudience("garages")}
                >
                  <StepIcon name="briefcase" size={15} sw={2} />
                  For Garages
                </button>
              </div>
            </header>

            <div className={styles.cardsGrid}>
              {steps.map((step) => (
                <article key={step.num} className={styles.stepCard}>
                  <div className={styles.cardTop}>
                    <span className={styles.iconBox}>
                      <StepIcon name={step.icon} size={20} sw={1.9} />
                    </span>
                    <span className={styles.stepNum}>{step.num}</span>
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </article>
              ))}
            </div>

            <div className={styles.ctaRow}>
              <a href="#enquiry" className={styles.secondaryBtn}>
                See Detailed Flow &amp; FAQs →
              </a>

              {audience === "garages" && (
                <a href="/register" className={styles.primaryBtn}>
                  <StepIcon name="briefcase" size={16} sw={2} />
                  Join as Early Partner →
                </a>
              )}
            </div>

            <p className={styles.disclaimer}>
              <b>Karevo</b> is an intermediary technology platform. All service guarantees, pricing, and warranties are provided solely and directly by independent licensed workshops in the UAE.
            </p>
          </div>

          {/* ---------- RIGHT SIDE: CUSTOMER REVIEWS SLIDER ---------- */}
          <aside id="reviews" className={styles.rightCol}>
            <div className={styles.reviewPanel}>
              <div className={styles.reviewHead}>
                <span className={styles.tag}>CUSTOMER REVIEWS</span>
                <h3>
                  What drivers say about <span className={styles.highlight}>Karevo</span>
                </h3>
                <p>Real feedback from UAE drivers booking verified workshops.</p>
              </div>

              {/* Active Slide Card */}
              <div className={styles.reviewCard}>
                <div className={styles.reviewCardTop}>
                  <span className={styles.stars} role="img" aria-label="5 out of 5 stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Icon key={n} name="star" size={15} fill="#f5a623" sw={0} />
                    ))}
                  </span>
                </div>

                <p className={styles.reviewText}>{currentReview.text}</p>

                <div className={styles.person}>
                  <span className={styles.avatar}>{currentReview.name[0]}</span>
                  <div>
                    <b>{currentReview.name}</b>
                    <small>
                      <Icon name="check" size={12} sw={3} /> Karevo customer
                    </small>
                  </div>
                </div>
              </div>

              {/* Slider Controls & Dots */}
              <div className={styles.sliderFooter}>
                <div className={styles.dots}>
                  {reviews.map((r, i) => (
                    <button
                      key={r.name}
                      type="button"
                      onClick={() => setSlide(i)}
                      className={`${styles.dot} ${i === slide ? styles.dotActive : ""}`}
                      aria-label={`Review ${i + 1}`}
                    />
                  ))}
                </div>

                <div className={styles.arrows}>
                  <button
                    type="button"
                    onClick={prevReview}
                    className={styles.arrowBtn}
                    aria-label="Previous review"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={nextReview}
                    className={styles.arrowBtn}
                    aria-label="Next review"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}