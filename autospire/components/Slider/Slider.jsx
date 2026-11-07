"use client";
import { useRef } from "react";
import Icon from "@/components/Icon/Icon";
import styles from "./Slider.module.css";

// variant = "services" | "garages" | "reviews" (each has its own rules in Slider.module.css)
export default function Slider({ children, variant = "services", label = "" }) {
  const trackRef = useRef(null);

  // Scrolls the track left (-1) or right (+1) by exactly one card
  function scrollByOneCard(direction) {
    const track = trackRef.current;
    if (!track || !track.firstChild) return;

    const trackStyle = getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
    const cardWidth = track.firstChild.offsetWidth;

    track.scrollBy({ left: direction * (cardWidth + gap), behavior: "smooth" });
  }

  return (
    <div className={`${styles.slider} ${styles[variant]}`}>
      <button
        className={`${styles.arr} ${styles.prev}`}
        onClick={() => scrollByOneCard(-1)}
        aria-label={`Previous ${label}`}
      >
        <Icon name="left" size={20} sw={2.2} />
      </button>

      {/* data-track lets other components find the scrolling row (used by "View All Garages") */}
      <div className={styles.track} ref={trackRef} data-track>
        {children}
      </div>

      <button
        className={`${styles.arr} ${styles.next}`}
        onClick={() => scrollByOneCard(1)}
        aria-label={`Next ${label}`}
      >
        <Icon name="right" size={20} sw={2.2} />
      </button>
    </div>
  );
}