/* ---------- 1. CONTACT DETAILS ---------- */
export const BRAND = "Autospire";           // name next to the logo
export const PHONE = "+971 4 000 0000";     // phone number shown on the page
export const TEL = "tel:+97140000000";      // same number, no spaces (used when someone taps to call)
export const EMAIL = "hello@autospire.ae";
export const ADDRESS = "Dubai, United Arab Emirates";

// opening hours shown in the Enquiry section
export const HOURS = [
  { days: "Monday – Friday",          time: "8:00am – 8:00pm" },
  { days: "Saturday",                 time: "9:00am – 6:00pm" },
  { days: "Sunday / Public Holidays", time: "Requests via the app" },
];

/* ---------- 2. LISTS FOR THE DROPDOWNS ---------- */
export const emirates = ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];
export const vehicles = ["Toyota", "Nissan", "Honda", "Hyundai", "Kia", "Ford", "Chevrolet", "Mitsubishi", "Mazda", "Lexus", "BMW", "Mercedes-Benz", "Audi", "Land Rover", "Porsche", "Other"];

/* ---------- 3. SERVICES ----------
   id     = a short unique name (don't use spaces)
   title  = the name shown on the card
   icon   = which icon to show (names are in components/Icon/Icon.jsx)
   long   = the description in the pop-up
   points = the ticked list in the pop-up */
export const services = [
  {
    id: "general", title: "General Servicing", icon: "servicing",
    long: "Keep your car running right with transparent, itemised servicing quotes from trade-licensed UAE garages. Compare up to five offers by price, warranty and rating, then book the garage visit, mobile van or valet pickup that suits you. Packages from AED 299.",
    points: ["Minor and major services", "Oil and filter changes", "Scheduled logbook servicing", "Itemised OEM and aftermarket parts"],
  },
  {
    id: "mechanical", title: "Mechanical Repair", icon: "repairs",
    long: "Bigger jobs need clearer answers. Describe the symptoms, attach photos or video, and verified workshops send detailed parts and labour quotations so you can choose with confidence. Every repair is priced as a custom quote.",
    points: ["Engine rebuild", "Transmission", "Suspension", "Cooling and exhaust"],
  },
  {
    id: "brakes", title: "Brake Service", icon: "brakes",
    long: "Stay safe on the road with quick, reliable brake care. From pad replacement and disc skimming to brake fluid changes and caliper repair, our providers cover all major brands. Brake work from AED 190.",
    points: ["Pad replacement", "Disc skimming", "Brake fluid change", "Caliper repair"],
  },
  {
    id: "tyres", title: "Tyres & Alignment", icon: "tyres",
    long: "Mobile tyre vans come to your location to fit and balance new tyres, repair punctures and set up laser wheel alignment, so you are back on the road without a workshop visit.",
    points: ["Mobile tyre van and fitting", "Wheel balancing", "Laser alignment", "Puncture repair"],
  },
  {
    id: "diagnostics", title: "Diagnostics & Electrical", icon: "diagnostics",
    long: "Warning light on? Providers run full diagnostics and send you a comprehensive report, so you know exactly what is wrong before approving any work. Ideal before buying a used car, too.",
    points: ["OBD-II scan", "Check engine light", "Sensor faults", "Pre-purchase check"],
  },
  {
    id: "battery", title: "Battery Service", icon: "battery",
    long: "Dead battery in the UAE heat? Mobile technicians arrive within about 30 minutes to test, jump-start or replace your battery on site, any time of day, with an 18-month warranty.",
    points: ["On-site battery testing", "24/7 jump-start", "Mobile battery replacement", "18-month warranty"],
  },
  {
    id: "ac", title: "AC & Climate Control", icon: "ac",
    long: "Weak air-con in the summer heat? AC specialists restore cold air fast with gas refills, leak testing and compressor repair, plus cabin deodorising for a fresher drive. AC services from AED 150.",
    points: ["AC gas refill", "Leak testing", "Compressor repair", "Cabin deodorising"],
  },
  {
    id: "body", title: "Body & Paint", icon: "body",
    long: "Restore your car's finish with smart dent repair, scratch touch-up, bumper respray and oven-baked paintwork, with help on accident claims from start to finish.",
    points: ["Smart dent repair", "Scratch touch-up", "Bumper respray", "Accident claim support"],
  },
  {
    id: "rta", title: "RTA Pre-Inspection", icon: "rta",
    long: "Get your car ready for its RTA test. Provider-led pre-checks catch defects early and rectify them, and your car is escorted through the testing bay with pickup and delivery available.",
    points: ["RTA pre-check checklist", "Defect rectification", "Testing bay escort", "Pickup and delivery"],
  },
];

/* ---------- 4. GARAGES (SAMPLES: replace with real listings) ----------
   id      = number. The photo is public/images/garage-<id>.jpg
   name    = garage name
   rating  = stars, e.g. 4.8
   reviews = number of reviews, written as text, e.g. "2.4k"
   area    = neighbourhood shown on the card
   emirate = which emirate it is in
   from    = starting price in AED
   address, hours, about, offers = shown in the pop-up */
export const garages = [
  { id: 1, name: "AutoPro Garage", rating: 4.8, reviews: "2.4k", area: "Dubai Marina", emirate: "Dubai", from: 199,
    address: "Dubai Marina, Dubai", hours: "Open daily, 8am to 8pm",
    about: "Full-service workshop covering routine servicing, brakes, AC and diagnostics for all major brands, with itemised quotes and a written warranty.",
    offers: ["General Servicing", "Brake Service", "AC & Climate Control", "Diagnostics & Electrical"] },
  { id: 2, name: "Elite Auto Care", rating: 4.7, reviews: "1.8k", area: "Al Quoz", emirate: "Dubai", from: 179,
    address: "Al Quoz Industrial Area, Dubai", hours: "Open Mon to Sat, 8am to 7pm",
    about: "Trade-licensed Al Quoz workshop known for fast turnaround on mechanical repairs, tyres and pre-purchase checks.",
    offers: ["Mechanical Repair", "Tyres & Alignment", "Diagnostics & Electrical", "General Servicing"] },
  { id: 3, name: "SpeedFit Garage", rating: 4.8, reviews: "1.1k", area: "Business Bay", emirate: "Dubai", from: 189,
    address: "Business Bay, Dubai", hours: "Open daily, 9am to 8pm",
    about: "Mobile and in-garage service with doorstep pickup and delivery, specialising in batteries, tyres and quick servicing.",
    offers: ["Battery Service", "Tyres & Alignment", "General Servicing", "RTA Pre-Inspection"] },
  { id: 4, name: "Prime Motors Workshop", rating: 4.6, reviews: "980", area: "Industrial Area", emirate: "Sharjah", from: 169,
    address: "Industrial Area, Sharjah", hours: "Open Mon to Sat, 8am to 7pm",
    about: "Experienced Sharjah workshop for engine, transmission and suspension work, with photo updates during every job.",
    offers: ["Mechanical Repair", "Brake Service", "Body & Paint", "General Servicing"] },
  { id: 5, name: "Gulf Wheels Service", rating: 4.9, reviews: "3.1k", area: "Mussafah", emirate: "Abu Dhabi", from: 209,
    address: "Mussafah, Abu Dhabi", hours: "Open daily, 8am to 9pm",
    about: "Large Abu Dhabi service centre with RTA test preparation, bodywork and paint, and certified technicians.",
    offers: ["RTA Pre-Inspection", "Body & Paint", "AC & Climate Control", "Mechanical Repair"] },
  { id: 6, name: "Crown Auto Works", rating: 4.7, reviews: "760", area: "Al Jurf", emirate: "Ajman", from: 159,
    address: "Al Jurf, Ajman", hours: "Open Mon to Sat, 8am to 6pm",
    about: "Friendly Ajman garage offering affordable servicing, brakes and battery replacement with clear upfront pricing.",
    offers: ["General Servicing", "Brake Service", "Battery Service", "Tyres & Alignment"] },
];

/* ---------- 5. REVIEWS (SAMPLES: replace with real customer reviews) ---------- */
export const reviews = [
  { name: "Ahmed K.",  text: "Autospire makes it so easy to compare garages and book car services. Highly recommended!" },
  { name: "Fatima R.", text: "Got three quotes within an hour and saved nearly 30% on my brake job. The photo updates were a great touch." },
  { name: "Rahul M.",  text: "Battery died at my office in Business Bay. A mobile technician arrived in 25 minutes. Brilliant service." },
  { name: "Sarah L.",  text: "Clear fixed prices and no surprises at the end. I booked my annual service in under two minutes." },
  { name: "Omar A.",   text: "The RTA pre-inspection saved me a failed test. They fixed everything and took the car through for me." },
  { name: "Priya S.",  text: "I love having my whole service history in one place. Easy to compare garages and trust the reviews." },
];

/* ---------- 6. HOW IT WORKS: the 4 steps ----------
   icon  = icon name
   line1 = first line of text under the circle
   line2 = second line (leave "" for just one line) */
export const steps = [
  { icon: "car",      line1: "Choose Your Vehicle",   line2: "or Request a Quote" },
  { icon: "scale",    line1: "Compare Garages",       line2: "& Prices" },
  { icon: "calendar", line1: "Book Your Appointment", line2: "" },
  { icon: "check",    line1: "Track & Manage",        line2: "Your Service" },
];