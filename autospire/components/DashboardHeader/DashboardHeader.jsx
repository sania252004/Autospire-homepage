"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Icon from "@/components/Icon/Icon";
import Logo from "@/components/Logo/Logo";
import Dropdown from "@/components/Dropdown/Dropdown";
import { services, emirates } from "@/lib/data";
import { accountLinks } from "@/lib/myVehiclesData";
import { account as accountData } from "@/lib/accountData";
import { useUnreadCount } from "@/lib/notificationStore";
import {
  useAuth,
  logout,
  getName,
  getFirstName,
  getInitials,
  getContact,
  rememberName
} from "@/lib/authStore";
import styles from "./DashboardHeader.module.css";

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname(); // the page we are on, e.g. "/account"

  // which menu is open: "services", "garages", "account", or null (none)
  const [openMenu, setOpenMenu] = useState(null);

  // the chosen location (only changes this top bar for now)
  const [emirate, setEmirate] = useState("Dubai");

  // the real number of unread notifications
  const unread = useUnreadCount();

  // the logged-in customer (null when logged out)
  const { user: account } = useAuth();
  const name = getName(account); // "Sania Khandakar"
  const firstName = getFirstName(account); // "Sania"
  const initials = getInitials(account); // "SK"
  const contact = getContact(account); // email or mobile number

  // the demo login does not ask for a name, so use the name from lib/accountData.js.
  // When you connect a real backend, the name will come with the login and you can delete this.
  useEffect(() => {
    if (account && !name) rememberName(accountData.profile.fullName);
  }, [account, name]);

  // the avatar menu without the page we are already on
  const menuLinks = accountLinks.filter((link) => link.href !== pathname);

  function toggleMenu(menuName) {
    setOpenMenu(openMenu === menuName ? null : menuName);
  }
  function closeMenu() {
    setOpenMenu(null);
  }
  function handleLogout() {
    closeMenu();
    logout();
    router.push("/");
  }

  return (
    <header className={styles.header}>
      {/* LOGO (click to go to the homepage) */}
      <a href="/" className={styles.logo}>
        <Logo size={44} />
      </a>

      {/* MENU (hidden on phones) */}
      <nav className={styles.nav}>
        {/* Services menu */}
        <div className={styles.menuWrap} onMouseLeave={closeMenu}>
          <button
            className={styles.menuButton}
            onClick={() => toggleMenu("services")}
          >
            Services <Icon name="down" size={14} sw={2.6} />
          </button>
          {openMenu === "services" && (
            <div className={styles.menu}>
              {services.map((service) => (
                <a key={service.id} href="/#services" onClick={closeMenu}>
                  {service.title}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Garages menu */}
        <div className={styles.menuWrap} onMouseLeave={closeMenu}>
          <button
            className={styles.menuButton}
            onClick={() => toggleMenu("garages")}
          >
            Garages <Icon name="down" size={14} sw={2.6} />
          </button>
          {openMenu === "garages" && (
            <div className={styles.menu}>
              <a href="/#garages" onClick={closeMenu}>
                Featured Garages
              </a>
              <a href="/#top" onClick={closeMenu}>
                Find a Garage
              </a>
            </div>
          )}
        </div>

        <a href="/#how" className={styles.menuLink}>
          About
        </a>
      </nav>

      {/* RIGHT SIDE */}
      <div className={styles.right}>
        {/* location: click to choose an emirate */}
        <Dropdown
          variant="pill"
          icon="pin"
          value={emirate}
          onChange={setEmirate}
          options={emirates}
          label="Location"
        />

        {/* search */}
        <button className={styles.iconButton} aria-label="Search">
          <Icon name="search" size={22} sw={1.8} />
        </button>

        {/* notifications: opens the Notifications page. The red number only shows when something is unread. */}
        <a
          href="/notifications"
          className={styles.iconButton}
          aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
        >
          <Icon name="bell" size={22} sw={1.8} />
          {unread > 0 && <span className={styles.badge}>{unread}</span>}
        </a>

        {/* avatar: click to open the account menu */}
        <div className={styles.menuWrap} onMouseLeave={closeMenu}>
          <button
            className={styles.avatarButton}
            onClick={() => toggleMenu("account")}
            aria-label="Account menu"
          >
            {/* initials, or a person icon if we do not know the name */}
            <span className={styles.avatar}>
              {initials ? initials : <Icon name="user" size={20} sw={1.8} />}
            </span>

            <Icon name="down" size={13} sw={2.6} />
          </button>
          {openMenu === "account" && (
            <div className={`${styles.menu} ${styles.menuRight}`}>
              {/* name and email / mobile at the top of the menu (only when we know them) */}
              {name ? (
                <div className={styles.menuUser}>
                  <b>{name}</b>
                  {contact ? <small>{contact}</small> : null}
                </div>
              ) : null}

              {menuLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              ))}

              {account ? (
                <button type="button" onClick={handleLogout}>
                  Log out
                </button>
              ) : (
                <a href="/login" onClick={closeMenu}>
                  Log in
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}