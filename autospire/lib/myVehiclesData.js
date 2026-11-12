/* ---------- THE LOGGED-IN USER (top right of the header) ---------- */
export const user = {
  initials: "AA",
  unreadNotifications: 2,
};

export const accountLinks = [
  { label: "My Vehicles", href: "/my-vehicles" },
];

/* ---------- LEFT MENU ---------- */
export const sidebarLinks = [
  { label: "Home",               icon: "home",     href: "/" },
  { label: "My Vehicles",        icon: "car",      href: "/my-vehicles" },
  { label: "My Bookings",        icon: "calendar", href: "/my-bookings" },
  { label: "My Quotes",          icon: "document", href: "/my-quotes" },
  { label: "My Garage",          icon: "garage",   href: "#" },
  { label: "Notifications",      icon: "bell",     href: "#", badge: 2 },
  { label: "Profile & Settings", icon: "user",     href: "#" },
  { label: "Help & Support",     icon: "headset",  href: "#" },
];

export const premiumBox = {
  title: "Go Premium",
  text: "Get exclusive benefits and priority support.",
  button: "Upgrade Now",
};

/* ---------- BANNER AT THE TOP OF THE PAGE ---------- */
export const pageBanner = {
  title: "My Vehicles",
  line1: "Manage your vehicles, view service history",
  line2: "and stay on top of maintenance.",
  image: "/images/vehicles-banner.jpg",
};

/* ---------- QUICK BUTTONS ON THE VEHICLE CARD ---------- */
export const quickActions = [
  { label: "Book a Service",       icon: "servicing", href: "/#top" },
  { label: "Request a Quote",      icon: "chat",      href: "/#top" },
  { label: "View Service History", icon: "calendar",  href: "#dashboard-tabs" },
  { label: "Find a Garage",        icon: "car",       href: "/#garages" },
];

/* ---------- THE TABS (id must match the ones used in MyVehicles.jsx) ---------- */
export const tabs = [
  { id: "timeline",  label: "Timeline",         icon: "clock" },
  { id: "service",   label: "Service History",  icon: "servicing" },
  { id: "tyres",     label: "Tyres & Battery",  icon: "tyres" },
  { id: "documents", label: "Documents",        icon: "document" },
  { id: "reminders", label: "Reminders",        icon: "bell" },
];

/* ---------- "GOOD HANDS" BANNER ---------- */
export const goodHands = {
  title: "Your vehicle is in good hands",
  text: "With verified garages and trusted services across the UAE.",
};

/* ---------- SAMPLE VEHICLES (replace with the customer's real data from your database later) ----------
   Dates are written year-month-day, e.g. "2026-12-15".
   type      = "suv" | "sedan" | "hatchback" | "pickup" (used for the preset picture)
   photo     = path to a picture, or "" to show the preset for its type
   intervalKm = service every this many km; lastServiceKm = odometer at the last service
   documents.category = "Registration" | "Insurance" | "Inspection report" | "Invoice" | "Other" */
export const initialVehicles = [
  {
    id: 1, make: "Mercedes-Benz", model: "GLC", year: 2023, type: "suv", city: "Dubai",
    reg: "Dubai • 12345", photo: "/images/glc.png", primary: true,
    mileage: 24300, lastServiceKm: 18000, intervalKm: 10000,
    insuranceExpiry: "2027-02-20", registrationExpiry: "2027-01-14",
    nextService: { date: "2026-12-15", title: "Major Service", garage: "AutoPro Garage", area: "Dubai Marina" },
    mileageLog: [
      { date: "2025-06-15", km: 18000 },
      { date: "2026-03-02", km: 21800 },
      { date: "2026-10-28", km: 24300 },
    ],
    services: [
      { id: 1, date: "2025-06-15", title: "Full Service & Oil Change", garage: "AutoPro Garage",   km: 18000, price: 650, invoice: true, report: true },
      { id: 2, date: "2025-01-12", title: "Brake Service",             garage: "SpeedFit Garage",  km: 14200, price: 480, invoice: true },
      { id: 3, date: "2024-07-20", title: "AC Service",                garage: "DriveWell Garage", km: 9800,  price: 420, invoice: true },
    ],
    tyres: [
      { id: 1, date: "2025-09-10", detail: "4 × Michelin Latitude Sport 3 (235/60 R18)", garage: "Elite Auto Care", km: 19400, price: 1850, warranty: "Road hazard 12 months" },
    ],
    batteries: [
      { id: 1, date: "2025-03-18", detail: "Varta Silver 80Ah AGM", garage: "SpeedFit Garage", km: 16100, price: 720, warranty: "18 months" },
    ],
    inspections: [
      { id: 1, date: "2025-06-15", title: "Pre-service inspection report", garage: "AutoPro Garage",      result: "Passed, 2 advisories" },
      { id: 2, date: "2026-01-08", title: "RTA pre-inspection",            garage: "Gulf Wheels Service", result: "Passed" },
    ],
    documents: [
      { id: 1, category: "Registration",      name: "Registration card (Mulkiya)",     size: 180, date: "2025-01-10", url: "" },
      { id: 2, category: "Insurance",         name: "Comprehensive insurance policy",  size: 420, date: "2026-02-21", url: "" },
      { id: 3, category: "Inspection report", name: "RTA pre-inspection report",       size: 260, date: "2026-01-08", url: "" },
      { id: 4, category: "Invoice",           name: "Invoice: AutoPro Garage, 15 Jun 2025", size: 95, date: "2025-06-15", url: "" },
    ],
  },
  {
    id: 2, make: "Toyota", model: "Land Cruiser", year: 2020, type: "suv", city: "Dubai",
    reg: "Dubai • A 67890", photo: "", primary: false,
    mileage: 79400, lastServiceKm: 70000, intervalKm: 10000,
    insuranceExpiry: "2026-11-08", registrationExpiry: "2026-12-02",
    nextService: null,
    mileageLog: [
      { date: "2025-11-20", km: 70000 },
      { date: "2026-11-01", km: 79400 },
    ],
    services: [
      { id: 1, date: "2025-11-20", title: "Full Service & Oil Change", garage: "Elite Auto Care", km: 70000, price: 720, invoice: true },
    ],
    tyres: [],
    batteries: [
      { id: 1, date: "2024-12-02", detail: "Bosch S5 100Ah", garage: "SpeedFit Garage", km: 56000, price: 690, warranty: "24 months" },
    ],
    inspections: [],
    documents: [
      { id: 1, category: "Registration", name: "Registration card (Mulkiya)", size: 150, date: "2025-12-03", url: "" },
    ],
  },
];