"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Slider from "@/components/Slider/Slider";
import { howBook, howQuote, reviews } from "@/lib/data";
import styles from "./HowItWorks.module.css";

const MODES = [
  { id: "book",  label: "Book a Service",      note: "Fixed prices, instant booking.",            steps: howBook },
  { id: "quote", label: "Request Quotations",  note: "3 garages compete. You choose the best.",   steps: howQuote },
];

/* ---------- THE 4 NUMBERED STEPS ---------- */
function Steps({ list }) {
  return (
    <div className={styles.steps}>
      {list.map((step, index) => (
        <div key={step.line1} className={styles.step}>
          <span className={styles.circle}>
            <span className={styles.number}>{index + 1}</span>
            <Icon name={step.icon} size={30} sw={1.5} />
          </span>
          <span className={styles.label}>{step.line1}<br />{step.line2}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- ONE CUSTOMER REVIEW ---------- */
function Review({ review }) {
  return (
    <figure className={styles.review}>
      <div className={styles.reviewText}>
        <blockquote>{review.text}</blockquote>
        <b className={styles.reviewerName}>{review.name}</b>
        <span className={styles.stars}>
          {[1, 2, 3, 4, 5].map((number) => (
            <Icon key={number} name="star" size={15} fill="#f5a623" sw={0} />
          ))}
        </span>
      </div>
      <span className={styles.avatar}>{review.name[0]}</span>
    </figure>
  );
}

/* ---------- THE WHOLE SECTION ---------- */
export default function HowItWorks() {
  const [mode, setMode] = useState("book");
  const active = MODES.find((m) => m.id === mode);

  return (
    <section id="how" className={styles.section}>
      <div className={`wrap ${styles.layout}`}>

        {/* COLUMN 1: title and the Book / Quote switch */}
        <div className={styles.title}>
          <h2>How It Works</h2>
          <p>Two ways to get your car sorted.</p>

          <div className={styles.modeToggle} role="tablist">
            {MODES.map((m) => (
              <button
                key={m.id}
                role="tab"
                aria-selected={mode === m.id}
                className={`${styles.modeButton} ${mode === m.id ? styles.modeActive : ""}`}
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className={styles.modeNote}>{active.note}</p>
        </div>

        {/* COLUMN 2: the 4 steps for the chosen journey */}
        <Steps list={active.steps} />

        {/* COLUMN 3: reviews */}
        <div className={styles.reviewBox}>
          <h3 className={styles.reviewsTitle}>Reviews</h3>
          <Slider variant="reviews" label="reviews">
            {reviews.map((review) => (
              <Review key={review.name} review={review} />
            ))}
          </Slider>
        </div>

      </div>
    </section>
  );
}