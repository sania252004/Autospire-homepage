import { bookings as sampleBookings } from "@/lib/myBookingsData";

/* Saves bookings in the browser (localStorage). A real backend replaces this later.
   The first time, the sample bookings are loaded so the page is not empty. */
const KEY = "autospire.bookings.v1";

export function loadBookings() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return sampleBookings;
}

export function saveBookings(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

export function addBooking(booking) {
  saveBookings([booking, ...loadBookings()]);
}

export function resetBookings() {
  try { localStorage.removeItem(KEY); } catch {}
}

export const newBookingId = () => "AS-" + Math.floor(1000 + Math.random() * 9000);