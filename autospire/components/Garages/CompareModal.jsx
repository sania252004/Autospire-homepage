"use client";
import { Fragment } from "react";
import Modal from "@/components/Modal/Modal";
import Icon from "@/components/Icon/Icon";
import styles from "./Garages.module.css";
import { useRouter } from "next/navigation";

export default function CompareModal({ list, onClose, goTab }) {
  const router = useRouter();
  const bestPrice = Math.min(...list.map((g) => g.from));
  const bestDistance = Math.min(...list.map((g) => g.distanceKm));
  const bestRating = Math.max(...list.map((g) => g.rating));

  // small "Best" tag, shown only when comparing and this garage wins the row
  const best = (isBest) => (isBest ? <span className={styles.bestTag}>Best</span> : null);

  function go(tabId) {
    onClose();
    goTab(tabId);
  }

  /* one entry per row of the table: label + what to show for each garage */
  const rows = [
    { label: "Customer rating", cell: (g) => (
      <>
        <span><Icon name="star" size={15} fill="#f5a623" sw={0} /> <b>{g.rating}</b> ({g.reviews} reviews)</span>
        {best(g.rating === bestRating)}
      </>
    ) },
    { label: "Distance", cell: (g) => (
      <>
        <span><b>{g.distanceKm} km</b> from you</span>
        {best(g.distanceKm === bestDistance)}
      </>
    ) },
    { label: "Next appointment", cell: (g) => <b>{g.nextSlot}</b> },
    { label: "Warranty", cell: (g) => <b>{g.warranty}</b> },
    { label: "Services included", cell: (g) => (
      <ul className={styles.tickList}>
        {g.included.map((item) => <li key={item}><Icon name="check" size={14} sw={3} /> {item}</li>)}
      </ul>
    ) },
    { label: "Collection & delivery", cell: (g) => (
      <b className={g.collection ? styles.yes : styles.no}>{g.collection ? "Available" : "Not available"}</b>
    ) },
    { label: "Estimated completion", cell: (g) => <b>{g.completion}</b> },
    { label: "Jobs completed", cell: (g) => <b>{g.jobs.toLocaleString()} on Autospire</b> },
    { label: "Price", cell: (g) => (
      <>
        <span className={styles.priceCell}>from AED {g.from}</span>
        {best(g.from === bestPrice)}
      </>
    ) },
  ];

  const columns = { gridTemplateColumns: `150px repeat(${list.length}, minmax(210px, 1fr))` };

  return (
    <Modal wide onClose={onClose}>
      <div className={styles.compare}>
        <h3>Compare Garages</h3>
        <p className={styles.compareSub}>Side by side. Final price is confirmed when you book or receive a quote.</p>

        <div className={styles.tableWrap}>
          <div className={styles.table} style={columns}>

            {/* header row: photo, name, verified, area */}
            <div />
            {list.map((g) => (
              <div key={g.id} className={styles.headCell}>
                <div
                  className={styles.headPhoto}
                  style={{ backgroundImage: `url(/images/garage-${g.id}.jpg), linear-gradient(135deg,#2a5aa0,#0a2342)` }}
                />
                <div className={styles.headName}>
                  <b>{g.name}</b>
                  <span className={styles.badge}><Icon name="check" size={13} sw={3} /> Verified</span>
                </div>
                <span className={styles.headArea}>{g.area}, {g.emirate}</span>
              </div>
            ))}

            {/* data rows */}
            {rows.map((row) => (
              <Fragment key={row.label}>
                <div className={`${styles.cell} ${styles.rowLabel}`}>{row.label}</div>
                {list.map((g) => <div key={g.id} className={styles.cell}>{row.cell(g)}</div>)}
              </Fragment>
            ))}

            {/* action row */}
            <div className={styles.cell} />
            {list.map((g) => (
              <div key={g.id} className={`${styles.cell} ${styles.cellActions}`}>
                <button type="button" className={styles.bookBtn} onClick={() => { onClose(); router.push(`/book?garage=${g.id}`); }} />
                <button type="button" className={styles.viewBtn} onClick={() => { onClose(); router.push(`/quote?garage=${g.id}`); }}>Request quote</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}