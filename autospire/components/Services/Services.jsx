"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Slider from "@/components/Slider/Slider";
import { services } from "@/lib/data";
import { makeCx } from "@/lib/cx";
import styles from "./Services.module.css";
const cx = makeCx(styles);

export default function Services({ open }) {
  const [all, setAll] = useState(false);
  const cards = services.map((s) => (
    <button key={s.id} className={cx("scard")} onClick={() => open(s.id)}>
      <Icon name={s.icon} size={42} sw={1.4} /><span>{s.title}</span>
    </button>
  ));
  return (
    <section id="services" className={cx("svc")}>
      <div className={cx("wrap svrow")}>
        <div className={cx("svintro")}>
          <h2>Popular Services</h2>
          <p>Everything your car needs,<br />all in one place.</p>
          <button className={cx("btn line browse")} onClick={() => setAll(!all)}>{all ? "Show Less" : "Browse All Services"} <Icon name={all ? "left" : "arrow"} size={18} sw={2.2} /></button>
        </div>
        {all ? <div className={cx("sgrid")}>{cards}</div> : <Slider variant="services" label="services">{cards}</Slider>}
      </div>
    </section>
  );
}