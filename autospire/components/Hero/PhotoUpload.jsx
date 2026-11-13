"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon/Icon";
import styles from "./Hero.module.css";

const MAX = 5;

/* shrinks a picture so it stays small enough to store */
function shrink(file, done, fail) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const scale = Math.min(1, 800 / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    done(canvas.toDataURL("image/jpeg", 0.7));
  };
  img.onerror = () => { URL.revokeObjectURL(url); fail(); };
  img.src = url;
}

export default function PhotoUpload({ onChange }) {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  // tell the page whenever the list changes
  useEffect(() => { onChange?.(photos); }, [photos]);

  function add(e) {
    const files = [...e.target.files];
    e.target.value = "";
    setError("");
    const room = MAX - photos.length;
    if (room <= 0) return setError(`You can add up to ${MAX} photos.`);
    if (files.length > room) setError(`Only ${MAX} photos are allowed. Extra files were skipped.`);
    files.slice(0, room).forEach((file) => {
      if (!file.type.startsWith("image/")) return setError("Please choose image files only.");
      shrink(
        file,
        (data) => setPhotos((prev) => [...prev, data].slice(0, MAX)),
        () => setError("Could not read that picture.")
      );
    });
  }

  return (
    <div className={styles.photoBox}>
      <div className={styles.photoHead}><b>Add photos of the problem</b><small> (Optional up to {MAX})</small></div>
      <div className={styles.photoThumbs}>
        {photos.map((src, i) => (
          <div key={i} className={styles.thumb}>
            <img src={src} alt={`Photo ${i + 1}`} />
            <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} aria-label={`Remove photo ${i + 1}`}>
              <Icon name="close" size={14} sw={2.4} />
            </button>
          </div>
        ))}
        {photos.length < MAX && (
          <label className={styles.addPhoto}>
            <Icon name="plus" size={20} sw={2} />
            <span>Add photo</span>
            <input type="file" accept="image/*" multiple hidden onChange={add} />
          </label>
        )}
      </div>
      {error && <p className={styles.formError} role="alert">{error}</p>}
    </div>
  );
}