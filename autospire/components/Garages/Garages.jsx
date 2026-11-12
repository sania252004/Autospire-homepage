"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Slider from "@/components/Slider/Slider";
import CompareModal from "./CompareModal";
import { garages } from "@/lib/data";
import styles from "./Garages.module.css";
import { useRouter } from "next/navigation";

const MAX_COMPARE = 3;

/* ---------- ONE GARAGE CARD ---------- */
function GarageCard({ garage, photoNumber, onOpen, onBook, selected, onToggle }) {
  const photo = `url(/images/garage-${photoNumber}.jpg), linear-gradient(135deg,#2a5aa0,#0a2342)`;
  const shownBrands = garage.brands.slice(0, 3);
  const moreBrands = garage.brands.length - shownBrands.length;

  return (
    <article className={`${styles.card} ${selected ? styles.cardSelected : ""}`}>

      {/* photo, Premium tag and the Compare tick box */}
      <div className={styles.photoWrap}>
        <div className={styles.photo} style={{ backgroundImage: photo }} />
        {garage.premium && <span className={styles.premium}>Premium</span>}
        <button
          type="button"
          className={`${styles.compareToggle} ${selected ? styles.compareOn : ""}`}
          onClick={onToggle}
          aria-pressed={selected}
        >
          <span className={styles.box}>{selected && <Icon name="check" size={11} sw={3.5} />}</span>
          Compare
        </button>
      </div>

      {/* details (click to open the full profile) */}
      <button className={styles.openArea} onClick={onOpen} aria-label={`Open ${garage.name} profile`}>
        <span className={styles.nameRow}>
          <b>{garage.name}</b>
          <span className={styles.badge}><Icon name="check" size={13} sw={3} /> Verified</span>
        </span>

        <span className={styles.ratingRow}>
          <span className={styles.rating}>
            <Icon name="star" size={15} fill="#f5a623" sw={0} /> <b>{garage.rating}</b> ({garage.reviews} reviews)
          </span>
          <span className={styles.distance}>
            <Icon name="pin" size={14} fill="currentColor" sw={0} /> {garage.distanceKm} km
          </span>
        </span>

        <span className={styles.chipsLabel}>Specialises in:</span>
        <span className={styles.chips}>
          {shownBrands.map((brand) => <span key={brand} className={styles.chip}>{brand}</span>)}
          {moreBrands > 0 && <span className={styles.chip}>+{moreBrands}</span>}
        </span>

        <span className={styles.perks}>
          <span className={styles.perk}>
            <Icon name="car" size={18} sw={1.6} />
            <span>{garage.collection ? "Pickup & Drop-off" : "No collection"}<small>{garage.collection ? "Available" : "Visit garage"}</small></span>
          </span>
          <span className={styles.perk}>
            <Icon name="calendar" size={18} sw={1.6} />
            <span>Next slot<small>{garage.nextSlot}</small></span>
          </span>
        </span>

        <span className={styles.price}>from AED {garage.from}<small>starting price</small></span>
      </button>

      {/* View Garage and Book */}
      <div className={styles.cardActions}>
        <button type="button" className={styles.viewBtn} onClick={onOpen}>View Garage</button>
        <button type="button" className={styles.bookBtn} onClick={onBook}>Book</button>
      </div>
    </article>
  );
}

/* ---------- THE WHOLE SECTION ---------- */
// open   = opens a garage pop-up (from page.jsx)
// note   = message after a search
// goTab  = switches the Hero tab and scrolls up (from page.jsx)
export default function Garages({ open, note, goTab }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  const selected = garages.filter((g) => selectedIds.includes(g.id));

  function toggle(id) {
    setLimitMessage("");
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else if (selectedIds.length >= MAX_COMPARE) {
      setLimitMessage(`You can compare up to ${MAX_COMPARE} garages. Untick one first.`);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  function scrollToFirstGarage(event) {
    event.preventDefault();
    const row = event.currentTarget.closest("section")?.querySelector("[data-track]");
    row?.scrollTo({ left: 0, behavior: "smooth" });
  }

  return (
    <section id="garages" className={styles.section}>
      <div className={`wrap ${styles.layout}`}>

        {/* LEFT SIDE */}
        <div className={styles.intro}>
          <h2>Featured Garages</h2>
          <p>Top-rated workshops,<br />verified for your peace of mind.</p>

          <a href="#garages" className={`btn line ${styles.viewAllButton}`} onClick={scrollToFirstGarage}>
            View All Garages <Icon name="arrow" size={18} sw={2.2} />
          </a>

          {note && <p className={styles.note}>{note}</p>}

          {/* COMPARE BOX */}
          <div className={styles.compareBox}>
            <b>Compare garages ({selected.length}/{MAX_COMPARE})</b>
            {selected.length === 0 && <p className={styles.compareHint}>Tick “Compare” on up to 3 garages to see them side by side.</p>}
            {selected.length > 0 && (
              <ul>{selected.map((g) => <li key={g.id}>{g.name}</li>)}</ul>
            )}
            {limitMessage && <p className={styles.warn}>{limitMessage}</p>}
            <div className={styles.compareActions}>
              <button
                type="button"
                className={styles.compareBtn}
                disabled={selected.length < 2}
                onClick={() => setShowCompare(true)}
              >
                Compare now
              </button>
              {selected.length > 0 && (
                <button type="button" className={styles.clearLink} onClick={() => { setSelectedIds([]); setLimitMessage(""); }}>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: cards */}
        <Slider variant="garages" label="garages">
          {garages.map((garage, index) => (
            <GarageCard
              key={garage.id}
              garage={garage}
              photoNumber={index + 1}
              onOpen={() => open(garage.id)}
              onBook={() => router.push(`/book?garage=${garage.id}`)}
              selected={selectedIds.includes(garage.id)}
              onToggle={() => toggle(garage.id)}
            />
          ))}
        </Slider>
      </div>

      {showCompare && selected.length >= 2 && (
        <CompareModal list={selected} onClose={() => setShowCompare(false)} goTab={goTab} />
      )}
    </section>
  );
}