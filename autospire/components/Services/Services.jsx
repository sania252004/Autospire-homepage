"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Slider from "@/components/Slider/Slider";
import { services } from "@/lib/data";
import styles from "./Services.module.css";

// "open" = a function from page.jsx that opens a service pop-up
export default function Services({ open }) {
  // false = slider with arrows, true = every service in a grid
  const [showAll, setShowAll] = useState(false);

  // One card per service. Clicking a card opens its pop-up.
  const cards = services.map((service) => (
    <button key={service.id} className={styles.card} onClick={() => open(service.id)}>
      <Icon name={service.icon} size={42} sw={1.4} />
      <span>{service.title}</span>
    </button>
  ));

  return (
    <section id="services" className={styles.section}>
      <div className={`wrap ${styles.layout}`}>

        {/* LEFT SIDE: title, text and button */}
        <div className={styles.intro}>
          <h2>Popular Services</h2>
          <p>Everything your car needs,<br />all in one place.</p>

          <button className={`btn line ${styles.browseButton}`} onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show Less" : "Browse All Services"}
            <Icon name={showAll ? "left" : "arrow"} size={18} sw={2.2} />
          </button>
        </div>

        {/* RIGHT SIDE: either the grid of all services or the slider */}
        {showAll ? (
          <div className={styles.allGrid}>{cards}</div>
        ) : (
          <Slider variant="services" label="services">{cards}</Slider>
        )}

      </div>
    </section>
  );
}