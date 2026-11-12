import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import MyBookings from "@/components/MyBookings/MyBookings";

export const metadata = { title: "My Bookings — Autospire" };

export default function MyBookingsPage() {
  return (
    <DashboardLayout activePage="My Bookings">
      <MyBookings />
    </DashboardLayout>
  );
}