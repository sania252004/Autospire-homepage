/* ---------- THE LOGGED-IN USER (top right of the header) ---------- */
export const user = {
  initials: "AA",            // letters shown in the round avatar
  unreadNotifications: 2,    // red number on the bell (use 0 to hide it)
};

/* ---------- ACCOUNT MENU (opens from "My Account" and from the avatar) ----------
   To add another page later, add one more line like:
   { label: "My Bookings", href: "/my-bookings" }, */
export const accountLinks = [
  { label: "My Vehicles", href: "/my-vehicles" },
];

/* ---------- LEFT MENU ----------
   label = text, icon = icon name (see components/Icon/Icon.jsx),
   href  = where it goes ("#" = page not built yet),
   badge = optional red number */
export const sidebarLinks = [
  { label: "Home",               icon: "home",     href: "/" },
  { label: "My Vehicles",        icon: "car",      href: "/my-vehicles" },
  { label: "My Bookings",        icon: "calendar", href: "#" },
  { label: "My Quotes",          icon: "document", href: "#" },
  { label: "My Garage",          icon: "garage",   href: "#" },
  { label: "Notifications",      icon: "bell",     href: "#", badge: 2 },
  { label: "Profile & Settings", icon: "user",     href: "#" },
  { label: "Help & Support",     icon: "headset",  href: "#" },
];

/* ---------- "GO PREMIUM" BOX (bottom of the left menu) ---------- */
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
  image: "/images/vehicles-banner.jpg",   // skyline picture (shown on the right)
};

/* ---------- THE MAIN VEHICLE CARD ---------- */
export const vehicle = {
  image: "/images/glc.png",                // photo of the car
  badge: "Primary Vehicle",
  name: "Mercedes-Benz GLC",
  details: "2023 • SUV • Dubai",
  registration: "Dubai • 12345",
  nextServiceDate: "15 Dec 2026",
  nextServiceIn: "In 45 days",
};

/* ---------- THE 4 QUICK BUTTONS ON THE RIGHT OF THE VEHICLE CARD ---------- */
export const quickActions = [
  { label: "Book a Service",       icon: "servicing", href: "/#top" },
  { label: "Request a Quote",      icon: "chat",      href: "/#top" },
  { label: "View Service History", icon: "calendar",  href: "#service-history" },
  { label: "Find a Garage",        icon: "car",       href: "/#garages" },
];

/* ---------- THE 4 TABS UNDER THE VEHICLE CARD ---------- */
export const tabs = [
  { label: "Service History",    icon: "servicing" },
  { label: "Upcoming Services",  icon: "calendar" },
  { label: "Vehicle Documents",  icon: "document" },
  { label: "Reminders",          icon: "bell" },
];

/* ---------- SERVICE HISTORY LIST ----------
   logo = the garage logo (small picture) */
export const serviceHistory = [
  { logo: "/images/logo-autopro.png",   title: "Full Service & Oil Change", date: "15 Jun 2025", garage: "AutoPro Garage",   price: "AED 650" },
  { logo: "/images/logo-speedfit.png",  title: "Brake Service",             date: "12 Jan 2025", garage: "SpeedFit Garage",  price: "AED 480" },
  { logo: "/images/logo-drivewell.png", title: "AC Service",                date: "20 Jul 2024", garage: "DriveWell Garage", price: "AED 420" },
];

/* ---------- UPCOMING SERVICE (light blue panel) ---------- */
export const upcomingService = {
  month: "DEC",
  day: "15",
  weekday: "Mon",
  title: "Major Service",
  garage: "At AutoPro Garage",
  area: "Dubai Marina",
  daysLeft: "In 45 days",
  reminderText: "You'll get a reminder 3 days before your service date.",
};

/* ---------- VEHICLE DOCUMENTS CARD ---------- */
export const document = {
  image: "/images/registration-card.jpg",   // small picture of the registration card
  title: "Registration Card",
  validUntil: "Valid until: 14 Jan 2027",
};

/* ---------- QUICK STATS CARD (3 numbers) ----------
   color = colour of the icon */
export const stats = [
  { icon: "car",  value: "2",     label: "Total Bookings",       color: "#0f56a3", fill: "none" },
  { icon: "star", value: "4.8/5", label: "Avg Rating",           color: "#f5a623", fill: "#f5a623" },
  { icon: "rta",  value: "98%",   label: "Service Satisfaction", color: "#0f56a3", fill: "none" },
];

/* ---------- "YOUR VEHICLE IS IN GOOD HANDS" BANNER ---------- */
export const goodHands = {
  title: "Your vehicle is in good hands",
  text: "With verified garages and trusted services across the UAE.",
};