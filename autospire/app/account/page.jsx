import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import Account from "@/components/Account/Account";

export const metadata = { title: "My Account — Autospire" };

export default function AccountPage() {
  return (
    <DashboardLayout activePage="Profile & Settings">
      <Account />
    </DashboardLayout>
  );
}