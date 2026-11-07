import Icon from "@/components/Icon/Icon";
import Slider from "@/components/Slider/Slider";
import { garages } from "@/lib/data";
import styles from "./Garages.module.css";

/* ---------- ONE GARAGE CARD ---------- */
// Shows the photo, name, "Verified" badge, rating, area and starting price.
// Clicking the card opens that garage's pop-up.
function GarageCard({ garage, photoNumber, onOpen }) {
  // Photo file is /images/garage-1.jpg, garage-2.jpg, ...
  // If the photo is missing, a blue gradient is shown instead.
  const photo = `url(/images/garage-${photoNumber}.jpg), linear-gradient(135deg,#2a5aa0,#0a2342)`;

  return (
    <button className={styles.card} onClick={onOpen} aria-label={`Open ${garage.name} profile`}>
      {/* photo at the top of the card */}
      <span className={styles.photo} style={{ backgroundImage: photo }} />

      <span className={styles.details}>
        {/* garage name + green "Verified" badge */}
        <span className={styles.nameRow}>
          <b>{garage.name}</b>
          <span className={styles.badge}>
            <Icon name="check" size={13} sw={3} /> Verified
          </span>
        </span>

        {/* star rating and number of reviews */}
        <span className={styles.rating}>
          <Icon name="star" size={15} fill="#f5a623" sw={0} /> <b>{garage.rating}</b> ({garage.reviews} reviews)
        </span>

        {/* area, e.g. "Dubai Marina" */}
        <span className={styles.location}>
          <Icon name="pin" size={14} fill="currentColor" sw={0} /> {garage.area}
        </span>

        {/* starting price + round arrow button */}
        <span className={styles.priceRow}>
          From AED {garage.from}
          <span className={styles.arrowButton}>
            <Icon name="arrow" size={16} sw={2.4} />
          </span>
        </span>
      </span>
    </button>
  );
}

/* ---------- THE WHOLE SECTION ---------- */
// "open" = a function from page.jsx that opens a garage pop-up
// "note" = a message shown after a search, e.g. "Showing garages for Brake Service in Dubai."
export default function Garages({ open, note }) {
  // The "View All Garages" button scrolls the cards back to the first one
  function scrollToFirstGarage(event) {
    event.preventDefault();
    const row = event.currentTarget.closest("section")?.querySelector("[data-track]");
    row?.scrollTo({ left: 0, behavior: "smooth" });
  }

  return (
    <section id="garages" className={styles.section}>
      <div className={`wrap ${styles.layout}`}>

        {/* LEFT SIDE: title, text and button */}
        <div className={styles.intro}>
          <h2>Featured Garages</h2>
          <p>Top-rated workshops,<br />verified for your peace of mind.</p>

          <a href="#garages" className={`btn line ${styles.viewAllButton}`} onClick={scrollToFirstGarage}>
            View All Garages <Icon name="arrow" size={18} sw={2.2} />
          </a>

          {/* message shown after a search (empty until the customer searches) */}
          {note && <p className={styles.note}>{note}</p>}
        </div>

        {/* RIGHT SIDE: the row of garage cards with < > arrows */}
        <Slider variant="garages" label="garages">
          {garages.map((garage, index) => (
            <GarageCard
              key={garage.id}
              garage={garage}
              photoNumber={index + 1}
              onOpen={() => open(garage.id)}
            />
          ))}
        </Slider>

      </div>
    </section>
  );
}