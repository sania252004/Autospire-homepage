/* status keys must match the "status" value in each booking below */
export const bookingStatuses = [
  { key: "all",        label: "All" },
  { key: "upcoming",   label: "Upcoming" },
  { key: "pending",    label: "Pending confirmation" },
  { key: "confirmed",  label: "Confirmed" },
  { key: "collection", label: "Vehicle collection" },
  { key: "servicing",  label: "Being serviced" },
  { key: "completed",  label: "Completed" },
  { key: "cancelled",  label: "Cancelled" },
];

/* step = how far along the tracker is (0 Pending, 1 Confirmed, 2 Collected, 3 Being serviced, 4 Completed)
   type = "book" (fixed price) or "quote" (chosen from quotations) */
export const bookings = [
  { id: "AS-1042", type: "book",  service: "Major Service",       vehicle: "Mercedes-Benz GLC 2023", garage: "AutoPro Garage",   area: "Dubai Marina",  date: "15 Dec 2026, 10:00 AM", price: "AED 1,250", status: "upcoming",   step: 1, phone: "+97140000001" },
  { id: "AS-1043", type: "quote", service: "Brake Pad Replacement", vehicle: "Mercedes-Benz GLC 2023", garage: "SpeedFit Garage",  area: "Al Quoz",       date: "18 Nov 2026, 2:00 PM",  price: "AED 780",   status: "pending",    step: 0, phone: "+97140000002" },
  { id: "AS-1044", type: "book",  service: "AC Service",          vehicle: "Mercedes-Benz GLC 2023", garage: "DriveWell Garage", area: "Jumeirah",      date: "14 Nov 2026, 9:00 AM",  price: "AED 420",   status: "confirmed",  step: 1, phone: "+97140000003" },
  { id: "AS-1045", type: "quote", service: "Suspension Check",    vehicle: "Mercedes-Benz GLC 2023", garage: "AutoPro Garage",   area: "Dubai Marina",  date: "11 Nov 2026, 8:30 AM",  price: "AED 950",   status: "collection", step: 2, phone: "+97140000001" },
  { id: "AS-1046", type: "book",  service: "Full Service & Oil Change", vehicle: "Mercedes-Benz GLC 2023", garage: "AutoPro Garage", area: "Dubai Marina", date: "10 Nov 2026, 9:00 AM", price: "AED 650", status: "servicing", step: 3, phone: "+97140000001" },
  { id: "AS-1030", type: "book",  service: "Brake Service",       vehicle: "Mercedes-Benz GLC 2023", garage: "SpeedFit Garage",  area: "Al Quoz",       date: "12 Jan 2025",           price: "AED 480",   status: "completed",  step: 4, phone: "+97140000002" },
  { id: "AS-1021", type: "book",  service: "Tyre Replacement",    vehicle: "Mercedes-Benz GLC 2023", garage: "DriveWell Garage", area: "Jumeirah",      date: "03 Oct 2026",           price: "AED 1,600", status: "cancelled",  step: 0, phone: "+97140000003" },
];