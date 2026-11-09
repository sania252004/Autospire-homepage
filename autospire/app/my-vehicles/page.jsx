import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import MyVehicles from "@/components/MyVehicles/MyVehicles";

export const metadata = { title: "My Vehicles — Autospire" };

export default function MyVehiclesPage() {
  return (
    <DashboardLayout activePage="My Vehicles">
      <MyVehicles />
    </DashboardLayout>
  );
}