"use client";

import Modal from "@/components/Modal/Modal";
import Icon from "@/components/Icon/Icon";
import styles from "./GarageModal.module.css";

export default function GarageModal({ garage, onClose, goTab }) {
  const photo = `url(/images/garage-${garage.id}.jpg), linear-gradient(135deg,#2a5aa0,#0a2342)`;

  return (
    <Modal wide onClose={onClose}>

      <div className={styles.photo} style={{ backgroundImage: photo }} />

      <div className={styles.body}>

        <div className={styles.titleRow}>
          <h3>{garage.name}</h3>
          <span className={styles.badge}><Icon name="check" size={13} sw={3} /> Verified</span>
        </div>

        <p className={styles.meta}>
          <Icon name="star" size={16} fill="#f5a623" sw={0} /> <b>{garage.rating}</b> ({garage.reviews} reviews)
          &nbsp;·&nbsp;
          <Icon name="pin" size={14} fill="currentColor" sw={0} /> {garage.address}
        </p>

        <p className={styles.description}>{garage.about}</p>

        {/* KEY FACTS */}
        <div className={styles.facts}>
          <div className={styles.fact}><Icon name="pin" size={20} sw={1.6} /><span><small>Distance</small><b>{garage.distanceKm} km from you</b></span></div>
          <div className={styles.fact}><Icon name="calendar" size={20} sw={1.6} /><span><small>Earliest appointment</small><b>{garage.nextSlot}</b></span></div>
          <div className={styles.fact}><Icon name="rta" size={20} sw={1.6} /><span><small>Warranty</small><b>{garage.warranty}</b></span></div>
          <div className={styles.fact}><Icon name="car" size={20} sw={1.6} /><span><small>Collection & delivery</small><b>{garage.collection ? "Available" : "Not available"}</b></span></div>
          <div className={styles.fact}><Icon name="clock" size={20} sw={1.6} /><span><small>Estimated completion</small><b>{garage.completion}</b></span></div>
          <div className={styles.fact}><Icon name="check" size={20} sw={1.8} /><span><small>Completed through Autospire</small><b>{garage.jobs.toLocaleString()} jobs</b></span></div>
        </div>

        {/* SPECIALITIES AND BRANDS */}
        <h4>Specialities</h4>
        <div className={styles.chips}>
          {garage.specialities.map((item) => <span key={item} className={styles.chip}>{item}</span>)}
        </div>
        <h4>Vehicle brands supported</h4>
        <div className={styles.chips}>
          {garage.brands.map((item) => <span key={item} className={styles.chip}>{item}</span>)}
        </div>

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
            <h4>Opening hours</h4>
            <p className={styles.description}>{garage.hours}</p>
            <h4>Starting price</h4>
            <p className={styles.description}>From <b>AED {garage.from}</b></p>
          </div>
        </div>

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
            <p>Your request goes to 3 garages. Compare itemised quotes and choose.</p>
            <button className="btn line" onClick={() => goTab("quote")}>Request a Quote</button>
          </div>
        </div>

      </div>
    </Modal>
  );
}