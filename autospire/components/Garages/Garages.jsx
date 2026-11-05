"use client";
import Icon from "@/components/Icon/Icon";
import Slider from "@/components/Slider/Slider";
import { garages } from "@/lib/data";
import { makeCx } from "@/lib/cx";
import styles from "./Garages.module.css";
const cx = makeCx(styles);

export default function Garages({ open, note }) {
  return (
    <section id="garages" className={cx("gar")}>
      <div className={cx("wrap grow")}>
        <div className={cx("gintro")}>
          <h2>Featured Garages</h2>
          <p>Top-rated workshops,<br />verified for your peace of mind.</p>
          <a
            href="#garages"
            className={cx("btn line viewAll")}
            onClick={(e) => {
              e.preventDefault();
              e.currentTarget.closest("section")?.querySelector("[data-track]")?.scrollTo({ left: 0, behavior: "smooth" });
            }}
          >
            View All Garages <Icon name="arrow" size={18} sw={2.2} />
          </a>
          {note && <p className={cx("gnote")}>{note}</p>}
        </div>
        <Slider variant="garages" label="garages">
          {garages.map((g, i) => (
            <button key={g.id} className={cx("gcard")} onClick={() => open(g.id)} aria-label={`Open ${g.name} profile`}>
              <span className={cx("gimg")} style={{ backgroundImage: `url(/images/garage-${i + 1}.jpg), linear-gradient(135deg,#2a5aa0,#0a2342)` }} />
              <span className={cx("gbody")}>
                <span className={cx("gtop")}><b>{g.name}</b><span className={cx("ver")}><Icon name="check" size={13} sw={3} /> Verified</span></span>
                <span className={cx("grate")}><Icon name="star" size={15} fill="#f5a623" sw={0} /> <b>{g.rating}</b> ({g.reviews} reviews)</span>
                <span className={cx("gloc")}><Icon name="pin" size={14} fill="currentColor" sw={0} /> {g.area}</span>
                <span className={cx("gfoot")}>From AED {g.from}<span className={cx("gar-go")}><Icon name="arrow" size={16} sw={2.4} /></span></span>
              </span>
            </button>
          ))}
        </Slider>
      </div>
    </section>
  );
}