import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import Notifications from "@/components/Notifications/Notifications";

export const metadata = { title: "Notifications — Autospire" };

export default function NotificationsPage() {
  return (
    <DashboardLayout activePage="Notifications">
      <Notifications />
    </DashboardLayout>
  );
}