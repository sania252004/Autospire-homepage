"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon/Icon";
import { bookingStatuses } from "@/lib/myBookingsData";
import { loadBookings, saveBookings, resetBookings } from "@/lib/bookingStore";
import styles from "./MyBookings.module.css";

const bookingSteps = ["Pending", "Confirmed", "Collected", "Being serviced", "Completed"];

export default function MyBookings() {
  const [filter, setFilter] = useState("all");
  const [list, setList] = useState([]);
  const [notice, setNotice] = useState("");

  /* load the saved bookings once the page is open in the browser */
  useEffect(() => { setList(loadBookings()); }, []);

  function update(next) {
    setList(next);
    saveBookings(next);
  }

  const visible = filter === "all" ? list : list.filter((b) => b.status === filter);
  const count = (key) => (key === "all" ? list.length : list.filter((b) => b.status === key).length);

  function say(text) {
    setNotice(text);
    setTimeout(() => setNotice(""), 2500);
  }

  function cancel(id) {
    update(list.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
    say("Booking cancelled.");
  }

  function reschedule(id) {
    const date = window.prompt("Enter a new date and time (e.g. 22 Dec 2026, 10:00 AM):");
    if (!date) return;
    update(list.map((b) => (b.id === id ? { ...b, date, status: "pending", step: 0 } : b)));
    say("Reschedule request sent. Waiting for the garage to confirm.");
  }

  function resetDemo() {
    resetBookings();
    setList(loadBookings());
    say("Demo bookings reset.");
  }

  return (
    <>
      <section className={styles.banner}>
        <h1>My Bookings</h1>
        <p>Track, reschedule or cancel your service bookings.</p>
      </section>

      <div className={styles.page}>
        {notice && <div className={styles.notice}>{notice}</div>}

        <div className={styles.filters} role="tablist">
          {bookingStatuses.map((s) => (
            <button
              key={s.key}
              role="tab"
              aria-selected={filter === s.key}
              className={`${styles.filter} ${filter === s.key ? styles.filterActive : ""}`}
              onClick={() => setFilter(s.key)}
            >
              {s.label} <span className={styles.count}>{count(s.key)}</span>
            </button>
          ))}
        </div>

        {visible.length === 0 && <div className={styles.empty}>No bookings in this status.</div>}

        {visible.map((b) => {
          const status = bookingStatuses.find((s) => s.key === b.status);
          const active = !["completed", "cancelled"].includes(b.status);
          return (
            <article key={b.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <div className={styles.ref}>{b.id} • {b.type === "quote" ? "From quotation" : "Fixed-price booking"}</div>
                  <h3>{b.service}</h3>
                  <p className={styles.sub}>{b.vehicle} • {b.garage}</p>
                </div>
                <span className={`${styles.badge} ${styles[b.status]}`}>{status ? status.label : b.status}</span>
              </div>

              <div className={styles.meta}>
                <span><Icon name="calendar" size={18} sw={1.8} /> {b.date}</span>
                <span><Icon name="pin" size={18} sw={1.8} /> {b.area}</span>
                <b className={styles.price}>{b.price}</b>
              </div>

              {active && (
                <ol className={styles.steps}>
                  {bookingSteps.map((step, i) => (
                    <li key={step} className={i <= b.step ? styles.stepDone : ""}>{step}</li>
                  ))}
                </ol>
              )}

              <div className={styles.actions}>
                {active && <button onClick={() => reschedule(b.id)}>Reschedule</button>}
                {active && <button className={styles.danger} onClick={() => cancel(b.id)}>Cancel</button>}
                <a href={`tel:${b.phone}`} className={styles.contact}>
                  <Icon name="chat" size={18} sw={1.8} /> Contact garage
                </a>
              </div>
            </article>
          );
        })}

        <button className={styles.resetLink} onClick={resetDemo}>Reset demo bookings</button>
      </div>
    </>
  );
}