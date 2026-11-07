import Icon from "@/components/Icon/Icon";
import Slider from "@/components/Slider/Slider";
import { steps, reviews } from "@/lib/data";
import styles from "./HowItWorks.module.css";

/* ---------- THE 4 NUMBERED STEPS ---------- */
function Steps() {
  return (
    <div className={styles.steps}>
      {steps.map((step, index) => (
        <div key={step.line1} className={styles.step}>
          {/* round circle with the icon inside and the number on top */}
          <span className={styles.circle}>
            <span className={styles.number}>{index + 1}</span>
            <Icon name={step.icon} size={30} sw={1.5} />
          </span>

          {/* text under the circle */}
          <span className={styles.label}>{step.line1}<br />{step.line2}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- ONE CUSTOMER REVIEW ---------- */
// Shows the review text, the name, 5 stars and a circle with the first letter of the name.
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

      {/* circle with the first letter of the name, e.g. "A" for Ahmed */}
      <span className={styles.avatar}>{review.name[0]}</span>
    </figure>
  );
}

/* ---------- THE WHOLE SECTION ---------- */
export default function HowItWorks() {
  return (
    <section id="how" className={styles.section}>
      <div className={`wrap ${styles.layout}`}>

        {/* COLUMN 1: title and short text */}
        <div className={styles.title}>
          <h2>How It Works</h2>
          <p>Get your car serviced<br />in just a few simple steps.</p>
        </div>

        {/* COLUMN 2: the 4 steps */}
        <Steps />

        {/* COLUMN 3: reviews with < > arrows */}
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