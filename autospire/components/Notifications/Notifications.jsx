"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon/Icon";
import { loadNotifications, markRead, markAllRead, clearNotifications } from "@/lib/notificationStore";
import styles from "./Notifications.module.css";

function ago(ms) {
  const m = Math.round((Date.now() - ms) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const d = Math.round(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

export default function Notifications() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const refresh = () => setList(loadNotifications());
    refresh();
    window.addEventListener("autospire-notifications", refresh);
    return () => window.removeEventListener("autospire-notifications", refresh);
  }, []);

  const unread = list.filter((n) => !n.read).length;

  return (
    <>
      <section className={styles.banner}>
        <h1>Notifications</h1>
        <p>{unread > 0 ? `You have ${unread} unread notification${unread > 1 ? "s" : ""}.` : "You're all caught up."}</p>
      </section>

      <div className={styles.page}>
        <div className={styles.tools}>
          <button className={styles.btn} onClick={markAllRead} disabled={unread === 0}>Mark all as read</button>
          <button className={styles.btn} onClick={clearNotifications} disabled={list.length === 0}>Clear all</button>
        </div>

        {list.length === 0 && <div className={styles.empty}>No notifications yet.</div>}

        {list.map((n) => (
          <a key={n.id} href={n.href} className={`${styles.item} ${n.read ? "" : styles.unread}`} onClick={() => markRead(n.id)}>
            <span className={styles.icon}><Icon name="bell" size={22} sw={1.7} /></span>
            <span className={styles.text}>
              <b>{n.title}</b>
              <span>{n.text}</span>
              <small>{ago(n.time)}</small>
            </span>
            {!n.read && <span className={styles.dot} aria-label="Unread" />}
          </a>
        ))}
      </div>
    </>
  );
}