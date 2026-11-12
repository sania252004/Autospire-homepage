/* Small helper functions used by the My Vehicles page. You don't need to edit this file. */

export const BODY_TYPES = { suv: "SUV", sedan: "Sedan", hatchback: "Hatchback", pickup: "Pickup" };

export const km = (n) => `${Number(n).toLocaleString("en-US")} km`;
export const money = (n) => `AED ${Number(n).toLocaleString("en-US")}`;
export const todayISO = () => new Date().toISOString().slice(0, 10);

/* days from today until a date written like "2026-12-15" (negative = already passed) */
export function daysUntil(iso) {
  const t = new Date();
  const today = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - today) / 86400000);
}

export const fmtDate = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

export function daysLabel(n) {
  if (n < 0) return `${-n} day${n === -1 ? "" : "s"} overdue`;
  if (n === 0) return "Today";
  return `In ${n} day${n === 1 ? "" : "s"}`;
}

/* ok = fine, warn = due within 30 days, bad = already overdue */
export const levelOfDays = (n) => (n < 0 ? "bad" : n <= 30 ? "warn" : "ok");

/* ---------- ALL REMINDERS FOR ONE VEHICLE ----------
   service by mileage: warns 1,000 km before it is due
   insurance and registration: warn 30 days before they expire */
export function remindersOf(v) {
  const list = [];

  const nextKm = v.lastServiceKm + v.intervalKm;
  const kmLeft = nextKm - v.mileage;
  list.push({
    key: "km", icon: "servicing", title: "Service by mileage",
    detail: `Due at ${km(nextKm)} · now ${km(v.mileage)}`,
    pill: kmLeft >= 0 ? `${km(kmLeft)} left` : `${km(-kmLeft)} overdue`,
    level: kmLeft < 0 ? "bad" : kmLeft <= 1000 ? "warn" : "ok",
    action: "book",
  });

  if (v.nextService) {
    const d = daysUntil(v.nextService.date);
    list.push({
      key: "date", icon: "calendar", title: "Booked service",
      detail: `${v.nextService.title} · ${v.nextService.garage} · ${fmtDate(v.nextService.date)}`,
      pill: daysLabel(d), level: d < 0 ? "bad" : d <= 3 ? "warn" : "ok", action: "book",
    });
  }

  if (v.insuranceExpiry) {
    const d = daysUntil(v.insuranceExpiry);
    list.push({
      key: "insurance", icon: "rta", title: "Insurance expiry",
      detail: `Expires ${fmtDate(v.insuranceExpiry)}`,
      pill: daysLabel(d), level: levelOfDays(d), action: "renew", field: "insuranceExpiry",
    });
  }

  if (v.registrationExpiry) {
    const d = daysUntil(v.registrationExpiry);
    list.push({
      key: "registration", icon: "document", title: "Registration & RTA renewal",
      detail: `Expires ${fmtDate(v.registrationExpiry)}`,
      pill: daysLabel(d), level: levelOfDays(d), action: "renew", field: "registrationExpiry",
    });
  }

  return list;
}

export const attentionCount = (v) => remindersOf(v).filter((r) => r.level !== "ok").length;

/* ---------- COMPLETE MAINTENANCE TIMELINE (newest first) ---------- */
export function timelineOf(v) {
  const items = [];
  v.services.forEach((s, i) => items.push({ id: `s${i}`, type: "service", date: s.date, title: s.title, sub: `${s.garage} · ${km(s.km)}`, price: s.price }));
  v.tyres.forEach((t, i) => items.push({ id: `t${i}`, type: "tyres", date: t.date, title: "Tyre replacement", sub: `${t.detail} · ${t.garage}`, price: t.price }));
  v.batteries.forEach((b, i) => items.push({ id: `b${i}`, type: "battery", date: b.date, title: "Battery replacement", sub: `${b.detail} · ${b.garage}`, price: b.price }));
  v.inspections.forEach((x, i) => items.push({ id: `i${i}`, type: "inspection", date: x.date, title: x.title, sub: `${x.garage} · ${x.result}` }));
  v.mileageLog.forEach((m, i) => items.push({ id: `m${i}`, type: "mileage", date: m.date, title: `Mileage updated to ${km(m.km)}`, sub: "" }));
  if (v.nextService) items.push({ id: "up", type: "upcoming", date: v.nextService.date, title: v.nextService.title, sub: `${v.nextService.garage} · ${v.nextService.area}` });
  return items.sort((a, b) => b.date.localeCompare(a.date));
}