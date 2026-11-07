"use client";
import Icon from "@/components/Icon/Icon";
import Dropdown from "@/components/Dropdown/Dropdown";
import IssueCapture from "./IssueCapture";
import { services, emirates, vehicles } from "@/lib/data";
import styles from "./Hero.module.css";

/* ---------- THE THREE TABS ---------- */
// id         = internal name (don't change)
// icon       = icon shown on the tab
// label      = text on the tab
// buttonText = text on the teal search button when this tab is open
const TABS = [
  { id: "book",   icon: "calendar", label: "Book a Service",      buttonText: "Search" },
  { id: "quote",  icon: "chat",     label: "Request a Quotation", buttonText: "Get Quotes" },
  { id: "garage", icon: "garage",   label: "Find a Garage",       buttonText: "Find Garages" },
];

/* ---------- THE 5 TRUST POINTS UNDER THE SEARCH BOX ---------- */
// line1 and line2 are the two lines of text. Leave line2 empty ("") for one line.
const TRUST_POINTS = [
  { icon: "rta",         line1: "Verified",       line2: "Garages" },
  { icon: "scale",       line1: "Compare",        line2: "Prices" },
  { icon: "diagnostics", line1: "Book Instantly", line2: "" },
  { icon: "headset",     line1: "24/7 Support",   line2: "" },
  { icon: "star",        line1: "Trusted by",     line2: "100,000+ Drivers" },
];

/* ---------- THE HERO ---------- */
// All the values below (tab, vehicle, service, ...) come from page.jsx.
// "set..." functions change them when the visitor picks something.
export default function Hero({
  tab, setTab,
  vehicle, setVehicle,
  service, setService,
  emirate, setEmirate,
  onSearch,       // runs when the search button is clicked
  onIssueChange,  // receives the recorded noise / uploaded video
}) {
  // the tab that is currently open (used for the search button text)
  const activeTab = TABS.find((t) => t.id === tab);

  // list of service names for the "Select Service" dropdown
  const serviceNames = services.map((s) => s.title);

  // if the vehicle was chosen somewhere else and isn't in the list, add it so the dropdown can show it
  const vehicleOptions = vehicle && !vehicles.includes(vehicle) ? [vehicle, ...vehicles] : vehicles;

  return (
    <section id="top" className={styles.hero}>
      <div className="wrap">

        {/* HEADLINE: the teal words are inside <span className={styles.highlight}> */}
        <h1>
          Your Complete<br />
          <span className={styles.highlight}>Automotive Services<br />Marketplace</span> in the UAE
        </h1>
        <p className={styles.subtitle}>Compare garages, get competitive quotes<br />and book with confidence.</p>

        {/* THE THREE TABS */}
        <div className={styles.tabs} role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`${styles.tab} ${tab === t.id ? styles.active : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className={styles.tabIcon}><Icon name={t.icon} size={22} /></span>
              <b>{t.label}</b>
            </button>
          ))}
        </div>

        {/* THE WHITE SEARCH BOX */}
        <div className={styles.searchBox}>
          <div className={styles.searchRow}>
            <Dropdown icon="car" placeholder="Select Your Vehicle" value={vehicle} onChange={setVehicle} options={vehicleOptions} />
            <Dropdown icon="servicing" placeholder="Select Service" value={service} onChange={setService} options={serviceNames} />
            <Dropdown icon="pin" placeholder="Select Location" value={emirate} onChange={setEmirate} options={emirates} format={(e) => `${e}, UAE`} />

            <button className={`btn ${styles.searchButton}`} onClick={onSearch}>
              <Icon name="search" size={22} sw={2.2} />
              {activeTab.buttonText}
            </button>
          </div>

          {/* "Record car noise / Upload video" box: only on the Book a Service tab */}
          {tab === "book" && <IssueCapture onChange={onIssueChange} />}
        </div>

        {/* THE 5 TRUST POINTS */}
        <div className={styles.trustRow}>
          {TRUST_POINTS.map((point) => (
            <div key={point.line1} className={styles.trustPoint}>
              <Icon name={point.icon} size={42} sw={1.4} />
              <span>{point.line1}<br />{point.line2}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}