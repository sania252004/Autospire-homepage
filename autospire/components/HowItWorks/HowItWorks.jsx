import Icon from "@/components/Icon/Icon";
import { reviews } from "@/lib/data";
import styles from "./HowItWorks.module.css";

/* ---------- ONE CUSTOMER REVIEW ---------- */
function Review({ review }) {
  return (
    <figure className={styles.card}>

      {/* 5 stars */}
      <span className={styles.stars} role="img" aria-label="5 out of 5 stars">
        {[1, 2, 3, 4, 5].map((number) => (
          <Icon key={number} name="star" size={16} fill="#f5a623" sw={0} />
        ))}
      </span>

      {/* what the customer said */}
      <blockquote>{review.text}</blockquote>

      {/* who said it: circle with their first letter, name, small label */}
      <figcaption className={styles.person}>
        <span className={styles.avatar}>{review.name[0]}</span>
        <span>
          <b>{review.name}</b>
          <small><Icon name="check" size={13} sw={3} /> Karevo customer</small>
        </span>
      </figcaption>
    </figure>
  );
}

/* ---------- THE WHOLE SECTION (reviews only) ---------- */
export default function HowItWorks() {
  return (
    <section id="reviews" className={styles.section}>
      <div className="wrap">

        {/* heading */}
        <header className={styles.head}>
          <span className={styles.tag}>CUSTOMER REVIEWS</span>
          <h2>
            What drivers say about <span className={styles.highlight}>Karevo</span>
          </h2>
          <p>Drivers across the UAE use Karevo to compare garages, get fair quotes and book with confidence.</p>
        </header>

        {/* the review cards */}
        <div className={styles.grid}>
          {reviews.map((review) => (
            <Review key={review.name} review={review} />
          ))}
        </div>

      </div>
    </section>
  );
}