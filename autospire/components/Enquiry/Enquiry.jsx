"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import { services, emirates, vehicles, PHONE, TEL, EMAIL, ADDRESS, HOURS } from "@/lib/data";
import { makeCx } from "@/lib/cx";
import styles from "./Enquiry.module.css";
const cx = makeCx(styles);

export default function Enquiry({ vehicle, setVehicle, service, setService, emirate, setEmirate }) {
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    // TODO: connect to your backend or email service (e.g. POST to /api/enquiry)
    setSent(true);
  };
  return (
    <section id="enquiry" className={cx("enq")}>
      <div className={cx("wrap erow")}>
        <div className={cx("eintro")}>
          <h2>Enquiry</h2>
          <p>Tell us what your car needs and we will get back to you fast.</p>
          <ul className={cx("cinfo")}>
            <li><span><Icon name="phone" size={20} /></span><div><small>Call us</small><a href={TEL}>{PHONE}</a></div></li>
            <li><span><Icon name="mail" size={20} /></span><div><small>Email</small><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div></li>
            <li><span><Icon name="pin" size={20} /></span><div><small>Location</small>{ADDRESS}</div></li>
            <li><span><Icon name="clock" size={20} /></span><div><small>Opening hours</small>{HOURS.map(([d, t]) => <div key={d}>{d}: {t}</div>)}</div></li>
          </ul>
        </div>
        {sent ? (
          <div className={cx("eform done")}><Icon name="check" size={40} sw={2.4} /><h3>Thank you!</h3><p>Your enquiry has been received. Our team will contact you shortly.</p><button className={cx("btn line")} onClick={() => setSent(false)}>Send another enquiry</button></div>
        ) : (
          <form className={cx("eform")} onSubmit={submit}>
            <div className={cx("f2")}><label>Full name<input required placeholder="Your name" /></label><label>Phone<input required type="tel" placeholder="+971 5X XXX XXXX" /></label></div>
            <div className={cx("f2")}><label>Email<input type="email" placeholder="you@email.com" /></label>
              <label>Emirate<select value={emirate} onChange={(e) => setEmirate(e.target.value)}>{emirates.map((e) => <option key={e} value={e}>{e}</option>)}</select></label></div>
            <div className={cx("f2")}>
              <label>Vehicle<select value={vehicle} onChange={(e) => setVehicle(e.target.value)}><option value="">Select your vehicle</option>{vehicles.map((v) => <option key={v}>{v}</option>)}{vehicle && !vehicles.includes(vehicle) && <option>{vehicle}</option>}</select></label>
              <label>Service<select value={service} onChange={(e) => setService(e.target.value)}><option value="">Select service</option>{services.map((s) => <option key={s.id}>{s.title}</option>)}</select></label>
            </div>
            <label>Message<textarea rows={4} placeholder="Describe the problem or what you need" /></label>
            <button className={cx("btn")} type="submit">Send Enquiry <Icon name="arrow" size={18} sw={2.2} /></button>
          </form>
        )}
      </div>
    </section>
  );
}
