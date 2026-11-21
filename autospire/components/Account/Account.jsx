"use client";

import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import { account } from "@/lib/accountData";
import styles from "./Account.module.css";

/* ---------- SMALL HELPER FUNCTIONS ---------- */

// the name shown for each language code
const languageNames = { EN: "English", AR: "Arabic" };

// "2026-11-17T18:52:32.193Z"  becomes  "17 Nov 2026"
function formatDate(text) {
  return new Date(text).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}

// "PETROL"  becomes  "Petrol"
function niceText(text) {
  return text.charAt(0) + text.slice(1).toLowerCase();
}

function getInitials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

// Works out if a date is still valid, close to running out, or already passed.
// tone is used to pick the badge colour: "good" = green, "warn" = orange, "bad" = red
function expiryStatus(dateText) {
  const days = Math.ceil((new Date(dateText) - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { tone: "bad", text: "Expired" };
  if (days === 0) return { tone: "warn", text: "Expires today" };
  if (days <= 30) return { tone: "warn", text: `Expires in ${days} ${days === 1 ? "day" : "days"}` };
  return { tone: "good", text: "Valid" };
}

/* ---------- 1) BANNER AT THE TOP ---------- */
function PageBanner() {
  return (
    <section className={styles.banner}>
      <h1>My Account</h1>
      <p>Manage your profile and the vehicles saved to your account.</p>
    </section>
  );
}

/* ---------- ONE LINE OF PROFILE DETAILS: icon + small label + value ---------- */
function Field({ icon, label, children }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldIcon}><Icon name={icon} size={20} sw={1.6} /></span>
      <div>
        <span className={styles.fieldLabel}>{label}</span>
        <span className={styles.fieldValue}>{children}</span>
      </div>
    </div>
  );
}

/* ---------- 2) PROFILE CARD ---------- */
function ProfileCard() {
  const [profile, setProfile] = useState(account.profile); // the saved details
  const [isEditing, setIsEditing] = useState(false);       // true while the form is open
  const [form, setForm] = useState(account.profile);       // what is typed in the form

  // "Edit Profile" clicked: copy the saved details into the form and open it
  function startEditing() {
    setForm(profile);
    setIsEditing(true);
  }

  // runs every time something is typed in the form
  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  // "Save changes" clicked
  function saveProfile(event) {
    event.preventDefault();

    // a new mobile number has to be verified again
    const numberChanged = form.mobileNumber !== profile.mobileNumber;

    // TODO: send the form to your API here
    setProfile({ ...form, mobileVerified: numberChanged ? false : profile.mobileVerified });
    setIsEditing(false);
  }

  return (
    <section className={styles.card}>
      <div className={styles.cardHead}>
        <h2>Profile</h2>
        {!isEditing && (
          <button className={styles.outlineButton} onClick={startEditing}>Edit Profile</button>
        )}
      </div>

      <div className={styles.profile}>

        {/* LEFT: avatar, name and join date */}
        <div className={styles.profileLeft}>
          <span className={styles.bigAvatar}>{getInitials(profile.fullName)}</span>
          <h3>{profile.fullName}</h3>
          <p>Member since {formatDate(profile.createdAt)}</p>
        </div>

        {/* RIGHT: the details, or the form while editing */}
        {isEditing ? (
          <form className={styles.form} onSubmit={saveProfile}>
            <label>Full name
              <input name="fullName" value={form.fullName} onChange={handleChange} required />
            </label>
            <label>Email
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>Mobile number
              <input name="mobileNumber" type="tel" value={form.mobileNumber} onChange={handleChange} required />
            </label>
            <label>Preferred language
              <select name="preferredLanguage" value={form.preferredLanguage} onChange={handleChange}>
                {Object.keys(languageNames).map((code) => (
                  <option key={code} value={code}>{languageNames[code]}</option>
                ))}
              </select>
            </label>

            <div className={styles.formButtons}>
              <button type="submit" className={styles.solidButton}>Save changes</button>
              <button type="button" className={styles.outlineButton} onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className={styles.fieldGrid}>
            <Field icon="mail" label="Email">{profile.email}</Field>

            <Field icon="phone" label="Mobile number">
              {profile.mobileNumber}{" "}
              <span className={`${styles.pill} ${profile.mobileVerified ? styles.good : styles.warn}`}>
                {profile.mobileVerified ? "Verified" : "Not verified"}
              </span>
            </Field>

            <Field icon="user" label="Preferred language">{languageNames[profile.preferredLanguage]}</Field>
            <Field icon="document" label="Account ID">{profile.id}</Field>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- THE REGISTRATION / INSURANCE BOX inside a vehicle card ---------- */
function ExpiryBox({ icon, title, date }) {
  const status = expiryStatus(date);

  return (
    <div className={styles.expiryBox}>
      <Icon name={icon} size={24} sw={1.5} />
      <div>
        <span className={styles.expiryTitle}>{title}</span>
        <span className={styles.expiryDate}>{formatDate(date)}</span>
        {/* suppressHydrationWarning: "days left" is worked out from today's date,
            which can differ by a moment between the server and the browser */}
        <span className={`${styles.pill} ${styles[status.tone]}`} suppressHydrationWarning>{status.text}</span>
      </div>
    </div>
  );
}

/* ---------- ONE VEHICLE CARD ---------- */
function VehicleCard({ vehicle, onMakeDefault, onToggleArchive }) {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const photo = vehicle.photoUrls?.[0]; // the first picture (or nothing)

  // the small facts shown in a grid: [label, value]
  const details = [
    ["Colour", vehicle.color],
    ["Engine", vehicle.engine],
    ["Fuel", niceText(vehicle.fuelType)],
    ["Transmission", niceText(vehicle.transmission)],
    ["Odometer", `${vehicle.odometerKm.toLocaleString("en-US")} km`],
    ["VIN", vehicle.vin],
    ["Added on", formatDate(vehicle.createdAt)],
  ];

  return (
    <div className={`${styles.vehicle} ${vehicle.archived ? styles.archivedCard : ""}`}>

      {/* LEFT: picture (or a blank box with a car icon) */}
      {photo ? (
        <img src={photo} alt={title} className={styles.vehiclePhoto} />
      ) : (
        <div className={styles.noPhoto}><Icon name="car" size={44} sw={1.3} /></div>
      )}

      {/* RIGHT: all the details */}
      <div>

        {/* name and badges */}
        <div className={styles.vehicleTitleRow}>
          <h3 className={styles.vehicleTitle}>{title} <span className={styles.variant}>{vehicle.variant}</span></h3>
          {vehicle.defaultVehicle && <span className={`${styles.pill} ${styles.good}`}>Default vehicle</span>}
          {vehicle.archived && <span className={`${styles.pill} ${styles.neutral}`}>Archived</span>}
        </div>

        {/* number plate */}
        <span className={styles.plate}>
          {vehicle.plateEmirate} • {vehicle.plateCode} {vehicle.plateNumber}
        </span>

        {/* the grid of facts */}
        <div className={styles.detailsGrid}>
          {details.map(([label, value]) => (
            <div key={label}>
              <span className={styles.detailLabel}>{label}</span>
              <span className={styles.detailValue}>{value}</span>
            </div>
          ))}
        </div>

        {/* registration and insurance reminders */}
        <div className={styles.expiryRow}>
          <ExpiryBox icon="document" title="Registration" date={vehicle.registrationExpiry} />
          <ExpiryBox icon="rta" title="Insurance" date={vehicle.insuranceExpiry} />
        </div>

        {/* buttons (the default vehicle has none: make another one default first) */}
        <div className={styles.actions}>
          {!vehicle.defaultVehicle && !vehicle.archived && (
            <button className={styles.outlineButton} onClick={onMakeDefault}>Make default</button>
          )}
          {!vehicle.defaultVehicle && (
            <button className={styles.mutedButton} onClick={onToggleArchive}>
              {vehicle.archived ? "Restore" : "Archive"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- 3) SAVED VEHICLES ---------- */
function SavedVehicles() {
  const [vehicles, setVehicles] = useState(account.vehicles);
  const [showArchived, setShowArchived] = useState(false); // are archived vehicles visible?

  const activeVehicles = vehicles.filter((vehicle) => !vehicle.archived);
  const archivedVehicles = vehicles.filter((vehicle) => vehicle.archived);

  // active vehicles first, then the archived ones (only when "Show archived" is on)
  const shownVehicles = showArchived ? [...activeVehicles, ...archivedVehicles] : activeVehicles;

  // only one vehicle can be the default
  function makeDefault(id) {
    // TODO: tell your API
    setVehicles(vehicles.map((vehicle) => ({ ...vehicle, defaultVehicle: vehicle.id === id })));
  }

  // archive a vehicle, or restore it
  function toggleArchive(id) {
    // TODO: tell your API
    setVehicles(vehicles.map((vehicle) => (vehicle.id === id ? { ...vehicle, archived: !vehicle.archived } : vehicle)));
  }

  return (
    <section className={styles.card}>
      <div className={styles.cardHead}>
        <div>
          <h2>Saved Vehicles</h2>
          <p>{activeVehicles.length} active {activeVehicles.length === 1 ? "vehicle" : "vehicles"}</p>
        </div>

        {archivedVehicles.length > 0 && (
          <button className={styles.outlineButton} onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? "Hide archived" : `Show archived (${archivedVehicles.length})`}
          </button>
        )}
      </div>

      <div className={styles.vehicleList}>
        {shownVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onMakeDefault={() => makeDefault(vehicle.id)}
            onToggleArchive={() => toggleArchive(vehicle.id)}
          />
        ))}

        {shownVehicles.length === 0 && <p className={styles.empty}>No vehicles saved yet.</p>}
      </div>
    </section>
  );
}

/* ---------- THE WHOLE PAGE CONTENT ---------- */
export default function Account() {
  return (
    <>
      <PageBanner />

      <div className={styles.page}>
        <ProfileCard />
        <SavedVehicles />
      </div>
    </>
  );
}