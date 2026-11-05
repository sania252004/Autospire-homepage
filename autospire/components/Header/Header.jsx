"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Logo from "@/components/Logo/Logo";
import Dropdown from "@/components/Dropdown/Dropdown";
import { services, emirates } from "@/lib/data";
import { makeCx } from "@/lib/cx";
import styles from "./Header.module.css";
const cx = makeCx(styles);

export default function Header({ emirate, setEmirate, openService, goTab }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const Loc = <Dropdown variant="mini" icon="pin" value={emirate} onChange={setEmirate} options={emirates} format={(e) => `${e}, UAE`} label="Location" />;
  return (
    <header className={cx("hdr")}>
      <div className={cx("wrap hrow")}>
        <a href="#top" className={cx("brand")} onClick={close}><Logo /></a>

        <nav className={cx("nav")} aria-label="Main">
          <div className={cx("dd")}>
            <a href="#services">Services <Icon name="down" size={14} sw={2.6} /></a>
            <div className={cx("menu")}>
              {services.map((s) => <button key={s.id} onClick={() => openService(s.id)}>{s.title}</button>)}
            </div>
          </div>
          <div className={cx("dd")}>
            <a href="#garages">Garages <Icon name="down" size={14} sw={2.6} /></a>
            <div className={cx("menu")}>
              <a href="#garages">Featured Garages</a>
              <button onClick={() => goTab("garage")}>Find a Garage</button>
            </div>
          </div>
          <button onClick={() => goTab("quote")}>Compare Quotes</button>
          <a href="#how">About</a>
          <div className={cx("dd")}>
            <a href="#enquiry">Support <Icon name="down" size={14} sw={2.6} /></a>
            <div className={cx("menu")}>
              <a href="#enquiry">Enquiry &amp; Contact</a>
              <a href="#how">How It Works</a>
            </div>
          </div>
        </nav>

        <div className={cx("hright")}>
          {Loc}
          <span className={cx("vsep")} />
          <a href="#enquiry" className={cx("usr")} aria-label="Account"><Icon name="user" size={22} /></a>
          <a href="#enquiry" className={cx("acct")}>My Account <Icon name="down" size={12} sw={2.6} /></a>
          <button className={cx("burger")} onClick={() => setOpen(!open)} aria-label="Menu"><Icon name={open ? "close" : "menu"} size={26} /></button>
        </div>
      </div>

      {open && (
        <div className={cx("mob")}>
          <a href="#services" onClick={close}>Services</a>
          <a href="#garages" onClick={close}>Garages</a>
          <button onClick={() => { goTab("quote"); close(); }}>Compare Quotes</button>
          <a href="#how" onClick={close}>About</a>
          <a href="#enquiry" onClick={close}>Support</a>
          <a href="#enquiry" onClick={close} className={cx("btn")}>My Account</a>
        </div>
      )}
    </header>
  );
}
