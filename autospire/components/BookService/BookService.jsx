"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/Icon/Icon";
import { garages, emirates, services, savedVehicles, vehicleLabel, carModels, carMakes, carYears } from "@/lib/data";
import { priceFor, hasFixedPrice, COLLECTION_FEE, VAT, TIMES, garagePhone } from "@/lib/bookData";
import { money } from "@/lib/quotesData";
import { addBooking, newBookingId } from "@/lib/bookingStore";
import styles from "./BookService.module.css";
import { addNotification } from "@/lib/notificationStore";

const STEPS = ["Service", "Garage", "Time slot", "Confirm"];
const STAGE_INDEX = { details: 0, garage: 1, slot: 2, review: 3, done: 3 };

/* "2023 Mercedes-Benz GLC" -> "Mercedes-Benz" */
const makeOf = (vehicle) => carMakes.find((m) => vehicle.includes(m)) || "";

export default function BookService() {
  const params = useSearchParams();
  const primary = savedVehicles.find((v) => v.primary) || savedVehicles[0];
  const saved = savedVehicles.map(vehicleLabel);

  /* values that may arrive from the homepage or a garage's Book button */
  const startVehicle = params.get("vehicle") || (primary ? vehicleLabel(primary) : "");
  const startService = params.get("service") || "";
  const startGarage = Number(params.get("garage")) || null;

  const [vehicle, setVehicle] = useState(startVehicle);
  const [adding, setAdding] = useState(false);                 // "another vehicle" picker open
  const [nv, setNv] = useState({ make: "", model: "", year: "" });
  const [service, setService] = useState(startService);
  const [emirate, setEmirate] = useState(params.get("emirate") || "Dubai");
  const [garageId, setGarageId] = useState(startGarage);
  const [days, setDays] = useState([]);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState("");
  const [collection, setCollection] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");

  /* skip ahead when the homepage already sent the vehicle and service */
  const [stage, setStage] = useState(() => {
    if (startVehicle && hasFixedPrice(startService)) {
      const pre = garages.find((g) => g.id === startGarage && g.offers.includes(startService));
      return pre ? "slot" : "garage";
    }
    return "details";
  });

  /* the next 7 days (made after the page loads so the date is the customer's own) */
  useEffect(() => {
    const now = new Date();
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      list.push({
        i,
        today: i === 0,
        label: d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" }),
        full: d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }),
      });
    }
    setDays(list);
  }, []);

  const garage = garages.find((g) => g.id === garageId);
  const quoteOnly = service && !hasFixedPrice(service);

  /* garages that offer this service: same emirate first, then nearest */
  const list = garages
    .filter((g) => g.offers.includes(service))
    .sort((a, b) => (b.emirate === emirate) - (a.emirate === emirate) || a.distanceKm - b.distanceKm);

  /* price breakdown */
  const base = garage && hasFixedPrice(service) ? priceFor(garage, service) : 0;
  const fee = garage && collection && garage.collection ? COLLECTION_FEE : 0;
  const subtotal = base + fee;
  const vat = Math.round(subtotal * VAT);
  const total = subtotal + vat;

  /* a slot is unavailable if it already passed today, or the garage is already booked (sample rule) */
  function slotOff(d, t, index) {
    if (d.today && t.hour <= new Date().getHours() + 1) return true;
    return (garage.id + d.i * 3 + index) % 4 === 0;
  }

  /* ---------- actions ---------- */
  function pickVehicle(value) {
    setError("");
    if (value === "__new") { setAdding(true); setVehicle(""); return; }
    setAdding(false);
    setVehicle(value);
  }

  function changeNewVehicle(key, value) {
    const next = { ...nv, [key]: value };
    if (key === "make") next.model = "";
    setNv(next);
    setVehicle(next.make && next.model && next.year ? `${next.year} ${next.make} ${next.model}` : "");
  }

  function toGarages() {
    if (!vehicle) return setError("Please select your vehicle (make, model and year).");
    if (!service) return setError("Please select a service.");
    setError("");
    const pre = garages.find((g) => g.id === garageId && g.offers.includes(service));
    setStage(pre ? "slot" : "garage");
  }

  function chooseGarage(id) {
    setGarageId(id);
    setDay(null);
    setTime("");
    setCollection(false);
    setStage("slot");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toReview() {
    if (!day || !time) return setError("Please choose a date and a time.");
    setError("");
    setStage("review");
  }

  function confirm() {
    const id = newBookingId();
    addBooking({
      id, type: "book", service, vehicle,
      garage: garage.name, garageId: garage.id, area: garage.area,
      date: `${day.full}, ${time}`, price: money(total),
      status: "confirmed", step: 1, phone: garagePhone(garage),
    });
    addNotification({ title: "Booking confirmed", text: `${service} at ${garage.name} · ${day.full}, ${time}`, href: "/my-bookings" });
    setBookingId(id);
    setStage("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setService("");
    setGarageId(null);
    setDay(null);
    setTime("");
    setCollection(false);
    setStage("details");
  }

  const quoteLink = `/my-quotes?${new URLSearchParams({ vehicle, service, emirate }).toString()}`;
  const vehicleOptions = vehicle && !saved.includes(vehicle) && !adding ? [...saved, vehicle] : saved;
  const stageIndex = STAGE_INDEX[stage];

  return (
    <>
      <section className={styles.banner}>
        <h1>Book a Service</h1>
        <p>Fixed prices, no surprises. Pick a garage and a time and you're booked.</p>
      </section>

      <div className={styles.page}>

        {/* PROGRESS */}
        <ol className={styles.progress}>
          {STEPS.map((label, i) => (
            <li key={label} className={i <= stageIndex ? styles.progressDone : ""}><span>{i + 1}</span>{label}</li>
          ))}
        </ol>

        {/* STEP 1: VEHICLE AND SERVICE */}
        {stage === "details" && (
          <section className={styles.card}>
            <div className={styles.cardHead}><h3>What do you need?</h3></div>
            {garage && <p className={styles.note}><Icon name="check" size={16} sw={3} /> Booking with <b>{garage.name}</b>. Choose a service they offer.</p>}

            <div className={styles.formGrid}>
              <label className={styles.field}>Your vehicle
                <select value={adding ? "__new" : vehicle} onChange={(e) => pickVehicle(e.target.value)}>
                  <option value="">Select your vehicle</option>
                  {vehicleOptions.map((v) => <option key={v}>{v}</option>)}
                  <option value="__new">Another vehicle…</option>
                </select>
              </label>
              <label className={styles.field}>Service
                <select value={service} onChange={(e) => { setService(e.target.value); setError(""); }}>
                  <option value="">Select service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}{hasFixedPrice(s.title) ? "" : " (by quotation)"}</option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>Location
                <select value={emirate} onChange={(e) => setEmirate(e.target.value)}>
                  {emirates.map((e) => <option key={e} value={e}>{e}, UAE</option>)}
                </select>
              </label>
            </div>

            {adding && (
              <div className={styles.formGrid}>
                <label className={styles.field}>Make
                  <select value={nv.make} onChange={(e) => changeNewVehicle("make", e.target.value)}>
                    <option value="">Select make</option>
                    {carMakes.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </label>
                <label className={styles.field}>Model
                  <select value={nv.model} disabled={!nv.make} onChange={(e) => changeNewVehicle("model", e.target.value)}>
                    <option value="">Select model</option>
                    {(carModels[nv.make] || []).map((m) => <option key={m}>{m}</option>)}
                  </select>
                </label>
                <label className={styles.field}>Year
                  <select value={nv.year} onChange={(e) => changeNewVehicle("year", e.target.value)}>
                    <option value="">Select year</option>
                    {carYears.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </label>
              </div>
            )}

            {quoteOnly && (
              <div className={styles.quoteBox}>
                <Icon name="scale" size={24} sw={1.6} />
                <div>
                  <b>{service} is priced by quotation</b>
                  <p>The cost depends on what the garage finds, so we can't show a fixed price. Request quotes and 3 garages will compete for the job.</p>
                </div>
                <a href={quoteLink} className={styles.primaryBtn}>Request quotations</a>
              </div>
            )}

            {error && <p className={styles.error} role="alert">{error}</p>}
            {!quoteOnly && <button className={styles.primaryBtn} onClick={toGarages}>See garages & fixed prices</button>}
          </section>
        )}

        {/* STEP 2: CHOOSE A GARAGE */}
        {stage === "garage" && (
          <>
            <div className={styles.headRow}>
              <div>
                <h2 className={styles.title}>Fixed prices for {service}</h2>
                <p className={styles.sub}>{vehicle} · {emirate}, UAE · {list.length} garage{list.length === 1 ? "" : "s"}</p>
              </div>
              <button className={styles.linkBtn} onClick={() => setStage("details")}>← Change details</button>
            </div>

            {list.length === 0 && <div className={styles.card}><p className={styles.hint}>No garage offers this service yet. Try requesting quotations instead.</p></div>}

            {list.map((g) => {
              const make = makeOf(vehicle);
              const supports = make && g.brands.includes(make);
              return (
                <article key={g.id} className={styles.garageCard}>
                  <div className={styles.gMain}>
                    <div className={styles.gName}>
                      <b>{g.name}</b>
                      <span className={styles.badge}><Icon name="check" size={13} sw={3} /> Verified</span>
                      {g.emirate !== emirate && <span className={styles.other}>{g.emirate}</span>}
                    </div>
                    <div className={styles.gMeta}>
                      <span><Icon name="star" size={15} fill="#f5a623" sw={0} /> <b>{g.rating}</b> ({g.reviews} reviews)</span>
                      <span><Icon name="pin" size={14} fill="currentColor" sw={0} /> {g.area} · {g.distanceKm} km</span>
                    </div>
                    <div className={styles.gFacts}>
                      <span><Icon name="calendar" size={16} sw={1.7} /> Next slot: {g.nextSlot}</span>
                      <span><Icon name="rta" size={16} sw={1.7} /> Warranty {g.warranty}</span>
                      <span><Icon name="clock" size={16} sw={1.7} /> {g.completion}</span>
                      <span><Icon name="car" size={16} sw={1.7} /> {g.collection ? "Pickup & drop-off" : "Visit garage"}</span>
                    </div>
                    {make && (
                      <span className={supports ? styles.chipOk : styles.chipWarn}>
                        {supports ? `Specialises in ${make}` : `${make} not in this garage's listed brands`}
                      </span>
                    )}
                  </div>
                  <div className={styles.gPrice}>
                    <small>Fixed price</small>
                    <b>{money(priceFor(g, service))}</b>
                    <small>+ 5% VAT</small>
                    <button className={styles.primaryBtn} onClick={() => chooseGarage(g.id)}>Select garage</button>
                  </div>
                </article>
              );
            })}
          </>
        )}

        {/* STEP 3: DATE AND TIME */}
        {stage === "slot" && garage && (
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h3>Pick a time at {garage.name}</h3>
              <button className={styles.linkBtn} onClick={() => setStage("garage")}>← Change garage</button>
            </div>

            <h4 className={styles.label}>Date</h4>
            <div className={styles.dayRow}>
              {days.map((d) => (
                <button key={d.i} className={`${styles.dayBtn} ${day?.i === d.i ? styles.on : ""}`} onClick={() => { setDay(d); setTime(""); setError(""); }} aria-pressed={day?.i === d.i}>
                  {d.today ? "Today" : d.label}
                </button>
              ))}
            </div>

            {day && (
              <>
                <h4 className={styles.label}>Time</h4>
                <div className={styles.timeGrid}>
                  {TIMES.map((t, index) => {
                    const off = slotOff(day, t, index);
                    return (
                      <button key={t.label} disabled={off} className={`${styles.timeBtn} ${time === t.label ? styles.on : ""}`} onClick={() => { setTime(t.label); setError(""); }} aria-pressed={time === t.label}>
                        {t.label}{off && <small>Unavailable</small>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {garage.collection && (
              <label className={styles.check}>
                <input type="checkbox" checked={collection} onChange={(e) => setCollection(e.target.checked)} />
                Collect and deliver my vehicle (+ {money(COLLECTION_FEE)})
              </label>
            )}

            {error && <p className={styles.error} role="alert">{error}</p>}
            <button className={styles.primaryBtn} onClick={toReview}>Continue to review</button>
          </section>
        )}

        {/* STEP 4: REVIEW AND CONFIRM */}
        {stage === "review" && garage && (
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h3>Review and confirm</h3>
              <button className={styles.linkBtn} onClick={() => setStage("slot")}>← Change time</button>
            </div>

            <dl className={styles.summary}>
              <div><dt>Vehicle</dt><dd>{vehicle}</dd></div>
              <div><dt>Service</dt><dd>{service}</dd></div>
              <div><dt>Garage</dt><dd>{garage.name}, {garage.area}</dd></div>
              <div><dt>Date and time</dt><dd>{day.full}, {time}</dd></div>
              <div><dt>Warranty</dt><dd>{garage.warranty}</dd></div>
              <div><dt>Estimated completion</dt><dd>{garage.completion}</dd></div>
              <div><dt>Collection & delivery</dt><dd>{fee > 0 ? "Yes" : "No"}</dd></div>
            </dl>

            <dl className={styles.breakdown}>
              <div><dt>{service} (fixed price)</dt><dd>{money(base)}</dd></div>
              {fee > 0 && <div><dt>Pickup & delivery</dt><dd>{money(fee)}</dd></div>}
              <div><dt>VAT (5%)</dt><dd>{money(vat)}</dd></div>
              <div className={styles.totalRow}><dt>Total</dt><dd>{money(total)}</dd></div>
            </dl>

            <p className={styles.hint}>You can reschedule or cancel from My Bookings.</p>
            <button className={styles.primaryBtn} onClick={confirm}>Confirm booking</button>
          </section>
        )}

        {/* DONE */}
        {stage === "done" && garage && (
          <section className={styles.card}>
            <div className={styles.success}>
              <Icon name="check" size={30} sw={2.6} />
              <div>
                <h3>Booking confirmed</h3>
                <p>{bookingId} · {service} · {garage.name} · {day.full}, {time}</p>
              </div>
              <b className={styles.successTotal}>{money(total)}</b>
            </div>
            <p className={styles.hint}>Your {vehicle} is booked. Follow its status, reschedule or contact the garage from My Bookings.</p>
            <div className={styles.actions}>
              <a href="/my-bookings" className={styles.primaryBtn}>View in My Bookings</a>
              <button className={styles.outlineBtn} onClick={restart}>Book another service</button>
            </div>
          </section>
        )}

      </div>
    </>
  );
}