"use client";

import Modal from "@/components/Modal/Modal";
import Icon from "@/components/Icon/Icon";
import styles from "./ServiceModal.module.css";

// service = the service being shown (from lib/data.js)
// onClose = closes the pop-up
// goTab   = switches the Hero tab and scrolls to the top (from page.jsx)
export default function ServiceModal({ service, onClose, goTab }) {
  return (
    <Modal onClose={onClose}>
      <div className={styles.content}>

        {/* icon, name and description */}
        <span className={styles.iconBox}><Icon name={service.icon} size={44} sw={1.4} /></span>
        <h3>{service.title}</h3>
        <p className={styles.description}>{service.long}</p>

        {/* list of what the service includes (each with a tick) */}
        <ul className={styles.points}>
          {service.points.map((point) => (
            <li key={point}><Icon name="check" size={16} sw={3} />{point}</li>
          ))}
        </ul>

        {/* the two buttons: both close the pop-up and fill in this service in the Hero */}
        <div className={styles.buttons}>
          <button className="btn" onClick={() => goTab("book", service.title)}>Book This Service</button>
          <button className="btn line" onClick={() => goTab("quote", service.title)}>Request Quotes</button>
        </div>

      </div>
    </Modal>
  );
}