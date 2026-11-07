"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import { services, emirates, vehicles, PHONE, TEL, EMAIL, ADDRESS, HOURS } from "@/lib/data";
import styles from "./Enquiry.module.css";

/* ---------- ONE LINE OF CONTACT DETAILS (icon + small label + value) ---------- */
function ContactItem({ icon, label, children }) {
  return (
    <li>
      <span><Icon name={icon} size={20} /></span>
      <div>
        <small>{label}</small>
        {children}
      </div>
    </li>
  );
}

/* ---------- THE "THANK YOU" MESSAGE (shown after sending) ---------- */
function ThankYou({ onSendAnother }) {
  return (
    <div className={`${styles.form} ${styles.success}`}>
      <Icon name="check" size={40} sw={2.4} />
      <h3>Thank you!</h3>
      <p>Your enquiry has been received. Our team will contact you shortly.</p>
      <button className="btn line" onClick={onSendAnother}>Send another enquiry</button>
    </div>
  );
}

/* ---------- THE WHOLE SECTION ---------- */
// vehicle, service and emirate are shared with the Hero search box (they come from page.jsx),
// so choosing one in the Hero also fills it in here.
export default function Enquiry({ vehicle, setVehicle, service, setService, emirate, setEmirate }) {
  // true after the form has been sent
  const [sent, setSent] = useState(false);

  // If the vehicle was chosen elsewhere and isn't in the list, add it so the dropdown can show it
  const vehicleOptions = vehicle && !vehicles.includes(vehicle) ? [...vehicles, vehicle] : vehicles;

  // Runs when the customer clicks "Send Enquiry"
  function handleSubmit(event) {
    event.preventDefault();
    // TODO: send the enquiry to your server or email service here
    // (for example a POST request to /api/enquiry)
    setSent(true);
  }

  return (
    <section id="enquiry" className={styles.section}>
      <div className={`wrap ${styles.layout}`}>

        {/* LEFT SIDE: title and contact details */}
        <div className={styles.intro}>
          <h2>Enquiry</h2>
          <p>Tell us what your car needs and we will get back to you fast.</p>

          <ul className={styles.contactList}>
            <ContactItem icon="phone" label="Call us"><a href={TEL}>{PHONE}</a></ContactItem>
            <ContactItem icon="mail" label="Email"><a href={`mailto:${EMAIL}`}>{EMAIL}</a></ContactItem>
            <ContactItem icon="pin" label="Location">{ADDRESS}</ContactItem>
            <ContactItem icon="clock" label="Opening hours">
              {HOURS.map(({ days, time }) => <div key={days}>{days}: {time}</div>)}
            </ContactItem>
          </ul>
        </div>

        {/* RIGHT SIDE: the form, or the thank-you message after sending */}
        {sent ? (
          <ThankYou onSendAnother={() => setSent(false)} />
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>

            {/* name and phone */}
            <div className={styles.twoColumns}>
              <label>Full name<input required placeholder="Your name" /></label>
              <label>Phone<input required type="tel" placeholder="+971 5X XXX XXXX" /></label>
            </div>

            {/* email and emirate */}
            <div className={styles.twoColumns}>
              <label>Email<input type="email" placeholder="you@email.com" /></label>
              <label>Emirate
                <select value={emirate} onChange={(e) => setEmirate(e.target.value)}>
                  {emirates.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
            </div>

            {/* vehicle and service */}
            <div className={styles.twoColumns}>
              <label>Vehicle
                <select value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
                  <option value="">Select your vehicle</option>
                  {vehicleOptions.map((name) => <option key={name}>{name}</option>)}
                </select>
              </label>
              <label>Service
                <select value={service} onChange={(e) => setService(e.target.value)}>
                  <option value="">Select service</option>
                  {services.map((s) => <option key={s.id}>{s.title}</option>)}
                </select>
              </label>
            </div>

            {/* message */}
            <label>Message<textarea rows={4} placeholder="Describe the problem or what you need" /></label>

            <button className="btn" type="submit">Send Enquiry <Icon name="arrow" size={18} sw={2.2} /></button>
          </form>
        )}

      </div>
    </section>
  );
}