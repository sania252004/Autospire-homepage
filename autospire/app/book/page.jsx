import { Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import BookService from "@/components/BookService/BookService";

export const metadata = { title: "Book a Service — Autospire" };

export default function BookPage() {
  return (
    <DashboardLayout activePage="My Bookings">
      <Suspense fallback={null}>
        <BookService />
      </Suspense>
    </DashboardLayout>
  );
}