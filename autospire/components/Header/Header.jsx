"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Logo from "@/components/Logo/Logo";
import Dropdown from "@/components/Dropdown/Dropdown";
import { services, emirates } from "@/lib/data";
import styles from "./Header.module.css";

// Values below come from page.jsx:
// emirate / setEmirate = the chosen location and the function that changes it
// openService          = opens a service pop-up
// goTab                = switches the Hero tab and scrolls to the top
export default function Header({ emirate, setEmirate, openService, goTab }) {
  // is the phone menu open? (true = open)
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.bar}`}>

        {/* LOGO (click to go back to the top) */}
        <a href="#top" onClick={closeMobileMenu}><Logo /></a>

        {/* DESKTOP MENU: appears on large screens, hidden on phones */}
        <nav className={styles.nav} aria-label="Main">

          {/* Services: hover to see the list of services */}
          <div className={styles.dropdown}>
            <a href="#services">Services <Icon name="down" size={14} sw={2.6} /></a>
            <div className={styles.dropdownMenu}>
              {services.map((service) => (
                <button key={service.id} onClick={() => openService(service.id)}>{service.title}</button>
              ))}
            </div>
          </div>

          {/* Garages: hover for two choices */}
          <div className={styles.dropdown}>
            <a href="#garages">Garages <Icon name="down" size={14} sw={2.6} /></a>
            <div className={styles.dropdownMenu}>
              <a href="#garages">Featured Garages</a>
              <button onClick={() => goTab("garage")}>Find a Garage</button>
            </div>
          </div>

          <button onClick={() => goTab("quote")}>Compare Quotes</button>
          <a href="#how">About</a>

          {/* Support: hover for two choices */}
          <div className={styles.dropdown}>
            <a href="#enquiry">Support <Icon name="down" size={14} sw={2.6} /></a>
            <div className={styles.dropdownMenu}>
              <a href="#enquiry">Enquiry &amp; Contact</a>
              <a href="#how">How It Works</a>
            </div>
          </div>
        </nav>

        {/* RIGHT SIDE: location, user icon, My Account, and the ☰ button for phones */}
        <div className={styles.right}>
          <Dropdown
            variant="mini"
            icon="pin"
            value={emirate}
            onChange={setEmirate}
            options={emirates}
            format={(e) => `${e}, UAE`}
            label="Location"
          />
          <span className={styles.divider} />
          <a href="#enquiry" className={styles.userIcon} aria-label="Account"><Icon name="user" size={22} /></a>
          <a href="#enquiry" className={styles.accountButton}>My Account <Icon name="down" size={12} sw={2.6} /></a>

          <button className={styles.burger} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <Icon name={mobileOpen ? "close" : "menu"} size={26} />
          </button>
        </div>
      </div>

      {/* PHONE MENU: shown only after tapping ☰ */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <a href="#services" onClick={closeMobileMenu}>Services</a>
          <a href="#garages" onClick={closeMobileMenu}>Garages</a>
          <button onClick={() => { goTab("quote"); closeMobileMenu(); }}>Compare Quotes</button>
          <a href="#how" onClick={closeMobileMenu}>About</a>
          <a href="#enquiry" onClick={closeMobileMenu}>Support</a>
          <a href="#enquiry" onClick={closeMobileMenu} className="btn">My Account</a>
        </div>
      )}
    </header>
  );
}