import { Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import MyQuotes from "@/components/MyQuotes/MyQuotes";

export const metadata = { title: "My Quotes — Autospire" };

export default function MyQuotesPage() {
  return (
    <DashboardLayout activePage="My Quotes">
      <Suspense fallback={null}>
        <MyQuotes />
      </Suspense>
    </DashboardLayout>
  );
}