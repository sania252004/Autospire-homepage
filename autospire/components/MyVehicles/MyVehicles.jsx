"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import { carModels, carMakes, carYears } from "@/lib/data";
import { pageBanner, quickActions, tabs, initialVehicles, goodHands } from "@/lib/myVehiclesData";
import {
  BODY_TYPES, km, money, todayISO, fmtDate,
  remindersOf, attentionCount, timelineOf,
} from "@/lib/vehicleHelpers";
import styles from "./MyVehicles.module.css";

const DOC_CATEGORIES = ["Registration", "Insurance", "Inspection report", "Invoice", "Other"];
const MAX_PHOTO_MB = 3;

/* ---------- PRESET CAR PICTURE (drawn by code, no image files needed) ---------- */
const BODY_PATHS = {
  suv:       "M10 56 L18 40 Q24 30 44 28 L60 14 Q64 10 72 10 L146 10 Q156 10 162 18 L172 34 L184 38 Q192 42 192 52 L192 60 L10 60 Z",
  sedan:     "M10 56 L18 42 Q24 34 46 32 L74 30 Q88 16 110 16 L138 18 Q152 22 160 34 L184 38 Q192 42 192 52 L192 60 L10 60 Z",
  hatchback: "M10 56 L18 42 Q24 34 46 32 L66 30 Q76 16 96 14 L136 14 Q148 14 152 26 L164 34 L184 38 Q192 42 192 52 L192 60 L10 60 Z",
  pickup:    "M10 56 L18 40 Q22 32 40 30 L56 28 Q64 14 82 14 L100 14 Q108 14 112 24 L114 30 L192 30 L192 60 L10 60 Z",
};

function CarArt({ type, className = "" }) {
  return (
    <svg viewBox="0 0 200 80" className={`${styles.carArt} ${className}`} role="img" aria-label={`${BODY_TYPES[type] || "Car"} picture`}>
      <path d={BODY_PATHS[type] || BODY_PATHS.sedan} fill="#0f56a3" />
      <circle cx="50" cy="60" r="12" fill="#0a2342" /><circle cx="50" cy="60" r="5" fill="#9db2c9" />
      <circle cx="152" cy="60" r="12" fill="#0a2342" /><circle cx="152" cy="60" r="5" fill="#9db2c9" />
    </svg>
  );
}

/* the uploaded photo if there is one, otherwise the preset picture */
function Picture({ v, className }) {
  if (v.photo) return <img src={v.photo} alt={`${v.make} ${v.model}`} className={className} />;
  return <CarArt type={v.type} className={className} />;
}

/* reads a picture file and returns it as text the page can show */
function readPicture(file, done, fail) {
  if (!file) return;
  if (!file.type.startsWith("image/")) return fail("Please choose an image file (JPG, PNG or WebP).");
  if (file.size > MAX_PHOTO_MB * 1024 * 1024) return fail(`Picture is too large. Maximum ${MAX_PHOTO_MB} MB.`);
  const reader = new FileReader();
  reader.onload = () => done(reader.result);
  reader.readAsDataURL(file);
}

/* ---------- 1) BANNER ---------- */
function PageBanner({ onAdd }) {
  return (
    <section className={styles.banner}>
      {pageBanner.image && (
        <div className={styles.bannerPicture} style={{ backgroundImage: `url(${pageBanner.image})` }} />
      )}
      <div className={styles.bannerText}>
        <h1>{pageBanner.title}</h1>
        <p>{pageBanner.line1}<br />{pageBanner.line2}</p>
      </div>
      <button className={styles.addButton} onClick={onAdd}>
        <Icon name="plus" size={20} sw={2} /> Add Vehicle
      </button>
    </section>
  );
}

/* ---------- 2) VEHICLE SWITCHER ---------- */
function Switcher({ list, activeId, onSelect }) {
  return (
    <div className={styles.switcher} role="tablist" aria-label="Your vehicles">
      {list.map((v) => {
        const n = attentionCount(v);
        return (
          <button
            key={v.id}
            role="tab"
            aria-selected={v.id === activeId}
            className={`${styles.switchCard} ${v.id === activeId ? styles.switchOn : ""}`}
            onClick={() => onSelect(v.id)}
          >
            <Picture v={v} className={styles.switchThumb} />
            <span className={styles.switchText}><b>{v.make} {v.model}</b><small>{v.year} • {v.reg}</small></span>
            {n > 0 && <span className={styles.alertDot} title={`${n} reminder${n > 1 ? "s" : ""} need attention`}>{n}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- 3) ADD VEHICLE FORM ---------- */
function AddVehicleForm({ onAdd, onCancel }) {
  const [f, setF] = useState({ make: "", model: "", year: "", type: "suv", reg: "", mileage: "", insuranceExpiry: "", registrationExpiry: "", photo: "" });
  const [error, setError] = useState("");
  const set = (key, value) => setF((old) => ({ ...old, [key]: value }));

  function submit(e) {
    e.preventDefault();
    if (!f.make || !f.model || !f.year) return setError("Please choose the make, model and year.");
    if (!f.reg.trim()) return setError("Please enter the registration number.");
    const mileage = Number(f.mileage) || 0;
    onAdd({
      id: Date.now(), make: f.make, model: f.model, year: Number(f.year), type: f.type, city: "Dubai",
      reg: f.reg.trim(), photo: f.photo, primary: false,
      mileage, lastServiceKm: mileage, intervalKm: 10000,
      insuranceExpiry: f.insuranceExpiry, registrationExpiry: f.registrationExpiry,
      nextService: null,
      mileageLog: mileage > 0 ? [{ date: todayISO(), km: mileage }] : [],
      services: [], tyres: [], batteries: [], inspections: [], documents: [],
    });
  }

  return (
    <form className={`${styles.card} ${styles.addForm}`} onSubmit={submit}>
      <div className={styles.cardHead}><h3>Add a vehicle</h3><button type="button" className={styles.viewAll} onClick={onCancel}>Cancel</button></div>

      <div className={styles.formGrid}>
        <label className={styles.field}>Make
          <select value={f.make} onChange={(e) => { set("make", e.target.value); set("model", ""); }}>
            <option value="">Select make</option>
            {carMakes.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label className={styles.field}>Model
          <select value={f.model} onChange={(e) => set("model", e.target.value)} disabled={!f.make}>
            <option value="">Select model</option>
            {(carModels[f.make] || []).map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label className={styles.field}>Year
          <select value={f.year} onChange={(e) => set("year", e.target.value)}>
            <option value="">Select year</option>
            {carYears.map((y) => <option key={y}>{y}</option>)}
          </select>
        </label>
        <label className={styles.field}>Registration number
          <input value={f.reg} onChange={(e) => set("reg", e.target.value)} placeholder="e.g. Dubai • A 12345" />
        </label>
        <label className={styles.field}>Current mileage (km)
          <input type="number" min="0" value={f.mileage} onChange={(e) => set("mileage", e.target.value)} placeholder="e.g. 45000" />
        </label>
        <label className={styles.field}>Body type (preset picture)
          <select value={f.type} onChange={(e) => set("type", e.target.value)}>
            {Object.entries(BODY_TYPES).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </label>
        <label className={styles.field}>Insurance expiry
          <input type="date" value={f.insuranceExpiry} onChange={(e) => set("insuranceExpiry", e.target.value)} />
        </label>
        <label className={styles.field}>Registration / RTA expiry
          <input type="date" value={f.registrationExpiry} onChange={(e) => set("registrationExpiry", e.target.value)} />
        </label>
        <label className={styles.field}>Your own photo (optional)
          <input type="file" accept="image/*" onChange={(e) => readPicture(e.target.files[0], (data) => { set("photo", data); setError(""); }, setError)} />
        </label>
      </div>

      {f.photo && <img src={f.photo} alt="Preview" className={styles.preview} />}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.navyButton} type="submit">Save vehicle</button>
    </form>
  );
}

/* ---------- 4) THE MAIN VEHICLE CARD ---------- */
function VehicleCard({ v, canRemove, onChange, onRemove }) {
  const [copied, setCopied] = useState(false);
  const [kmInput, setKmInput] = useState("");
  const [kmMessage, setKmMessage] = useState({ text: "", bad: false });
  const [showPhoto, setShowPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const reminders = remindersOf(v);
  const serviceKm = reminders.find((r) => r.key === "km");

  function copyRegistration() {
    navigator.clipboard?.writeText(v.reg);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function updateMileage(e) {
    e.preventDefault();
    const n = Number(kmInput);
    if (!n || n < v.mileage) {
      setKmMessage({ text: `Enter a reading of ${km(v.mileage)} or more.`, bad: true });
      return;
    }
    onChange((x) => ({ ...x, mileage: n, mileageLog: [...x.mileageLog, { date: todayISO(), km: n }] }));
    setKmInput("");
    setKmMessage({ text: "Mileage updated. Reminders recalculated.", bad: false });
  }

  return (
    <section className={`${styles.card} ${styles.vehicleCard}`}>

      {/* COLUMN 1: picture */}
      <Picture v={v} className={styles.carPicture} />

      {/* COLUMN 2: details */}
      <div>
        {v.primary && (
          <span className={styles.primaryBadge}>
            <span className={styles.badgeCheck}><Icon name="check" size={13} sw={3} /></span>
            Primary Vehicle
          </span>
        )}
        <h2 className={styles.vehicleName}>{v.make} {v.model}</h2>
        <p className={styles.vehicleDetails}>{v.year} • {BODY_TYPES[v.type]} • {v.city}</p>

        <div className={styles.facts}>
          <div className={styles.fact}>
            <small>Registration No.</small>
            <b>
              {v.reg}
              <button className={styles.copyButton} onClick={copyRegistration} aria-label="Copy registration number">
                <Icon name={copied ? "check" : "copy"} size={18} sw={1.8} />
              </button>
            </b>
          </div>
          <div className={styles.fact}>
            <small>Mileage</small>
            <b><Icon name="car" size={20} sw={1.6} /> {km(v.mileage)}</b>
          </div>
          <div className={styles.fact}>
            <small>Next service</small>
            <b>
              {v.nextService ? fmtDate(v.nextService.date) : km(v.lastServiceKm + v.intervalKm)}
              <span className={`${styles.pill} ${styles[serviceKm.level]}`}>{serviceKm.pill}</span>
            </b>
          </div>
        </div>
      </div>

      {/* COLUMN 3: quick buttons */}
      <div className={styles.actions}>
        {quickActions.map((action) => (
          <a key={action.label} href={action.href} className={styles.action}>
            <Icon name={action.icon} size={32} sw={1.5} />
            <span>{action.label}</span>
            <Icon name="right" size={18} sw={2} />
          </a>
        ))}
      </div>

      {/* TOOLS ROW: update mileage, change picture, remove */}
      <div className={styles.cardTools}>
        <form className={styles.inlineForm} onSubmit={updateMileage}>
          <label htmlFor={`km-${v.id}`}>Update mileage</label>
          <input id={`km-${v.id}`} type="number" min="0" value={kmInput} onChange={(e) => setKmInput(e.target.value)} placeholder={`Now ${v.mileage.toLocaleString("en-US")}`} />
          <button type="submit" className={styles.smallBtn}>Save</button>
          {kmMessage.text && <span className={kmMessage.bad ? styles.error : styles.okText}>{kmMessage.text}</span>}
        </form>

        <div className={styles.toolButtons}>
          <button className={styles.ghostBtn} onClick={() => setShowPhoto(!showPhoto)} aria-expanded={showPhoto}>
            <Icon name="plus" size={16} sw={2} /> Change picture
          </button>
          {canRemove && (
            <button className={`${styles.ghostBtn} ${styles.dangerBtn}`} onClick={onRemove}>Remove vehicle</button>
          )}
        </div>

        {showPhoto && (
          <div className={styles.photoPanel}>
            <div>
              <b>Upload your own photo</b>
              <input type="file" accept="image/*" onChange={(e) => readPicture(e.target.files[0], (data) => { onChange((x) => ({ ...x, photo: data })); setPhotoError(""); }, setPhotoError)} />
              <small>JPG, PNG or WebP, up to {MAX_PHOTO_MB} MB.</small>
            </div>
            <div>
              <b>Or choose a preset</b>
              <div className={styles.presetRow}>
                {Object.entries(BODY_TYPES).map(([id, label]) => (
                  <button
                    key={id}
                    className={`${styles.preset} ${!v.photo && v.type === id ? styles.presetOn : ""}`}
                    onClick={() => onChange((x) => ({ ...x, photo: "", type: id }))}
                    aria-pressed={!v.photo && v.type === id}
                  >
                    <CarArt type={id} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            {photoError && <p className={styles.error} role="alert">{photoError}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- 5) TABS ---------- */
function Tabs({ active, onSelect }) {
  return (
    <div id="dashboard-tabs" className={styles.tabs} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={tab.id === active}
          className={`${styles.tab} ${tab.id === active ? styles.tabActive : ""}`}
          onClick={() => onSelect(tab.id)}
        >
          <Icon name={tab.icon} size={22} sw={1.6} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- 6a) TIMELINE ---------- */
const TIMELINE_META = {
  service:    { icon: "servicing", label: "Service" },
  tyres:      { icon: "tyres",     label: "Tyres" },
  battery:    { icon: "battery",   label: "Battery" },
  inspection: { icon: "diagnostics", label: "Inspection" },
  mileage:    { icon: "car",       label: "Mileage" },
  upcoming:   { icon: "calendar",  label: "Upcoming" },
};

function Timeline({ v }) {
  const items = timelineOf(v);
  return (
    <section className={styles.card}>
      <div className={styles.cardHead}><h3>Maintenance Timeline</h3></div>
      {items.length === 0 && <p className={styles.empty}>Nothing recorded yet. Services, tyres, battery changes and inspections will appear here.</p>}
      <ol className={styles.timeline}>
        {items.map((item) => {
          const meta = TIMELINE_META[item.type];
          return (
            <li key={item.id} className={`${styles.tlItem} ${styles["tl_" + item.type]}`}>
              <span className={styles.tlDot}><Icon name={meta.icon} size={18} sw={1.8} /></span>
              <div className={styles.tlBody}>
                <div className={styles.tlTop}>
                  <b>{item.title}</b>
                  <span className={styles.tlTag}>{meta.label}</span>
                </div>
                <small>{fmtDate(item.date)}{item.sub ? ` · ${item.sub}` : ""}</small>
              </div>
              {item.price != null && <b className={styles.rowPrice}>{money(item.price)}</b>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------- 6b) SERVICE HISTORY ---------- */
function ServiceHistory({ v, onOpenDocs }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHead}><h3>Service History</h3></div>
      {v.services.length === 0 && <p className={styles.empty}>No services recorded yet. Book your first service from the buttons above.</p>}
      {v.services.map((s) => (
        <div key={s.id} className={styles.recRow}>
          <div className={styles.recMain}>
            <div className={styles.rowTitle}>{s.title}</div>
            <div className={styles.rowSub}>{fmtDate(s.date)} • {s.garage} • {km(s.km)}</div>
            <div className={styles.docTags}>
              {s.invoice && <button className={styles.docTag} onClick={() => onOpenDocs("Invoice")}>Invoice</button>}
              {s.report && <button className={styles.docTag} onClick={() => onOpenDocs("Inspection report")}>Inspection report</button>}
            </div>
          </div>
          <b className={styles.rowPrice}>{money(s.price)}</b>
        </div>
      ))}
    </section>
  );
}

/* ---------- 6c) TYRES & BATTERY ---------- */
function RecordForm({ placeholder, onAdd }) {
  const [f, setF] = useState({ date: todayISO(), detail: "", garage: "", km: "", price: "" });
  const [error, setError] = useState("");
  const set = (key, value) => setF((old) => ({ ...old, [key]: value }));

  function submit(e) {
    e.preventDefault();
    if (!f.date || !f.detail.trim()) return setError("Please enter the date and what was fitted.");
    onAdd({ id: Date.now(), date: f.date, detail: f.detail.trim(), garage: f.garage.trim() || "Not specified", km: Number(f.km) || 0, price: Number(f.price) || 0, warranty: "" });
    setF({ date: todayISO(), detail: "", garage: "", km: "", price: "" });
    setError("");
  }

  return (
    <form className={styles.recForm} onSubmit={submit}>
      <input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} aria-label="Date" />
      <input value={f.detail} onChange={(e) => set("detail", e.target.value)} placeholder={placeholder} aria-label="What was fitted" />
      <input value={f.garage} onChange={(e) => set("garage", e.target.value)} placeholder="Garage" aria-label="Garage" />
      <input type="number" min="0" value={f.km} onChange={(e) => set("km", e.target.value)} placeholder="Mileage (km)" aria-label="Mileage" />
      <input type="number" min="0" value={f.price} onChange={(e) => set("price", e.target.value)} placeholder="Price (AED)" aria-label="Price" />
      <button type="submit" className={styles.smallBtn}>Add record</button>
      {error && <span className={styles.error}>{error}</span>}
    </form>
  );
}

function RecordList({ title, icon, rows, placeholder, onAdd }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHead}><h3 className={styles.smallTitle}><Icon name={icon} size={28} sw={1.6} /> {title}</h3></div>
      {rows.length === 0 && <p className={styles.empty}>No records yet.</p>}
      {[...rows].sort((a, b) => b.date.localeCompare(a.date)).map((r) => (
        <div key={r.id} className={styles.recRow}>
          <div className={styles.recMain}>
            <div className={styles.rowTitle}>{r.detail}</div>
            <div className={styles.rowSub}>{fmtDate(r.date)} • {r.garage}{r.km ? ` • ${km(r.km)}` : ""}{r.warranty ? ` • Warranty: ${r.warranty}` : ""}</div>
          </div>
          {r.price > 0 && <b className={styles.rowPrice}>{money(r.price)}</b>}
        </div>
      ))}
      <RecordForm placeholder={placeholder} onAdd={onAdd} />
    </section>
  );
}

function TyresBattery({ v, onChange }) {
  return (
    <div className={styles.twoColumns}>
      <RecordList
        title="Tyre replacement history" icon="tyres" rows={v.tyres} placeholder="e.g. 4 × Michelin 235/60 R18"
        onAdd={(r) => onChange((x) => ({ ...x, tyres: [...x.tyres, r] }))}
      />
      <RecordList
        title="Battery replacement history" icon="battery" rows={v.batteries} placeholder="e.g. Varta 80Ah AGM"
        onAdd={(r) => onChange((x) => ({ ...x, batteries: [...x.batteries, r] }))}
      />
    </div>
  );
}

/* ---------- 6d) DOCUMENTS ---------- */
function Documents({ v, filter, setFilter, onChange }) {
  const [category, setCategory] = useState("Registration");
  const [error, setError] = useState("");

  const shown = filter === "All" ? v.documents : v.documents.filter((d) => d.category === filter);

  function upload(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return setError("File is too large. Maximum 10 MB.");
    setError("");
    const doc = { id: Date.now(), category, name: file.name, size: Math.max(1, Math.round(file.size / 1024)), date: todayISO(), url: URL.createObjectURL(file) };
    onChange((x) => ({ ...x, documents: [doc, ...x.documents] }));
  }

  return (
    <section className={styles.card}>
      <div className={styles.cardHead}><h3><Icon name="document" size={30} sw={1.5} /> Vehicle Documents</h3></div>

      <div className={styles.uploadRow}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Document type">
          {DOC_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className={styles.uploadBtn}>
          <Icon name="plus" size={16} sw={2} /> Upload document
          <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={upload} hidden />
        </label>
        {error && <span className={styles.error}>{error}</span>}
      </div>

      <div className={styles.filters}>
        {["All", ...DOC_CATEGORIES].map((c) => (
          <button key={c} className={`${styles.chip} ${filter === c ? styles.chipOn : ""}`} onClick={() => setFilter(c)} aria-pressed={filter === c}>
            {c}
          </button>
        ))}
      </div>

      {shown.length === 0 && <p className={styles.empty}>No documents in this category yet.</p>}
      {shown.map((d) => (
        <div key={d.id} className={styles.fileRow}>
          <span className={styles.fileIcon}><Icon name="document" size={22} sw={1.6} /></span>
          <div className={styles.recMain}>
            <div className={styles.rowTitle}>{d.name}</div>
            <div className={styles.rowSub}>{d.category} • {fmtDate(d.date)} • {d.size} KB</div>
          </div>
          {d.url
            ? <a className={styles.smallBtn} href={d.url} target="_blank" rel="noreferrer">View</a>
            : <span className={styles.sample}>Sample</span>}
          <button className={styles.ghostBtn} onClick={() => onChange((x) => ({ ...x, documents: x.documents.filter((y) => y.id !== d.id) }))}>Delete</button>
        </div>
      ))}
    </section>
  );
}

/* ---------- 6e) REMINDERS ---------- */
function Reminders({ v, onChange }) {
  const [editing, setEditing] = useState(null);   // key of the reminder being renewed
  const [date, setDate] = useState("");
  const list = remindersOf(v);

  function save(field) {
    if (!date) return;
    onChange((x) => ({ ...x, [field]: date }));
    setEditing(null);
    setDate("");
  }

  return (
    <section className={styles.card}>
      <div className={styles.cardHead}><h3><Icon name="bell" size={30} sw={1.5} /> Reminders</h3></div>

      {list.map((r) => (
        <div key={r.key} className={styles.reminderRow}>
          <span className={styles.fileIcon}><Icon name={r.icon} size={22} sw={1.6} /></span>
          <div className={styles.recMain}>
            <div className={styles.rowTitle}>{r.title}</div>
            <div className={styles.rowSub}>{r.detail}</div>
          </div>
          <span className={`${styles.pill} ${styles[r.level]}`}>{r.pill}</span>

          {r.action === "book" && <a href="/#top" className={styles.smallBtn}>Book Now</a>}
          {r.action === "renew" && editing !== r.key && (
            <button className={styles.smallBtn} onClick={() => { setEditing(r.key); setDate(""); }}>Mark renewed</button>
          )}
          {editing === r.key && (
            <span className={styles.renewForm}>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="New expiry date" />
              <button className={styles.smallBtn} onClick={() => save(r.field)}>Save</button>
              <button className={styles.ghostBtn} onClick={() => setEditing(null)}>Cancel</button>
            </span>
          )}
        </div>
      ))}

      <div className={styles.intervalRow}>
        <label htmlFor={`interval-${v.id}`}>Remind me to service every</label>
        <select id={`interval-${v.id}`} value={v.intervalKm} onChange={(e) => onChange((x) => ({ ...x, intervalKm: Number(e.target.value) }))}>
          {[5000, 7500, 10000, 15000].map((n) => <option key={n} value={n}>{n.toLocaleString("en-US")} km</option>)}
        </select>
      </div>
      <p className={styles.hint}>You'll be alerted 1,000 km before a service is due, and 30 days before insurance or registration expires.</p>
    </section>
  );
}

/* ---------- 7) QUICK STATS + GOOD HANDS ---------- */
function QuickStats({ v }) {
  const spent = [...v.services, ...v.tyres, ...v.batteries].reduce((sum, r) => sum + (r.price || 0), 0);
  const stats = [
    { icon: "servicing", value: String(v.services.length), label: "Services done" },
    { icon: "document",  value: money(spent),              label: "Total spent" },
    { icon: "car",       value: km(v.mileage),             label: "Current mileage" },
  ];
  return (
    <section className={styles.card}>
      <div className={styles.cardHead}><h3 className={styles.smallTitle}><Icon name="bars" size={28} sw={2} /> Quick Stats</h3></div>
      <div className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span style={{ color: "#0f56a3" }}><Icon name={s.icon} size={30} sw={1.6} /></span>
            <b className={styles.statValue}>{s.value}</b>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

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

/* ---------- THE WHOLE PAGE ---------- */
export default function MyVehicles() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [activeId, setActiveId] = useState(initialVehicles[0].id);
  const [tab, setTab] = useState("timeline");
  const [docFilter, setDocFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);

  const v = vehicles.find((x) => x.id === activeId) || vehicles[0];
  const attention = remindersOf(v).filter((r) => r.level !== "ok");

  /* change the vehicle that is open: change((old) => ({ ...old, mileage: 123 })) */
  const change = (fn) => setVehicles((list) => list.map((x) => (x.id === v.id ? fn(x) : x)));

  function addVehicle(newVehicle) {
    setVehicles((list) => [...list, newVehicle]);
    setActiveId(newVehicle.id);
    setTab("timeline");
    setShowAdd(false);
  }

  function removeVehicle() {
    if (!window.confirm(`Remove ${v.make} ${v.model} and all its records?`)) return;
    const rest = vehicles.filter((x) => x.id !== v.id);
    setVehicles(rest);
    setActiveId(rest[0].id);
  }

  function openDocs(category) {
    setDocFilter(category);
    setTab("documents");
    document.getElementById("dashboard-tabs")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <PageBanner onAdd={() => setShowAdd(true)} />

      <div className={styles.page}>
        <Switcher list={vehicles} activeId={v.id} onSelect={(id) => { setActiveId(id); setDocFilter("All"); }} />

        {showAdd && <AddVehicleForm onAdd={addVehicle} onCancel={() => setShowAdd(false)} />}

        <VehicleCard v={v} canRemove={vehicles.length > 1} onChange={change} onRemove={removeVehicle} />

        {/* needs-attention strip */}
        {attention.length > 0 && (
          <button className={styles.alertStrip} onClick={() => setTab("reminders")}>
            <Icon name="bell" size={22} sw={1.8} />
            <span><b>{attention.length} reminder{attention.length > 1 ? "s" : ""} need attention:</b> {attention.map((r) => `${r.title} (${r.pill})`).join(" · ")}</span>
            <Icon name="right" size={18} sw={2} />
          </button>
        )}

        <Tabs active={tab} onSelect={setTab} />

        {tab === "timeline"  && <Timeline v={v} />}
        {tab === "service"   && <ServiceHistory v={v} onOpenDocs={openDocs} />}
        {tab === "tyres"     && <TyresBattery v={v} onChange={change} />}
        {tab === "documents" && <Documents v={v} filter={docFilter} setFilter={setDocFilter} onChange={change} />}
        {tab === "reminders" && <Reminders v={v} onChange={change} />}

        <div className={styles.twoColumns}>
          <QuickStats v={v} />
          <GoodHands />
        </div>
      </div>
    </>
  );
}