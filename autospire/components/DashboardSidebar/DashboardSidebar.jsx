"use client";
import Icon from "@/components/Icon/Icon";
import { sidebarLinks, premiumBox } from "@/lib/myVehiclesData";
import { useUnreadCount } from "@/lib/notificationStore";
import styles from "./DashboardSidebar.module.css";

// activePage = the name of the menu item to highlight (for example "My Vehicles")
export default function DashboardSidebar({ activePage }) {
  // the red number on "Notifications" is the real unread count
  const unread = useUnreadCount();

  return (
    <aside className={styles.sidebar}>

      {/* THE MENU ITEMS */}
      <nav className={styles.menu}>
        {sidebarLinks.map((link) => {
          const badge = link.label === "Notifications" ? unread : link.badge;
          return (
            <a
              key={link.label}
              href={link.href}
              className={`${styles.item} ${link.label === activePage ? styles.active : ""}`}
            >
              <Icon name={link.icon} size={26} sw={1.5} />
              <span className={styles.label}>{link.label}</span>
              {badge > 0 && <span className={styles.badge}>{badge}</span>}
            </a>
          );
        })}
      </nav>

      {/* "GO PREMIUM" BOX */}
      <div className={styles.premium}>
        <Icon name="crown" size={34} sw={1.5} />
        <b>{premiumBox.title}</b>
        <p>{premiumBox.text}</p>
        <button className={styles.premiumButton}>{premiumBox.button}</button>
      </div>

    </aside>
  );
}