"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import Logo from "@/components/Logo/Logo";
import { money } from "@/lib/invoice";
import styles from "./InvoiceModal.module.css";

// invoice = the bill to show (made by buildInvoice), or null to hide the pop-up
// onClose = function that closes the pop-up
export default function InvoiceModal({ invoice, onClose }) {
  // Esc closes the pop-up
  useEffect(() => {
    if (!invoice) return;
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [invoice, onClose]);

  // no invoice selected, so show nothing
  if (!invoice) return null;

  return createPortal(
    // clicking the dark area closes the pop-up
    <div className={styles.overlay} onClick={onClose}>

      {/* the white bill (clicks inside it must NOT close the pop-up) */}
      <div className={styles.paper} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Invoice">

        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </svg>
        </button>

        {/* TOP: logo on the left, invoice number on the right */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo size={40} text={false} color="#0b3558" />
            <span>Karevo</span>
          </div>
          <div className={styles.invoiceId}>
            <h2>Invoice</h2>
            <p>{invoice.number}</p>
          </div>
        </div>

        {/* DETAILS: service, date, garage, vehicle */}
        <div className={styles.meta}>
          <div><small>Service</small><b>{invoice.title}</b></div>
          <div><small>Date</small><b>{invoice.date}</b></div>
          <div><small>Garage</small><b>{invoice.garage || "—"}</b></div>
          <div>
            <small>Vehicle</small>
            <b>{invoice.vehicleName || "—"}</b>
            {invoice.plate && <span className={styles.plate}>{invoice.plate}</span>}
          </div>
        </div>

        {/* THE LINE ITEMS */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Description</th>
                <th className={styles.qty}>Qty</th>
                <th className={styles.num}>Price</th>
                <th className={styles.num}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td className={styles.qty}>{item.qty}</td>
                  <td className={styles.num}>{money(item.price)}</td>
                  <td className={styles.num}>{money(item.qty * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}
        <div className={styles.totals}>
          <div><span>Subtotal (excl. VAT)</span><span>{money(invoice.subtotal)}</span></div>
          <div><span>VAT (5%)</span><span>{money(invoice.vat)}</span></div>
          <div className={styles.grand}><span>Total</span><span>{money(invoice.total)}</span></div>
        </div>

        <p className={styles.note}>
          <span className={styles.paid}>Paid</span>
          Prices include 5% VAT. Thank you for choosing Karevo.
        </p>

      </div>
    </div>,
    document.body
  );
}