"use client";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Dropdown from "@/components/Dropdown/Dropdown";
import { savedVehicles, vehicleLabel, carModels, carMakes, carYears } from "@/lib/data";
import styles from "./Hero.module.css";

/* Shows the customer's saved vehicles (primary one pre-selected).
   "Use a different vehicle" switches to make / model / year dropdowns.
   onChange receives a text like "2023 Mercedes-Benz GLC", or "" if incomplete. */
export default function VehiclePicker({ onChange }) {
  const primary = savedVehicles.find((v) => v.primary) || savedVehicles[0];

  const [mode, setMode] = useState(primary ? "saved" : "new");   // "saved" or "new"
  const [savedId, setSavedId] = useState(primary ? primary.id : null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const join = (y, mk, md) => (y && mk && md ? `${y} ${mk} ${md}` : "");

  function pickSaved(v) {
    setSavedId(v.id);
    onChange(vehicleLabel(v));
  }

  function showSaved() {
    setMode("saved");
    const v = savedVehicles.find((x) => x.id === savedId) || primary;
    onChange(vehicleLabel(v));
  }

  function showNew() {
    setMode("new");
    onChange(join(year, make, model));
  }

  function changeMake(value) {
    setMake(value);
    setModel("");                       // models depend on the make, so reset
    onChange("");
  }
  function changeModel(value) {
    setModel(value);
    onChange(join(year, make, value));
  }
  function changeYear(value) {
    setYear(value);
    onChange(join(value, make, model));
  }

  return (
    <div className={styles.vehicleBlock}>
      <div className={styles.pickerLabel}>
        <span>{mode === "saved" ? "Your vehicle" : "Vehicle details"}</span>
        {mode === "saved" && (
          <button type="button" className={styles.pickerLink} onClick={showNew}>Use a different vehicle</button>
        )}
        {mode === "new" && primary && (
          <button type="button" className={styles.pickerLink} onClick={showSaved}>Use my saved vehicles</button>
        )}
      </div>

      {mode === "saved" ? (
        <div className={styles.savedList}>
          {savedVehicles.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`${styles.savedCard} ${savedId === v.id ? styles.selected : ""}`}
              onClick={() => pickSaved(v)}
              aria-pressed={savedId === v.id}
            >
              <Icon name="car" size={28} sw={1.5} />
              <span>
                <span className={styles.savedName}>{vehicleLabel(v)}</span>
                <span className={styles.savedReg}>{v.reg}</span>
              </span>
              {savedId === v.id && <span className={styles.tick}><Icon name="check" size={13} sw={3} /></span>}
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.newVehicle}>
          <Dropdown icon="car" placeholder="Make" value={make} onChange={changeMake} options={carMakes} />
          <Dropdown icon="car" placeholder="Model" value={model} onChange={changeModel} options={make ? carModels[make] : []} />
          <Dropdown icon="calendar" placeholder="Year" value={year} onChange={changeYear} options={carYears} />
        </div>
      )}
    </div>
  );
}