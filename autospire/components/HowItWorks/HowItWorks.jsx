import Icon from "@/components/Icon/Icon";
import Slider from "@/components/Slider/Slider";
import { steps, reviews } from "@/lib/data";
import { makeCx } from "@/lib/cx";
import styles from "./HowItWorks.module.css";
const cx = makeCx(styles);
export default function HowItWorks() {
  return (
    <section id="how" className={cx("how")}>
      <div className={cx("wrap hwrow")}>
        <div className={cx("hwintro")}><h2>How It Works</h2><p>Get your car serviced<br />in just a few simple steps.</p></div>
        <div className={cx("steps")}>
          {steps.map(([ic, a, b], i) => (
            <div key={a} className={cx("step")}>
              <span className={cx("sico")}><span className={cx("snum")}>{i + 1}</span><Icon name={ic} size={30} sw={1.5} /></span>
              <span className={cx("stxt")}>{a}<br />{b}</span>
            </div>
          ))}
        </div>
        <div className={cx("rev-box")}>
          <h3 className={cx("rtitle")}>Reviews</h3>
          <Slider variant="reviews" label="reviews">
            {reviews.map((r) => (
              <figure key={r.name} className={cx("rev")}>
                <div className={cx("rt")}>
                  <blockquote>{r.text}</blockquote>
                  <b className={cx("rn")}>{r.name}</b>
                  <span className={cx("stars")}>{[0, 1, 2, 3, 4].map((n) => <Icon key={n} name="star" size={15} fill="#f5a623" sw={0} />)}</span>
                </div>
                <span className={cx("av")}>{r.name[0]}</span>
              </figure>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}