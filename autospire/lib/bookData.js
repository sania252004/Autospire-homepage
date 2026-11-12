/* ---------- FIXED PRICES (AED, before VAT) ----------
   Each garage's price = this base + how far its "from" price is above 189,
   so garages differ a little. Services not listed here are quote-only. */
export const fixedPrices = {
  "General Servicing": 299,
  "Brake Service": 190,
  "Tyres & Alignment": 220,
  "Diagnostics & Electrical": 150,
  "Battery Service": 350,
  "AC & Climate Control": 150,
  "RTA Pre-Inspection": 250,
};

export const hasFixedPrice = (service) => fixedPrices[service] != null;

export function priceFor(garage, service) {
  const base = fixedPrices[service];
  if (base == null) return null;
  return Math.max(50, base + (garage.from - 189));
}

export const COLLECTION_FEE = 50;   // AED, only if the customer chooses pickup & drop-off
export const VAT = 0.05;

/* time slots offered each day */
export const TIMES = [
  { label: "9:00 AM",  hour: 9 },
  { label: "11:00 AM", hour: 11 },
  { label: "2:00 PM",  hour: 14 },
  { label: "4:00 PM",  hour: 16 },
  { label: "6:00 PM",  hour: 18 },
];

export const garagePhone = (g) => `+97140000${String(g.id).padStart(3, "0")}`;