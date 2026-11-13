"use client";
/* ==========================================================
   DASHBOARD TOP BAR
   Logo and menu on the left. Location, search, notifications
   and the user's avatar on the right.

   Click "Services", "Garages" or the avatar to open its menu.
   Click "Dubai" to choose another emirate.
   Move the mouse away to close a menu.

   WHERE TO EDIT:
   - Avatar letters -> lib/myVehiclesData.js ("user")
   - Items in the avatar menu -> lib/myVehiclesData.js ("accountLinks")
   - Service names -> lib/data.js ("services")
   - Colours and sizes -> DashboardHeader.module.css
   ========================================================== */

import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Logo from "@/components/Logo/Logo";
import Dropdown from "@/components/Dropdown/Dropdown";
import { services, emirates } from "@/lib/data";
import { user, accountLinks } from "@/lib/myVehiclesData";
import { useUnreadCount } from "@/lib/notificationStore";
import styles from "./DashboardHeader.module.css";

export default function DashboardHeader() {
  // which menu is open: "services", "garages", "account", or null (none)
  const [openMenu, setOpenMenu] = useState(null);

  // the chosen location (only changes this top bar for now)
  const [emirate, setEmirate] = useState("Dubai");

  // the real number of unread notifications
  const unread = useUnreadCount();

  function toggleMenu(name) {
    setOpenMenu(openMenu === name ? null : name);
  }
  function closeMenu() {
    setOpenMenu(null);
  }

  return (
    <header className={styles.header}>

      {/* LOGO (click to go to the homepage) */}
      <a href="/" className={styles.logo}><Logo size={44} /></a>

      {/* MENU (hidden on phones) */}
      <nav className={styles.nav}>

        {/* Services menu */}
        <div className={styles.menuWrap} onMouseLeave={closeMenu}>
          <button className={styles.menuButton} onClick={() => toggleMenu("services")}>
            Services <Icon name="down" size={14} sw={2.6} />
          </button>
          {openMenu === "services" && (
            <div className={styles.menu}>
              {services.map((service) => (
                <a key={service.id} href="/#services" onClick={closeMenu}>{service.title}</a>
              ))}
            </div>
          )}
        </div>

        {/* Garages menu */}
        <div className={styles.menuWrap} onMouseLeave={closeMenu}>
          <button className={styles.menuButton} onClick={() => toggleMenu("garages")}>
            Garages <Icon name="down" size={14} sw={2.6} />
          </button>
          {openMenu === "garages" && (
            <div className={styles.menu}>
              <a href="/#garages" onClick={closeMenu}>Featured Garages</a>
              <a href="/#top" onClick={closeMenu}>Find a Garage</a>
            </div>
          )}
        </div>

        <a href="/#how" className={styles.menuLink}>About</a>
      </nav>

      {/* RIGHT SIDE */}
      <div className={styles.right}>

        {/* location: click to choose an emirate */}
        <Dropdown variant="pill" icon="pin" value={emirate} onChange={setEmirate} options={emirates} label="Location" />

        {/* search */}
        <button className={styles.iconButton} aria-label="Search">
          <Icon name="search" size={22} sw={1.8} />
        </button>

        {/* notifications: opens the Notifications page. The red number only shows when something is unread. */}
        <a href="/notifications" className={styles.iconButton} aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}>
          <Icon name="bell" size={22} sw={1.8} />
          {unread > 0 && <span className={styles.badge}>{unread}</span>}
        </a>

        {/* avatar: click to open the account menu */}
        <div className={styles.menuWrap} onMouseLeave={closeMenu}>
          <button className={styles.avatarButton} onClick={() => toggleMenu("account")} aria-label="Account menu">
            <span className={styles.avatar}>{user.initials}</span>
            <Icon name="down" size={13} sw={2.6} />
          </button>
          {openMenu === "account" && (
            <div className={`${styles.menu} ${styles.menuRight}`}>
              {accountLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={closeMenu}>{link.label}</a>
              ))}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}