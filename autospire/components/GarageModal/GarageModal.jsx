"use client";
import Modal from "@/components/Modal/Modal";
import Icon from "@/components/Icon/Icon";
import { makeCx } from "@/lib/cx";
import styles from "./GarageModal.module.css";
const cx = makeCx(styles);

export default function GarageModal({ gar, onClose, goTab }) {
  return (
    <Modal wide onClose={onClose}>
      <div className={cx("img")} style={{ backgroundImage: `url(/images/garage-${gar.id}.jpg), linear-gradient(135deg,#2a5aa0,#0a2342)` }} />
      <div className={cx("body")}>
        <div className={cx("top")}><h3>{gar.name}</h3><span className={cx("ver")}><Icon name="check" size={13} sw={3} /> Verified</span></div>
        <p className={cx("meta")}><Icon name="star" size={16} fill="#f5a623" sw={0} /> <b>{gar.rating}</b> ({gar.reviews} reviews) &nbsp;·&nbsp; <Icon name="pin" size={14} fill="currentColor" sw={0} /> {gar.address}</p>
        <p className={cx("mtxt")}>{gar.about}</p>
        <div className={cx("cols")}>
          <div><h4>Services offered</h4><ul className={cx("mpts")}>{gar.offers.map((o) => <li key={o}><Icon name="check" size={16} sw={3} />{o}</li>)}</ul></div>
          <div><h4>Hours</h4><p className={cx("mtxt")}>{gar.hours}</p><h4>Prices</h4><p className={cx("mtxt")}>From <b>AED {gar.from}</b></p></div>
        </div>
        <div className={cx("two")}>
          <div className={cx("opt")}><span className={cx("mico")}><Icon name="tag" size={20} /></span><b>Fixed-price booking</b><p>See the price upfront and book an exact time slot instantly.</p><button className="btn" onClick={() => goTab("book")}>Book Now</button></div>
          <div className={cx("opt")}><span className={cx("mico")}><Icon name="scale" size={20} /></span><b>Competitive quotation</b><p>Garages compete with their best price. Compare up to 5 quotes.</p><button className="btn line" onClick={() => goTab("quote")}>Request a Quote</button></div>
        </div>
      </div>
    </Modal>
  );
}
