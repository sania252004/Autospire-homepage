"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon/Icon";
import InvoiceModal from "@/components/InvoiceModal/InvoiceModal";
import { bookingStatuses } from "@/lib/myBookingsData";
import { loadBookings, saveBookings, resetBookings } from "@/lib/bookingStore";
import { addNotification } from "@/lib/notificationStore";
import styles from "./MyBookings.module.css";

const bookingSteps = [
  "Pending",
  "Confirmed",
  "Collected",
  "Being serviced",
  "Completed",
];

function parseAmount(price) {
  if (typeof price === "number") return price;
  const cleaned = String(price || "0").replace(/[^0-9.]/g, "");
  return Number(cleaned) || 0;
}

function buildBookingInvoice(b) {
  const totalWithVat = parseAmount(b.price);
  const hasFluidAddon = Boolean(b.fluidAccepted);
  const fluidGross = hasFluidAddon ? 140 : 0;
  const baseGross = Math.max(0, totalWithVat - fluidGross);

  const baseExclVat = Number((baseGross / 1.05).toFixed(2));
  const fluidExclVat = Number((fluidGross / 1.05).toFixed(2));

  const items = [
    {
      name: `${b.service} (Parts & Labour)`,
      qty: 1,
      price: baseExclVat,
    },
  ];

  if (hasFluidAddon) {
    items.push({
      name: "DOT 4 Brake Fluid Flush & Replacement (Customer Approved)",
      qty: 1,
      price: fluidExclVat,
    });
  }

  const subtotal = Number(items.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2));
  const vat = Number((totalWithVat - subtotal).toFixed(2));

  return {
    number: `INV-${String(b.id || "1001").replace(/[^0-9]/g, "")}`,
    title: b.service,
    date: b.date,
    garage: b.garage,
    vehicleName: b.vehicle,
    plate: b.area,
    items,
    subtotal,
    vat,
    total: totalWithVat,
  };
}

export default function MyBookings() {
  const [filter, setFilter] = useState("all");
  const [list, setList] = useState([]);
  const [notice, setNotice] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const loaded = loadBookings();
    const hydrated = loaded.map((b, idx) => {
      const isBrakePad =
        idx === 1 || /brake\s*pad/i.test(b.service || "");
      if (isBrakePad && b.fluidDecision === undefined && !["completed", "cancelled"].includes(b.status)) {
        return {
          ...b,
          fluidRequest: {
            title: "Workshop Recommendation: Change Brake Pad Fluid",
            detail: `${b.garage} inspected your brake system and recommends a DOT 4 brake fluid flush (+ AED 140) before proceeding.`,
            addonPrice: 140,
          },
          fluidDecision: "pending",
        };
      }
      return b;
    });
    setList(hydrated);
  }, []);

  function update(next) {
    setList(next);
    saveBookings(next);
  }

  const visible =
    filter === "all" ? list : list.filter((b) => b.status === filter);
  const count = (key) =>
    key === "all" ? list.length : list.filter((b) => b.status === key).length;

  function say(text) {
    setNotice(text);
    setTimeout(() => setNotice(""), 3200);
  }

  function handleAcceptFluid(id) {
    const target = list.find((x) => x.id === id);
    if (!target) return;

    const currentAmount = parseAmount(target.price);
    const addon = target.fluidRequest?.addonPrice || 140;
    const newTotal = currentAmount + addon;
    const nextStep = Math.min(bookingSteps.length - 1, (target.step ?? 0) + 1);

    const nextList = list.map((b) =>
      b.id === id
        ? {
            ...b,
            price: `AED ${newTotal.toLocaleString("en-US")}`,
            status: b.status === "pending" ? "confirmed" : b.status,
            step: nextStep,
            fluidDecision: "accepted",
            fluidAccepted: true,
          }
        : b
    );

    update(nextList);
    addNotification({
      title: "Brake fluid change approved",
      text: `${target.garage} is proceeding with your ${target.service} (New total: AED ${newTotal.toLocaleString("en-US")}).`,
      href: "/my-bookings",
    });
    say("Brake fluid change accepted. Your booking has moved to the next step.");
  }

  function handleDeclineFluid(id) {
    const target = list.find((x) => x.id === id);
    if (!target) return;

    const nextList = list.map((b) =>
      b.id === id
        ? {
            ...b,
            status: "cancelled",
            fluidDecision: "declined",
          }
        : b
    );

    update(nextList);
    addNotification({
      title: "Booking cancelled",
      text: `You declined the brake fluid change for ${target.service} at ${target.garage}.`,
      href: "/my-bookings",
    });
    say("Brake fluid request declined. The order has been cancelled.");
  }

  function cancel(id) {
    const b = list.find((x) => x.id === id);
    if (b)
      addNotification({
        title: "Booking cancelled",
        text: `${b.service} with ${b.garage}`,
        href: "/my-bookings",
      });
    update(list.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
    say("Booking cancelled.");
  }

  function reschedule(id) {
    const date = window.prompt(
      "Enter a new date and time (e.g. 22 Dec 2026, 10:00 AM):",
    );
    if (!date) return;
    update(
      list.map((b) =>
        b.id === id ? { ...b, date, status: "pending", step: 0 } : b,
      ),
    );
    say("Reschedule request sent. Waiting for the garage to confirm.");
  }

  function resetDemo() {
    resetBookings();
    const fresh = loadBookings().map((b, idx) => {
      const isBrakePad = idx === 1 || /brake\s*pad/i.test(b.service || "");
      if (isBrakePad) {
        return {
          ...b,
          fluidRequest: {
            title: "Workshop Recommendation: Change Brake Pad Fluid",
            detail: `${b.garage} inspected your brake system and recommends a DOT 4 brake fluid flush (+ AED 140) before proceeding.`,
            addonPrice: 140,
          },
          fluidDecision: "pending",
          fluidAccepted: false,
        };
      }
      return b;
    });
    update(fresh);
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

        {visible.length === 0 && (
          <div className={styles.empty}>No bookings in this status.</div>
        )}

        {visible.map((b) => {
          const status = bookingStatuses.find((s) => s.key === b.status);
          const active = !["completed", "cancelled"].includes(b.status);
          const showFluidPrompt =
            active && b.fluidRequest && b.fluidDecision === "pending";

          return (
            <article key={b.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <div className={styles.ref}>
                    {b.id} •{" "}
                    {b.type === "quote"
                      ? "From quotation"
                      : "Fixed-price booking"}
                  </div>
                  <h3>{b.service}</h3>
                  <p className={styles.sub}>
                    {b.vehicle} • {b.garage}
                  </p>
                </div>
                <span className={`${styles.badge} ${styles[b.status]}`}>
                  {status ? status.label : b.status}
                </span>
              </div>

              <div className={styles.meta}>
                <span>
                  <Icon name="calendar" size={18} sw={1.8} /> {b.date}
                </span>
                <span>
                  <Icon name="pin" size={18} sw={1.8} /> {b.area}
                </span>
                <b
                  className={styles.price}
                  onClick={() => setSelectedInvoice(buildBookingInvoice(b))}
                  title="Click to view invoice"
                >
                  {b.price}
                </b>
              </div>

              {showFluidPrompt && (
                <div className={styles.approvalBox} role="region" aria-label="Workshop approval request">
                  <div className={styles.approvalInfo}>
                    <span className={styles.approvalIcon}>
                      <Icon name="bell" size={20} sw={2} />
                    </span>
                    <div>
                      <b>{b.fluidRequest.title}</b>
                      <p>{b.fluidRequest.detail}</p>
                    </div>
                  </div>

                  <div className={styles.approvalActions}>
                    <button
                      type="button"
                      className={styles.acceptBtn}
                      onClick={() => handleAcceptFluid(b.id)}
                    >
                      Accept &amp; Proceed
                    </button>
                    <button
                      type="button"
                      className={styles.declineBtn}
                      onClick={() => handleDeclineFluid(b.id)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}

              {active && (
                <ol className={styles.steps}>
                  {bookingSteps.map((step, i) => (
                    <li
                      key={step}
                      className={i <= b.step ? styles.stepDone : ""}
                    >
                      {step}
                    </li>
                  ))}
                </ol>
              )}

              <div className={styles.actions}>
                {active && (
                  <button onClick={() => reschedule(b.id)}>Reschedule</button>
                )}
                {active && (
                  <button
                    className={styles.danger}
                    onClick={() => cancel(b.id)}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  className={styles.invoiceBtn}
                  onClick={() => setSelectedInvoice(buildBookingInvoice(b))}
                >
                  <Icon name="document" size={17} sw={1.8} /> Invoice Bill
                </button>
                <a href={`tel:${b.phone}`} className={styles.contact}>
                  <Icon name="chat" size={18} sw={1.8} /> Contact garage
                </a>
              </div>
            </article>
          );
        })}

        <button className={styles.resetLink} onClick={resetDemo}>
          Reset demo bookings
        </button>
      </div>

      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </>
  );
}