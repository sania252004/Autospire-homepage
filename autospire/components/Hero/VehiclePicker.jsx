"use client";
import { useState, useEffect } from "react";
import Icon from "@/components/Icon/Icon";
import Dropdown from "@/components/Dropdown/Dropdown";
import { carMakes, carModels, carYears } from "@/lib/data";
import { useAuth } from "@/lib/authStore";
import styles from "./Hero.module.css";

const MAX_VEHICLES = 5;

const DEFAULT_SAVED = [
  { id: "v-1", year: "2023", make: "Mercedes-Benz", model: "GLC", reg: "Dubai • 12345" },
  { id: "v-2", year: "2020", make: "Toyota", model: "Land Cruiser", reg: "Dubai • A 67890" },
];

/* turns "2023 Mercedes-Benz GLC" into { year, make, model } */
function parseVehicle(text) {
  const str = typeof text === "string" ? text.trim() : "";
  const parts = str.split(" ");
  const year = /^\d{4}$/.test(parts[0]) ? parts[0] : "";
  const rest = year ? parts.slice(1).join(" ") : str;
  const make = carMakes.find((m) => rest.startsWith(m)) || "";
  const model = make ? rest.slice(make.length).trim() : "";
  return { year, make, model };
}

function formatVehicle(v) {
  if (!v || !v.year || !v.make || !v.model) return "";
  return `${v.year} ${v.make} ${v.model}`;
}

export default function VehiclePicker({ value = "", onChange }) {
  const { user } = useAuth();
  const parsed = parseVehicle(value);

  const [savedList, setSavedList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [mode, setMode] = useState("manual"); // "saved" | "add" | "manual"

  const [make, setMake] = useState(parsed.make);
  const [model, setModel] = useState(parsed.model);
  const [year, setYear] = useState(parsed.year);
  const [reg, setReg] = useState("");
  const [addError, setAddError] = useState("");

  useEffect(() => {
    if (!user) {
      setSavedList([]);
      setSelectedId("");
      setMode("manual");
      setMake("");
      setModel("");
      setYear("");
      onChange?.("");
      return;
    }

    const storageKey = `karevo_saved_vehicles_${user.id || user.email || "user"}`;
    let initial = [];
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) initial = list.slice(0, MAX_VEHICLES);
      } else if (Array.isArray(user.vehicles) && user.vehicles.length > 0) {
        initial = user.vehicles.slice(0, MAX_VEHICLES).map((v, i) => ({
          id: v.id || `v-${i}`,
          year: String(v.year || ""),
          make: v.make || "",
          model: v.model || "",
          reg: v.reg || `${v.plateEmirate || "Dubai"} • ${v.plateNumber || "Private"}`,
        }));
      } else {
        initial = DEFAULT_SAVED;
      }
    } catch {
      initial = DEFAULT_SAVED;
    }

    setSavedList(initial);
    if (initial.length > 0) {
      setSelectedId(initial[0].id);
      setMode("saved");
      onChange?.(formatVehicle(initial[0]));
    } else {
      setMode("add");
      onChange?.("");
    }
  }, [user]);

  function persist(nextList) {
    const capped = nextList.slice(0, MAX_VEHICLES);
    setSavedList(capped);
    if (!user) return;
    const storageKey = `karevo_saved_vehicles_${user.id || user.email || "user"}`;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(capped));
    } catch {}
  }

  function selectSaved(v) {
    setSelectedId(v.id);
    setMode("saved");
    setAddError("");
    onChange?.(formatVehicle(v));
  }

  function openAddForm() {
    if (savedList.length >= MAX_VEHICLES) return;
    setMake("");
    setModel("");
    setYear("");
    setReg("");
    setAddError("");
    setMode("add");
    onChange?.("");
  }

  function handleSaveNewVehicle() {
    if (savedList.length >= MAX_VEHICLES) {
      setAddError(`You can save up to ${MAX_VEHICLES} vehicles.`);
      return;
    }
    if (!make || !model || !year) {
      setAddError("Please select make, model, and year.");
      return;
    }

    const newVehicle = {
      id: `v-${Date.now()}`,
      year: String(year),
      make,
      model,
      reg: reg.trim() || "Dubai • Private",
    };

    const updated = [...savedList, newVehicle];
    persist(updated);
    setSelectedId(newVehicle.id);
    setMode("saved");
    setAddError("");
    onChange?.(formatVehicle(newVehicle));
  }

  function removeSavedVehicle(e, id) {
    e.stopPropagation();
    const updated = savedList.filter((v) => v.id !== id);
    persist(updated);

    if (updated.length === 0) {
      setSelectedId("");
      setMode("add");
      onChange?.("");
    } else if (selectedId === id) {
      setSelectedId(updated[0].id);
      onChange?.(formatVehicle(updated[0]));
    }
  }

  function handleManualMake(val) {
    setMake(val);
    setModel("");
    onChange?.("");
  }

  function handleManualModel(val) {
    setModel(val);
    onChange?.(make && val && year ? `${year} ${make} ${val}` : "");
  }

  function handleManualYear(val) {
    setYear(val);
    onChange?.(make && model && val ? `${val} ${make} ${model}` : "");
  }

  /* ---------- LOGGED OUT: Never show saved vehicles ---------- */
  if (!user) {
    return (
      <div className={styles.vehiclePicker}>
        <div className={styles.pickerGrid}>
          <Dropdown icon="car" placeholder="Select Make" value={make} onChange={handleManualMake} options={carMakes} />
          <Dropdown icon="car" placeholder="Select Model" value={model} onChange={handleManualModel} options={carModels[make] || []} />
          <Dropdown icon="calendar" placeholder="Select Year" value={year} onChange={handleManualYear} options={carYears.map(String)} />
        </div>
      </div>
    );
  }

  /* ---------- LOGGED IN: Show saved vehicles + Add up to 5 ---------- */
  return (
    <div className={styles.vehiclePicker}>
      <div className={styles.savedHeader}>
        <span className={styles.savedLabel}>
          Your vehicle <b>({savedList.length}/{MAX_VEHICLES} saved)</b>
        </span>

        {mode === "saved" && savedList.length < MAX_VEHICLES && (
          <button type="button" className={styles.linkBtn} onClick={openAddForm}>
            + Add a vehicle
          </button>
        )}

        {mode === "add" && savedList.length > 0 && (
          <button
            type="button"
            className={styles.linkBtn}
            onClick={() => selectSaved(savedList.find((v) => v.id === selectedId) || savedList[0])}
          >
            Back to saved vehicles
          </button>
        )}
      </div>

      {mode === "saved" ? (
        <div className={styles.savedGrid}>
          {savedList.map((v) => {
            const isSelected = v.id === selectedId;
            return (
              <div
                key={v.id}
                role="button"
                tabIndex={0}
                onClick={() => selectSaved(v)}
                onKeyDown={(e) => e.key === "Enter" && selectSaved(v)}
                className={`${styles.savedCard} ${isSelected ? styles.savedCardActive : ""}`}
              >
                <div className={styles.savedCardLeft}>
                  <Icon name="car" size={22} sw={1.7} />
                  <div>
                    <b>{v.year} {v.make} {v.model}</b>
                    <small>{v.reg}</small>
                  </div>
                </div>

                <div className={styles.savedCardRight}>
                  {isSelected && (
                    <span className={styles.checkBadge}>
                      <Icon name="check" size={13} sw={3} />
                    </span>
                  )}
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={(e) => removeSavedVehicle(e, v.id)}
                    aria-label={`Remove ${v.make} ${v.model}`}
                    title="Remove vehicle"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.addBox}>
          <div className={styles.pickerGrid}>
            <Dropdown
              icon="car"
              placeholder="Select Make"
              value={make}
              onChange={(val) => {
                setMake(val);
                setModel("");
                setAddError("");
              }}
              options={carMakes}
            />
            <Dropdown
              icon="car"
              placeholder="Select Model"
              value={model}
              onChange={(val) => {
                setModel(val);
                setAddError("");
              }}
              options={carModels[make] || []}
            />
            <Dropdown
              icon="calendar"
              placeholder="Select Year"
              value={year}
              onChange={(val) => {
                setYear(val);
                setAddError("");
              }}
              options={carYears.map(String)}
            />
          </div>

          <div className={styles.addBottomRow}>
            <input
              type="text"
              className={styles.plateInput}
              placeholder="Plate number (optional, e.g. Dubai • A 12345)"
              value={reg}
              onChange={(e) => setReg(e.target.value)}
            />
            <button type="button" className={styles.saveVehicleBtn} onClick={handleSaveNewVehicle}>
              Save Vehicle ({savedList.length + 1}/{MAX_VEHICLES})
            </button>
          </div>

          {addError && <p className={styles.pickerError}>{addError}</p>}
        </div>
      )}
    </div>
  );
}