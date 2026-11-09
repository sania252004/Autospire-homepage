import DashboardHeader from "@/components/DashboardHeader/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar/DashboardSidebar";
import styles from "./DashboardLayout.module.css";

// activePage = the name of the left-menu item to highlight
// children   = the page content
export default function DashboardLayout({ activePage, children }) {
  return (
    <div className={styles.layout}>
      <DashboardHeader />

      <div className={styles.body}>
        <DashboardSidebar activePage={activePage} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}