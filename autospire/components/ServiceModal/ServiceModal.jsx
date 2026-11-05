"use client";
import Modal from "@/components/Modal/Modal";
import Icon from "@/components/Icon/Icon";
import { makeCx } from "@/lib/cx";
import styles from "./ServiceModal.module.css";
const cx = makeCx(styles);

export default function ServiceModal({ svc, onClose, goTab }) {
  return (
    <Modal onClose={onClose}>
      <div className={cx("sm")}>
        <span className={cx("mico")}><Icon name={svc.icon} size={44} sw={1.4} /></span>
        <h3>{svc.title}</h3>
        <p className={cx("mtxt")}>{svc.long}</p>
        <ul className={cx("mpts")}>{svc.points.map((p) => <li key={p}><Icon name="check" size={16} sw={3} />{p}</li>)}</ul>
        <div className={cx("mbtns")}>
          <button className="btn" onClick={() => goTab("book", svc.title)}>Book This Service</button>
          <button className="btn line" onClick={() => goTab("quote", svc.title)}>Request Quotes</button>
        </div>
      </div>
    </Modal>
  );
}
