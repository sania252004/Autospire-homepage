"use client";

import Modal from "@/components/Modal/Modal";
import Icon from "@/components/Icon/Icon";
import styles from "./GarageModal.module.css";

// garage  = the garage being shown (from lib/data.js)
// onClose = closes the pop-up
// goTab   = switches the Hero tab and scrolls to the top (from page.jsx)
export default function GarageModal({ garage, onClose, goTab }) {
  // If the photo file is missing, a blue gradient is shown instead
  const photo = `url(/images/garage-${garage.id}.jpg), linear-gradient(135deg,#2a5aa0,#0a2342)`;

  return (
    <Modal wide onClose={onClose}>

      {/* PHOTO */}
      <div className={styles.photo} style={{ backgroundImage: photo }} />

      <div className={styles.body}>

        {/* NAME and "Verified" badge */}
        <div className={styles.titleRow}>
          <h3>{garage.name}</h3>
          <span className={styles.badge}><Icon name="check" size={13} sw={3} /> Verified</span>
        </div>

        {/* RATING and ADDRESS */}
        <p className={styles.meta}>
          <Icon name="star" size={16} fill="#f5a623" sw={0} /> <b>{garage.rating}</b> ({garage.reviews} reviews)
          &nbsp;·&nbsp;
          <Icon name="pin" size={14} fill="currentColor" sw={0} /> {garage.address}
        </p>

        {/* DESCRIPTION */}
        <p className={styles.description}>{garage.about}</p>

        {/* TWO COLUMNS: services offered | hours and price */}
        <div className={styles.columns}>
          <div>
            <h4>Services offered</h4>
            <ul className={styles.checkList}>
              {garage.offers.map((offer) => (
                <li key={offer}><Icon name="check" size={16} sw={3} />{offer}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Hours</h4>
            <p className={styles.description}>{garage.hours}</p>
            <h4>Prices</h4>
            <p className={styles.description}>From <b>AED {garage.from}</b></p>
          </div>
        </div>

        {/* TWO BOOKING OPTIONS */}
        <div className={styles.bookingOptions}>
          <div className={styles.option}>
            <span className={styles.iconBox}><Icon name="tag" size={20} /></span>
            <b>Fixed-price booking</b>
            <p>See the price upfront and book an exact time slot instantly.</p>
            <button className="btn" onClick={() => goTab("book")}>Book Now</button>
          </div>

          <div className={styles.option}>
            <span className={styles.iconBox}><Icon name="scale" size={20} /></span>
            <b>Competitive quotation</b>
            <p>Garages compete with their best price. Compare up to 5 quotes.</p>
            <button className="btn line" onClick={() => goTab("quote")}>Request a Quote</button>
          </div>
        </div>

      </div>
    </Modal>
  );
}