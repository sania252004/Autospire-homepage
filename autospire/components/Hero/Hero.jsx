"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Dropdown from "@/components/Dropdown/Dropdown";
import IssueCapture from "./IssueCapture";
import VehiclePicker from "./VehiclePicker";
import { services, emirates, bookJourney, quoteJourney, garageJourney } from "@/lib/data";
import styles from "./Hero.module.css";

/* ---------- THE THREE MAIN ACTIONS ----------
   tag         = small label on the card
   desc        = one line under the title
   explainer   = the sentence shown at the top of the white box
   buttonText  = text on the teal button
   steps       = the 4 steps shown at the bottom of the white box */
const TABS = [
  {
    id: "book", icon: "calendar", label: "Book a Service",
    tag: "FIXED PRICE", desc: "See the exact price upfront and book instantly.",
    explainer: "Fixed-price booking: choose a service, see the price before you pay, and book your slot straight away.",
    servicePlaceholder: "Select Service",
    buttonText: "See Fixed Prices", steps: bookJourney,
  },
  {
    id: "quote", icon: "chat", label: "Request Quotations",
    tag: "COMPARE 3 QUOTES", desc: "Describe the problem. Garages compete for your job.",
    explainer: "Competing quotations: your request goes to 3 suitable garages. They send itemised quotes (parts, labour, VAT) and you pick the best.",
    servicePlaceholder: "Service type (optional)",
    buttonText: "Request 3 Quotes", steps: quoteJourney,
  },
  {
    id: "garage", icon: "garage", label: "Find a Garage",
    tag: "BROWSE", desc: "Explore verified garages, ratings and prices.",
    explainer: "Browse verified garages near you, then book a fixed-price service or request a quote.",
    servicePlaceholder: "Select Service (optional)",
    buttonText: "Find Garages", steps: garageJourney,
  },
];

/* ---------- THE 5 TRUST POINTS UNDER THE SEARCH BOX ---------- */
const TRUST_POINTS = [
  { icon: "rta",         line1: "Verified",       line2: "Garages" },
  { icon: "scale",       line1: "Compare",        line2: "Prices" },
  { icon: "diagnostics", line1: "Book Instantly", line2: "" },
  { icon: "headset",     line1: "24/7 Support",   line2: "" },
  { icon: "star",        line1: "Trusted by",     line2: "100,000+ Drivers" },
];

/* ---------- THE HERO ---------- */
export default function Hero({
  tab, setTab,
  vehicle, setVehicle,
  service, setService,
  emirate, setEmirate,
  problem, setProblem,   // the written description (Quotation tab)
  onSearch,              // runs when the main button is clicked
  onIssueChange,         // receives the recorded noise / uploaded video
}) {
  const [error, setError] = useState("");
  const activeTab = TABS.find((t) => t.id === tab);
  const serviceNames = services.map((s) => s.title);

  function chooseTab(id) {
    setTab(id);
    setError("");
  }

  function submit() {
    if (tab !== "garage" && !vehicle) {
      setError("Please select your vehicle (make, model and year).");
      return;
    }
    if (tab === "book" && !service) {
      setError("Please select a service to see fixed prices.");
      return;
    }
    if (tab === "quote" && !service && !problem.trim()) {
      setError("Please choose a service type or describe the problem so garages can quote.");
      return;
    }
    setError("");
    onSearch();
  }

  return (
    <section id="top" className={styles.hero}>
      <div className="wrap">

        <h1>
          Your Complete<br />
          <span className={styles.highlight}>Automotive Services<br />Marketplace</span> in the UAE
        </h1>
        <p className={styles.subtitle}>Compare garages, get competitive quotes<br />and book with confidence.</p>

        {/* THE THREE MAIN ACTIONS */}
        <div className={styles.actionCards} role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`${styles.actionCard} ${tab === t.id ? styles.active : ""}`}
              onClick={() => chooseTab(t.id)}
            >
              <span className={styles.cardIcon}><Icon name={t.icon} size={26} /></span>
              <span className={styles.cardBody}>
                <span className={styles.cardTag}>{t.tag}</span>
                <b>{t.label}</b>
                <small>{t.desc}</small>
              </span>
            </button>
          ))}
        </div>

        {/* THE WHITE BOX (changes with the open action) */}
        <div className={styles.searchBox}>
          <p className={styles.explainer}><Icon name="info" size={20} sw={1.8} /> {activeTab.explainer}</p>

          {/* vehicle: saved vehicle pre-selected, or make / model / year */}
          <VehiclePicker onChange={setVehicle} />

          <div className={styles.fieldsRow}>
            <Dropdown icon="servicing" placeholder={activeTab.servicePlaceholder} value={service} onChange={setService} options={serviceNames} />
            <Dropdown icon="pin" placeholder="Select Location" value={emirate} onChange={setEmirate} options={emirates} format={(e) => `${e}, UAE`} />
          </div>

          {/* QUOTATION ONLY: describe the problem + record noise / upload video */}
          {tab === "quote" && (
            <>
              <textarea
                className={styles.problem}
                placeholder="Describe the problem (e.g. grinding noise when braking, warning light on, AC not cooling)"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
              <IssueCapture onChange={onIssueChange} />
            </>
          )}

          <div className={styles.actionRow}>
            <span className={styles.formError} role="alert">{error}</span>
            <button className={`btn ${styles.searchButton}`} onClick={submit}>
              <Icon name="search" size={22} sw={2.2} />
              {activeTab.buttonText}
            </button>
          </div>

          {/* HOW THIS JOURNEY WORKS */}
          <ol className={styles.journey}>
            {activeTab.steps.map((text, i) => (
              <li key={text}><span className={styles.stepNum}>{i + 1}</span>{text}</li>
            ))}
          </ol>
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