"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Dropdown from "@/components/Dropdown/Dropdown";
import { services, emirates, plates, vehicles } from "@/lib/data";
import { makeCx } from "@/lib/cx";
import styles from "./Hero.module.css";
const cx = makeCx(styles);

const TABS = [
  ["book", "calendar", "Book a Service", "Search"],
  ["quote", "chat", "Request a Quotation", "Get Quotes"],
  ["garage", "garage", "Find a Garage", "Find Garages"],
];
const NOTE = {
  book: ["tag", "Fixed-price booking:", "see the price upfront, pick a time and book instantly."],
  quote: ["scale", "Competitive quotations:", "up to 5 verified garages compete with their best price."],
  garage: ["garage", "Garage directory:", "browse verified, rated garages and open their full profiles."],
};
const TRUST = [["rta", "Verified", "Garages"], ["scale", "Compare", "Prices"], ["diagnostics", "Book Instantly", ""], ["headset", "24/7 Support", ""], ["star", "Trusted by", "100,000+ Drivers"]];

export default function Hero({ tab, setTab, vehicle, setVehicle, service, setService, emirate, setEmirate, onSearch }) {
  const [pEm, setPEm] = useState("Dubai");
  const [pCode, setPCode] = useState("");
  const [pNum, setPNum] = useState("");
  const [found, setFound] = useState(false);
  const cur = TABS.find((t) => t[0] === tab);
  const note = NOTE[tab];

  const lookup = () => {
    if (!pNum.trim()) return;
    setVehicle(`Plate: ${pEm} ${pCode.trim().toUpperCase()} ${pNum.trim()}`.replace(/\s+/g, " "));
    setFound(true);
  };
  const vOptions = vehicle && !vehicles.includes(vehicle) ? [vehicle, ...vehicles] : vehicles;

  return (
    <section id="top" className={cx("hero")}>
      <div className={cx("wrap")}>
        <h1>Your Complete<br /><span className={cx("teal")}>Automotive Services<br />Marketplace</span> in the UAE</h1>
        <p className={cx("sub")}>Compare garages, get competitive quotes<br />and book with confidence.</p>

        <div className={cx("tabs")} role="tablist">
          {TABS.map(([id, ic, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} className={cx("tab", tab === id && "on")} onClick={() => setTab(id)}>
              <span className={cx("tico")}><Icon name={ic} size={22} /></span><b>{label}</b>
            </button>
          ))}
        </div>

        <div className={cx("panel")}>
          <div className={cx("srow")}>
            <Dropdown icon="car" placeholder="Select Your Vehicle" value={vehicle} onChange={(v) => { setVehicle(v); setFound(false); }} options={vOptions} />
            <Dropdown icon="servicing" placeholder="Select Service" value={service} onChange={setService} options={services.map((s) => s.title)} />
            <Dropdown icon="pin" placeholder="Select Location" value={emirate} onChange={setEmirate} options={emirates} format={(e) => `${e}, UAE`} />
            <button className={cx("btn go")} onClick={onSearch}><Icon name="search" size={22} sw={2.2} />{cur[3]}</button>
          </div>
        </div>

        <div className={cx("trust")}>
          {TRUST.map(([ic, a, b]) => (
            <div key={a} className={cx("ti")}><Icon name={ic} size={42} sw={1.4} /><span>{a}<br />{b}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}
