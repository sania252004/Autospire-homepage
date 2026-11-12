/* ---------- SAMPLE QUOTES (replace with real garage replies from your backend later) ----------
   garageId = matches the id in lib/data.js "garages"
   parts, labour = AED
   extras    = other charges (collection, shop supplies...). Use [] for none.
   validHours = how long the quote stays valid after it arrives
   VAT (5%) and the total are calculated by the page, so don't type them here. */
export const VAT_RATE = 0.05;

export const sampleQuotes = [
  { garageId: 1, parts: 780, labour: 420, extras: [],
    warranty: "12 months", turnaround: "2 hours", available: "Today", validHours: 48 },
  { garageId: 3, parts: 820, labour: 450, extras: [{ label: "Pickup & delivery", amount: 50 }],
    warranty: "12 months", turnaround: "2–3 hours", available: "Today", validHours: 24 },
  { garageId: 2, parts: 750, labour: 480, extras: [{ label: "Shop supplies", amount: 30 }],
    warranty: "6 months", turnaround: "3 hours", available: "Tomorrow", validHours: 36 },
];

export const money = (n) => `AED ${n.toLocaleString()}`;

export function priceOf(q) {
  const extras = q.extras.reduce((sum, e) => sum + e.amount, 0);
  const subtotal = q.parts + q.labour + extras;
  const vat = Math.round(subtotal * VAT_RATE);
  return { extras, subtotal, vat, total: subtotal + vat };
}

/* the 5 stages shown while a job is being done */
export const trackSteps = [
  "Booking confirmed",
  "Vehicle collected",
  "Being serviced",
  "Ready for delivery",
  "Completed",
];