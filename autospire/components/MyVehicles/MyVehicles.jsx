"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import {
  pageBanner, vehicle, quickActions, tabs, serviceHistory,
  upcomingService, document, stats, goodHands,
} from "@/lib/myVehiclesData";
import styles from "./MyVehicles.module.css";

/* ---------- A PICTURE SLOT ----------
   Shows the picture if a path was written in myVehiclesData.js.
   If the path is empty ("") it shows a blank grey box instead. */
function Picture({ src, alt, className }) {
  if (!src) return <div className={`${styles.emptyPicture} ${className}`} />;
  return <img src={src} alt={alt} className={className} />; 
}

/* ---------- 1) BLUE BANNER AT THE TOP ----------
   The skyline picture sits in its own box on the right side.
   The left side is plain dark blue, so the picture can never
   show behind the text. */
function PageBanner() {
  return (
    <section className={styles.banner}>

      {/* the picture (only shown if a path was written in myVehiclesData.js) */}
      {pageBanner.image && (
        <div className={styles.bannerPicture} style={{ backgroundImage: `url(${pageBanner.image})` }} />
      )}

      {/* title and text */}
      <div className={styles.bannerText}>
        <h1>{pageBanner.title}</h1>
        <p>{pageBanner.line1}<br />{pageBanner.line2}</p>
      </div>

      <button className={styles.addButton}>
        <Icon name="plus" size={20} sw={2} /> Add Vehicle
      </button>
    </section>
  );
}

/* ---------- 2) THE MAIN VEHICLE CARD ---------- */
function VehicleCard() {
  // true for 1.5 seconds after the registration number is copied
  const [copied, setCopied] = useState(false);

  function copyRegistration() {
    navigator.clipboard?.writeText(vehicle.registration);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className={`${styles.card} ${styles.vehicleCard}`}>

      {/* COLUMN 1: photo of the car */}
      <Picture src={vehicle.image} alt={vehicle.name} className={styles.carPicture} />

      {/* COLUMN 2: name and details */}
      <div>
        <span className={styles.primaryBadge}>
          <span className={styles.badgeCheck}><Icon name="check" size={13} sw={3} /></span>
          {vehicle.badge}
        </span>

        <h2 className={styles.vehicleName}>{vehicle.name}</h2>
        <p className={styles.vehicleDetails}>{vehicle.details}</p>

        <div className={styles.facts}>
          {/* registration number with a copy button */}
          <div className={styles.fact}>
            <small>Registration No.</small>
            <b>
              {vehicle.registration}
              <button className={styles.copyButton} onClick={copyRegistration} aria-label="Copy registration number">
                <Icon name={copied ? "check" : "copy"} size={18} sw={1.8} />
              </button>
            </b>
          </div>

          {/* next service date */}
          <div className={styles.fact}>
            <small>Next Service Due</small>
            <b>
              <Icon name="calendar" size={20} sw={1.6} />
              {vehicle.nextServiceDate}
              <span className={styles.daysPill}>{vehicle.nextServiceIn}</span>
            </b>
          </div>
        </div>
      </div>

      {/* COLUMN 3: the 4 quick buttons */}
      <div className={styles.actions}>
        {quickActions.map((action) => (
          <a key={action.label} href={action.href} className={styles.action}>
            <Icon name={action.icon} size={32} sw={1.5} />
            <span>{action.label}</span>
            <Icon name="right" size={18} sw={2} />
          </a>
        ))}
      </div>

    </section>
  );
}

/* ---------- 3) THE TABS ----------
   For now the tabs only change which one is highlighted.
   The two panels below always show the same content. */
function Tabs() {
  const [activeIndex, setActiveIndex] = useState(0); // 0 = the first tab

  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab.label}
          role="tab"
          aria-selected={index === activeIndex}
          className={`${styles.tab} ${index === activeIndex ? styles.tabActive : ""}`}
          onClick={() => setActiveIndex(index)}
        >
          <Icon name={tab.icon} size={22} sw={1.6} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- 4a) SERVICE HISTORY (left panel) ---------- */
function ServiceHistory() {
  return (
    <section id="service-history" className={styles.card}>
      <div className={styles.cardHead}>
        <h3>Service History</h3>
        <button className={styles.viewAll}>View All <Icon name="arrow" size={18} sw={2.2} /></button>
      </div>

      {serviceHistory.map((item) => (
        <div key={item.date} className={styles.row}>
          <Picture src={item.logo} alt={item.garage} className={styles.rowLogo} />
          <div>
            <div className={styles.rowTitle}>{item.title}</div>
            <div className={styles.rowSub}>{item.date} • {item.garage}</div>
          </div>
          <b className={styles.rowPrice}>{item.price}</b>
          <Icon name="right" size={20} sw={2} />
        </div>
      ))}
    </section>
  );
}

/* ---------- 4b) UPCOMING SERVICE (right panel) ---------- */
function UpcomingService() {
  return (
    <section className={`${styles.card} ${styles.upcoming}`}>
      <div className={styles.cardHead}>
        <h3><Icon name="calendar" size={30} sw={1.5} /> Upcoming Service</h3>
        <button className={styles.viewAll}>Manage Reminder <Icon name="arrow" size={18} sw={2.2} /></button>
      </div>

      {/* white card with the date, the service and the Book Now button */}
      <div className={styles.upcomingCard}>
        <div className={styles.dateBlock}>
          <div className={styles.dateMonth}>{upcomingService.month}</div>
          <div className={styles.dateDay}>{upcomingService.day}</div>
          <div className={styles.dateWeekday}>{upcomingService.weekday}</div>
        </div>

        <div>
          <div className={styles.upcomingTitle}>{upcomingService.title}</div>
          <div className={styles.upcomingGarage}>{upcomingService.garage}</div>
          <div className={styles.upcomingArea}><Icon name="pin" size={16} sw={1.8} /> {upcomingService.area}</div>
        </div>

        <div className={styles.upcomingRight}>
          <span className={styles.daysPill}>{upcomingService.daysLeft}</span>
          <a href="/#top" className={styles.navyButton}>Book Now <Icon name="arrow" size={18} sw={2.2} /></a>
        </div>
      </div>

      {/* reminder note */}
      <div className={styles.reminderNote}>
        <Icon name="info" size={22} sw={1.8} />
        {upcomingService.reminderText}
      </div>
    </section>
  );
}

/* ---------- 5a) VEHICLE DOCUMENTS ---------- */
function Documents() {
  return (
    <section className={styles.card}>
      <div className={styles.cardHead}>
        <h3 className={styles.smallTitle}><Icon name="document" size={30} sw={1.5} /> Vehicle Documents</h3>
        <button className={styles.viewAll}>View All <Icon name="arrow" size={18} sw={2.2} /></button>
      </div>

      <div className={styles.docRow}>
        <Picture src={document.image} alt={document.title} className={styles.docThumb} />
        <div>
          <div className={styles.docName}>{document.title}</div>
          <div className={styles.docValid}><Icon name="check" size={16} sw={3} /> {document.validUntil}</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5b) QUICK STATS ---------- */
function QuickStats() {
  return (
    <section className={styles.card}>
      <div className={styles.cardHead}>
        <h3 className={styles.smallTitle}><Icon name="bars" size={28} sw={2} /> Quick Stats</h3>
      </div>

      <div className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <span style={{ color: stat.color }}><Icon name={stat.icon} size={30} sw={1.6} fill={stat.fill} /></span>
            <b className={styles.statValue}>{stat.value}</b>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 5c) "GOOD HANDS" BANNER ----------
   One solid colour, no picture. The colour is set in MyVehicles.module.css (.goodHands). */
function GoodHands() {
  return (
    <section className={`${styles.card} ${styles.goodHands}`}>
      <span className={styles.goodHandsIcon}><Icon name="rta" size={64} sw={1.4} /></span>

      <div className={styles.goodHandsText}>
        <div className={styles.goodHandsTitle}>{goodHands.title}</div>
        <p>{goodHands.text}</p>
      </div>
    </section>
  );
}

/* ---------- THE WHOLE PAGE CONTENT ---------- */
export default function MyVehicles() {
  return (
    <>
      <PageBanner />

      <div className={styles.page}>
        <VehicleCard />
        <Tabs />

        <div className={styles.twoColumns}>
          <ServiceHistory />
          <UpcomingService />
        </div>

        <div className={styles.threeColumns}>
          <Documents />
          <QuickStats />
          <GoodHands />
        </div>
      </div>
    </>
  );
}