"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/Icon/Icon";
import { garages, savedVehicles, vehicleLabel } from "@/lib/data";
import { sampleQuotes, priceOf, money, trackSteps } from "@/lib/quotesData";
import styles from "./MyQuotes.module.css";
import { addBooking, newBookingId } from "@/lib/bookingStore";

const STAGES = [
  { id: "sent",    label: "Request sent" },
  { id: "compare", label: "Compare quotes" },
  { id: "slot",    label: "Choose a slot" },
  { id: "booked",  label: "Booked & tracking" },
];

/* "47h 12m" or "9m 05s" */
function countdown(ms) {
  if (ms <= 0) return "Expired";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h >= 1 ? `${h}h ${m}m` : `${m}m ${String(s % 60).padStart(2, "0")}s`;
}

export default function MyQuotes() {
  const params = useSearchParams();

  /* ---------- the request (filled in from the homepage, or sample defaults) ---------- */
  const primary = savedVehicles.find((v) => v.primary) || savedVehicles[0];
  const request = {
    vehicle: params.get("vehicle") || (primary ? vehicleLabel(primary) : "Your vehicle"),
    service: params.get("service") || "General Servicing",
    problem: params.get("problem") || "",
    emirate: params.get("emirate") || "Dubai",
    noise: params.get("noise") === "1",
    video: params.get("video") === "1",
  };

  const [stage, setStage] = useState("sent");
  const [arrivedAt, setArrivedAt] = useState(null);   // time the quotes arrived
  const [now, setNow] = useState(Date.now());         // ticks every second for the countdowns
  const [toast, setToast] = useState("");
  const [chosen, setChosen] = useState(null);         // the quote the customer picked
  const [slot, setSlot] = useState("");
  const [collection, setCollection] = useState(true);
  const [bookingId, setBookingId] = useState("");
  const [trackStep, setTrackStep] = useState(0);

  /* quotes arrive a few seconds after the request is sent (simulated) */
  useEffect(() => {
    if (stage !== "sent") return;
    const timer = setTimeout(receiveQuotes, 5000);
    return () => clearTimeout(timer);
  }, [stage]);

  /* one clock for all countdowns */
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  function receiveQuotes() {
    setArrivedAt(Date.now());
    setNow(Date.now());
    setStage("compare");
    setToast("3 new quotations received");
    setTimeout(() => setToast(""), 4000);
  }

  /* build the 3 quotes with garage details */
  const quotes = sampleQuotes.map((q) => ({
    ...q,
    garage: garages.find((g) => g.id === q.garageId),
    price: priceOf(q),
    left: arrivedAt ? arrivedAt + q.validHours * 3600000 - now : 0,
  }));
  const lowest = Math.min(...quotes.map((q) => q.price.total));

  function choose(quote) {
    setChosen(quote);
    setSlot(quote.garage.nextSlot);
    setStage("slot");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confirmBooking() {
  const id = newBookingId();
  setBookingId(id);
  addBooking({
    id, type: "quote", service: request.service, vehicle: request.vehicle,
    garage: chosen.garage.name, garageId: chosen.garage.id, area: chosen.garage.area,
    date: slot, price: money(chosen.price.total), status: "confirmed", step: 1,
    phone: `+97140000${String(chosen.garage.id).padStart(3, "0")}`,
  });
  setTrackStep(0);
  setStage("booked");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

  const stageIndex = STAGES.findIndex((s) => s.id === stage);
  const slots = [chosen?.garage.nextSlot, "Tomorrow, 9:00 AM", "Tomorrow, 2:00 PM", "Saturday, 10:00 AM"].filter(Boolean);

  return (
    <>
      <section className={styles.banner}>
        <h1>My Quotes</h1>
        <p>Compare competing quotations, choose your garage and track the job.</p>
      </section>

      <div className={styles.page}>
        {toast && <div className={styles.toast}><Icon name="bell" size={18} sw={1.8} /> {toast}</div>}

        {/* PROGRESS BAR */}
        <ol className={styles.progress}>
          {STAGES.map((s, i) => (
            <li key={s.id} className={i <= stageIndex ? styles.progressDone : ""}>
              <span>{i + 1}</span>{s.label}
            </li>
          ))}
        </ol>

        {/* THE REQUEST (always visible) */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h3>Your request</h3>
            <a href="/#top" className={styles.link}>Change request</a>
          </div>
          <div className={styles.facts}>
            <div><small>Vehicle</small><b>{request.vehicle}</b></div>
            <div><small>Service</small><b>{request.service}</b></div>
            <div><small>Location</small><b>{request.emirate}, UAE</b></div>
            <div>
              <small>Attachments</small>
              <b>{!request.noise && !request.video ? "None" : [request.noise && "Noise recording", request.video && "Video"].filter(Boolean).join(", ")}</b>
            </div>
          </div>
          {request.problem && <p className={styles.problem}><Icon name="chat" size={18} sw={1.8} /> {request.problem}</p>}
        </section>

        {/* STAGE 1: REQUEST SENT TO 3 GARAGES */}
        {stage === "sent" && (
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h3>Sending your request to 3 suitable garages…</h3>
              <button className={styles.link} onClick={receiveQuotes}>Skip wait (demo)</button>
            </div>
            <ul className={styles.sentList}>
              {sampleQuotes.map((q) => {
                const g = garages.find((x) => x.id === q.garageId);
                return (
                  <li key={g.id}>
                    <span className={styles.pulse} />
                    <div>
                      <b>{g.name}</b>
                      <small>{g.area} · {g.distanceKm} km · ★ {g.rating}</small>
                    </div>
                    <span className={styles.pending}>Preparing quote…</span>
                  </li>
                );
              })}
            </ul>
            <p className={styles.hint}>You'll be notified as soon as the quotations arrive. Each one is itemised: parts, labour, VAT and extra charges.</p>
          </section>
        )}

        {/* STAGE 2: COMPARE QUOTES */}
        {stage === "compare" && (
          <>
            <h2 className={styles.title}>Quotation Comparison</h2>
            <p className={styles.sub}>3 quotes for your {request.vehicle} ({request.service})</p>

            <div className={styles.quoteGrid}>
              {quotes.map((q) => {
                const expired = q.left <= 0;
                return (
                  <article key={q.garageId} className={`${styles.quote} ${q.price.total === lowest ? styles.best : ""} ${expired ? styles.expired : ""}`}>
                    {q.price.total === lowest && <div className={styles.bestTag}>Best Value</div>}

                    <div className={styles.quoteHead}>
                      <b>{q.garage.name}</b>
                      <span className={styles.stars}>
                        <Icon name="star" size={15} fill="#f5a623" sw={0} /> <b>{q.garage.rating}</b> ({q.garage.reviews} reviews)
                      </span>
                    </div>

                    <dl className={styles.lines}>
                      <div><dt>Parts</dt><dd>{money(q.parts)}</dd></div>
                      <div><dt>Labour</dt><dd>{money(q.labour)}</dd></div>
                      {q.extras.map((e) => <div key={e.label}><dt>{e.label}</dt><dd>{money(e.amount)}</dd></div>)}
                      <div><dt>VAT (5%)</dt><dd>{money(q.price.vat)}</dd></div>
                    </dl>

                    <ul className={styles.perks}>
                      <li><Icon name="rta" size={17} sw={1.6} /> Warranty {q.warranty}</li>
                      <li><Icon name="clock" size={17} sw={1.6} /> Turnaround {q.turnaround}</li>
                      <li><span className={styles.dot} /> Available {q.available}</li>
                    </ul>

                    <div className={styles.expiry}>
                      <Icon name="clock" size={16} sw={1.8} />
                      {expired ? "Quote expired" : <>Valid for <b>{countdown(q.left)}</b></>}
                    </div>

                    <div className={styles.total}><span>Total</span><b>{money(q.price.total)}</b></div>

                    <button className={styles.chooseBtn} disabled={expired} onClick={() => choose(q)}>
                      Choose this garage
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* STAGE 3: CHOOSE A SLOT */}
        {stage === "slot" && chosen && (
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h3>Confirm your booking with {chosen.garage.name}</h3>
              <button className={styles.link} onClick={() => setStage("compare")}>← Back to quotes</button>
            </div>

            <h4 className={styles.label}>Choose a time slot</h4>
            <div className={styles.slots}>
              {slots.map((s) => (
                <button key={s} className={`${styles.slot} ${slot === s ? styles.slotOn : ""}`} onClick={() => setSlot(s)} aria-pressed={slot === s}>
                  <Icon name="calendar" size={17} sw={1.7} /> {s}
                </button>
              ))}
            </div>

            {chosen.garage.collection && (
              <label className={styles.check}>
                <input type="checkbox" checked={collection} onChange={(e) => setCollection(e.target.checked)} />
                Collect and deliver my vehicle (pickup & drop-off available)
              </label>
            )}

            <div className={styles.summary}>
              <div><span>Quotation total (incl. 5% VAT)</span><b>{money(chosen.price.total)}</b></div>
              <div><span>Warranty</span><b>{chosen.warranty}</b></div>
              <div><span>Estimated completion</span><b>{chosen.turnaround}</b></div>
            </div>

            <button className={styles.chooseBtn} onClick={confirmBooking}>Confirm booking</button>
          </section>
        )}

        {/* STAGE 4: BOOKED AND TRACKING */}
        {stage === "booked" && chosen && (
          <section className={styles.card}>
            <div className={styles.success}>
              <Icon name="check" size={30} sw={2.6} />
              <div>
                <h3>Booking confirmed</h3>
                <p>{bookingId} · {chosen.garage.name} · {slot}{collection && chosen.garage.collection ? " · Pickup & drop-off" : ""}</p>
              </div>
              <b className={styles.successTotal}>{money(chosen.price.total)}</b>
            </div>

            <h4 className={styles.label}>Job tracking</h4>
            <ol className={styles.track}>
              {trackSteps.map((step, i) => (
                <li key={step} className={i <= trackStep ? styles.trackDone : ""}>
                  <span>{i <= trackStep ? <Icon name="check" size={13} sw={3} /> : i + 1}</span>{step}
                </li>
              ))}
            </ol>

            <div className={styles.actions}>
              <button className={styles.outlineBtn} disabled={trackStep >= trackSteps.length - 1} onClick={() => setTrackStep(trackStep + 1)}>
                Advance status (demo)
              </button>
              <a href="/my-bookings" className={styles.outlineBtn}>View in My Bookings</a>
              <a href="tel:+97140000001" className={styles.outlineBtn}><Icon name="chat" size={17} sw={1.8} /> Contact garage</a>
            </div>
          </section>
        )}
      </div>
    </>
  );
}