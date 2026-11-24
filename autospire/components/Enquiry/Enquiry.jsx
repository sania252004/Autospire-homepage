"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon/Icon";
import { services, emirates, carModels, carMakes, carYears, BRAND, PHONE, TEL, EMAIL, ADDRESS, HOURS } from "@/lib/data";
import styles from "./Enquiry.module.css";

/* turns "2023 Mercedes-Benz GLC" into { year, make, model } */
function parseVehicle(text) {
  const parts = (text || "").split(" ");
  const year = /^\d{4}$/.test(parts[0]) ? parts[0] : "";
  const rest = year ? parts.slice(1).join(" ") : text || "";
  const make = carMakes.find((m) => rest.startsWith(m)) || "";
  const model = make ? rest.slice(make.length).trim() : "";
  return { year, make, model };
}

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

/* ---------- NEW: THE "PARTNER WITH" POP-UP ---------- */
function PartnerModal({ onClose }) {
  const [sent, setSent] = useState(false);

  // pressing the Esc key closes the pop-up
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();

    // everything the garage typed, e.g. { name: "...", registration: "...", address: "...", ... }
    const data = Object.fromEntries(new FormData(event.target));

    // TODO: send "data" to your server or email service here
    setSent(true);
  }

  return (
    // clicking the dark area closes the pop-up
    <div className={styles.overlay} onClick={onClose}>
      {/* clicking inside the box does not close it */}
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="partner-title" onClick={(e) => e.stopPropagation()}>

        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">✕</button>

        {sent ? (
          <div className={`${styles.form} ${styles.success} ${styles.partnerForm}`}>
            <Icon name="check" size={40} sw={2.4} />
            <h3 id="partner-title">Thank you!</h3>
            <p>We have received your details. The {BRAND} partner team will review them and contact you shortly.</p>
            <button type="button" className="btn line" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h3 id="partner-title">Partner with {BRAND}</h3>
            <p className={styles.modalIntro}>Own or manage a garage? Tell us about it and we will get in touch about joining the {BRAND} marketplace.</p>

            <form className={`${styles.form} ${styles.partnerForm}`} onSubmit={handleSubmit}>
              <label>Name
                <input name="name" required maxLength={120} placeholder="Garage or business name" />
              </label>

              <label>Registration number
                <input name="registration" required maxLength={60} placeholder="Trade licence or registration number" />
              </label>

              <label>Address
                <input name="address" required maxLength={200} placeholder="Street, area and city" />
              </label>

              <label>Email
                <input name="email" required type="email" maxLength={255} placeholder="garage@email.com" />
              </label>

              <label>Location
                <select name="location" required defaultValue="">
                  <option value="" disabled>Select emirate</option>
                  {emirates.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>

              <label>Comments
                <textarea name="comments" rows={4} maxLength={1000} placeholder="Tell us about your garage: services, car brands, number of bays..." />
              </label>

              <button className="btn" type="submit">Send Partner Enquiry <Icon name="arrow" size={18} sw={2.2} /></button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}

// vehicle, service and emirate are shared with the Hero search box (they come from page.jsx)
export default function Enquiry({ vehicle, setVehicle, service, setService, emirate, setEmirate }) {
  const [sent, setSent] = useState(false);

  // NEW: is the "Partner with" pop-up open?
  const [partnerOpen, setPartnerOpen] = useState(false);

  // make / model / year are kept here so a half-finished choice is not lost
  const first = parseVehicle(vehicle);
  const [make, setMake] = useState(first.make);
  const [model, setModel] = useState(first.model);
  const [year, setYear] = useState(first.year);

  // when the Hero picks a full vehicle, fill the three dropdowns to match
  useEffect(() => {
    const p = parseVehicle(vehicle);
    if (p.make && p.model && p.year) {
      setMake(p.make);
      setModel(p.model);
      setYear(p.year);
    }
  }, [vehicle]);

  // change one dropdown and tell the page (the shared vehicle is only set when all three are chosen)
  function update(nextMake, nextModel, nextYear) {
    setMake(nextMake);
    setModel(nextModel);
    setYear(nextYear);
    setVehicle(nextMake && nextModel && nextYear ? `${nextYear} ${nextMake} ${nextModel}` : "");
  }

  function handleSubmit(event) {
    event.preventDefault();
    // TODO: send the enquiry to your server or email service here
    setSent(true);
  }

  return (
    <section id="enquiry" className={styles.section}>
      <div className={`wrap ${styles.layout}`}>

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

          {/* NEW: the "Partner with" box */}
          <div className={styles.partner}>
            <h3>Own a garage?</h3>
            <p>Join the {BRAND} marketplace and get new customers sending jobs your way.</p>
            <button type="button" className="btn line" onClick={() => setPartnerOpen(true)}>
              Partner with {BRAND}
            </button>
          </div>
        </div>

        {sent ? (
          <ThankYou onSendAnother={() => setSent(false)} />
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.twoColumns}>
              <label>Full name<input required placeholder="Your name" /></label>
              <label>Phone<input required type="tel" placeholder="+971 5X XXX XXXX" /></label>
            </div>

            <div className={styles.twoColumns}>
              <label>Email<input type="email" placeholder="you@email.com" /></label>
              <label>Emirate
                <select value={emirate} onChange={(e) => setEmirate(e.target.value)}>
                  {emirates.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
            </div>

            {/* vehicle: make and model, then year and service */}
            <div className={styles.twoColumns}>
              <label>Make
                <select value={make} onChange={(e) => update(e.target.value, "", year)}>
                  <option value="">Select make</option>
                  {carMakes.map((m) => <option key={m}>{m}</option>)}
                </select>
              </label>
              <label>Model
                <select value={model} disabled={!make} onChange={(e) => update(make, e.target.value, year)}>
                  <option value="">Select model</option>
                  {(carModels[make] || []).map((m) => <option key={m}>{m}</option>)}
                </select>
              </label>
            </div>

            <div className={styles.twoColumns}>
              <label>Year
                <select value={year} onChange={(e) => update(make, model, e.target.value)}>
                  <option value="">Select year</option>
                  {carYears.map((y) => <option key={y}>{y}</option>)}
                </select>
              </label>
              <label>Service
                <select value={service} onChange={(e) => setService(e.target.value)}>
                  <option value="">Select service</option>
                  {services.map((s) => <option key={s.id}>{s.title}</option>)}
                </select>
              </label>
            </div>

            <label>Message<textarea rows={4} placeholder="Describe the problem or what you need" /></label>

            <button className="btn" type="submit">Send Enquiry <Icon name="arrow" size={18} sw={2.2} /></button>
          </form>
        )}

      </div>

      {/* NEW: the pop-up (only exists while it is open) */}
      {partnerOpen && <PartnerModal onClose={() => setPartnerOpen(false)} />}
    </section>
  );
}