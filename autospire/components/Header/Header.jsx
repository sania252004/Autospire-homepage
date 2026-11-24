"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Logo from "@/components/Logo/Logo";
import Dropdown from "@/components/Dropdown/Dropdown";
import LoginModal from "@/components/LoginModal/LoginModal";
import { services, emirates } from "@/lib/data";
import styles from "./Header.module.css";
import { useAuth, logout, getFirstName } from "@/lib/authStore";

export default function Header({ emirate, setEmirate, openService, goTab }) {
  const { user } = useAuth();

  // Mobile menu: open or closed
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);

  // Account dropdown: open or closed
  const [accountOpen, setAccountOpen] = useState(false);
  const closeAccount = () => setAccountOpen(false);

  // Login pop-up: open or closed
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.bar}`}>

        {/* LOGO */}
        <a href="#top" onClick={closeMobileMenu}>
          <Logo />
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav className={styles.nav} aria-label="Main">

          {/* ABOUT */}
          <a href="#how">About</a>

          {/* SERVICES */}
          <div className={styles.dropdown}>
            <a href="#services">
              Services <Icon name="down" size={14} sw={2.6} />
            </a>

            <div className={styles.dropdownMenu}>
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => openService(service.id)}
                >
                  {service.title}
                </button>
              ))}
            </div>
          </div>

          {/* GARAGES */}
          <div className={styles.dropdown}>
            <a href="#garages">
              Garages <Icon name="down" size={14} sw={2.6} />
            </a>

            <div className={styles.dropdownMenu}>
              <a href="#garages">Featured Garages</a>
              <button type="button" onClick={() => goTab("garage")}>
                Find a Garage
              </button>
            </div>
          </div>

          {/* COMPARE QUOTES */}
          <button type="button" onClick={() => goTab("quote")}>
            Compare Quotes
          </button>

          {/* SUPPORT */}
          <div className={styles.dropdown}>
            <a href="#enquiry">
              Support <Icon name="down" size={14} sw={2.6} />
            </a>

            <div className={styles.dropdownMenu}>
              <a href="#enquiry">Enquiry &amp; Contact</a>
              <a href="#how">How It Works</a>
            </div>
          </div>
        </nav>

        {/* RIGHT SIDE */}
        <div className={styles.right}>

          {/* LOCATION */}
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

          {/* USER ICON */}
          {user ? (
            <a href="/my-vehicles" className={styles.userIcon} aria-label="My vehicles">
              <Icon name="user" size={22} />
            </a>
          ) : (
            <button
              type="button"
              className={styles.userIcon}
              onClick={() => setLoginOpen(true)}
              aria-label="Log in"
            >
              <Icon name="user" size={22} />
            </button>
          )}

          {/* LOGGED OUT: Login button opens the pop-up */}
          {!user && (
            <button
              type="button"
              className={styles.accountButton}
              onClick={() => setLoginOpen(true)}
            >
              Login
            </button>
          )}

          {/* LOGGED IN: first name with a dropdown menu */}
          {user && (
            <div className={styles.account} onMouseLeave={closeAccount}>
              <button
                type="button"
                className={styles.accountButton}
                onClick={() => setAccountOpen((prev) => !prev)}
                aria-expanded={accountOpen}
                aria-haspopup="true"
              >
                {getFirstName(user) || "My Account"}
                <Icon name="down" size={12} sw={2.6} />
              </button>

              <div className={`${styles.accountMenu} ${accountOpen ? styles.open : ""}`}>
                <a href="/my-vehicles" onClick={closeAccount}>My Vehicles</a>
                <a href="/my-bookings" onClick={closeAccount}>My Bookings</a>
                <a href="/account" onClick={closeAccount}>Profile & Settings</a>

                <button
                  type="button"
                  onClick={() => {
                    closeAccount();
                    logout();
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className={styles.burger}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={26} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <a href="#services" onClick={closeMobileMenu}>Services</a>
          <a href="#garages" onClick={closeMobileMenu}>Garages</a>

          <button
            type="button"
            onClick={() => {
              goTab("quote");
              closeMobileMenu();
            }}
          >
            Compare Quotes
          </button>

          <a href="#how" onClick={closeMobileMenu}>About</a>
          <a href="#enquiry" onClick={closeMobileMenu}>Support</a>

          {user ? (
            <>
              <a href="/my-vehicles" onClick={closeMobileMenu} className="btn">My Vehicles</a>
              <a href="/my-bookings" onClick={closeMobileMenu}>My Bookings</a>
              <a href="/account" onClick={closeMobileMenu}>Profile & Settings</a>

              <button
                type="button"
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  closeMobileMenu();
                  setLoginOpen(true);
                }}
              >
                Log in
              </button>

              <a href="/register" onClick={closeMobileMenu}>Create account</a>
            </>
          )}
        </div>
      )}

      {/* LOGIN POP-UP (shows only when loginOpen is true) */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}