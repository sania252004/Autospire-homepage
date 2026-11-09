import Icon from "@/components/Icon/Icon";
import { sidebarLinks, premiumBox } from "@/lib/myVehiclesData";
import styles from "./DashboardSidebar.module.css";

// activePage = the name of the menu item to highlight (for example "My Vehicles")
export default function DashboardSidebar({ activePage }) {
  return (
    <aside className={styles.sidebar}>

      {/* THE MENU ITEMS */}
      <nav className={styles.menu}>
        {sidebarLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`${styles.item} ${link.label === activePage ? styles.active : ""}`}
          >
            <Icon name={link.icon} size={26} sw={1.5} />
            <span>{link.label}</span>
            {link.badge && <span className={styles.badge}>{link.badge}</span>}
          </a>
        ))}
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