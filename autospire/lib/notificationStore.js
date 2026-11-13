import { useEffect, useState } from "react";

/* Notifications saved in the browser (localStorage). A real backend plus email/SMS/push replaces this later. */
const KEY = "autospire.notifications.v1";
const EVENT = "autospire-notifications";

function seed() {
  const now = Date.now();
  return [
    { id: "n-seed-1", title: "Service coming up", text: "Your Mercedes-Benz GLC is due for a Major Service on 15 Dec 2026.", href: "/my-vehicles", read: false, time: now - 3 * 3600000 },
    { id: "n-seed-2", title: "Insurance needs renewing", text: "Your Toyota Land Cruiser insurance has expired.", href: "/my-vehicles", read: false, time: now - 26 * 3600000 },
  ];
}

function write(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

function save(list) {
  write(list);
  window.dispatchEvent(new Event(EVENT));   // tells the bell to update
}

export function loadNotifications() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const first = seed();
  write(first);
  return first;
}

export function addNotification({ title, text, href }) {
  save([{ id: "n" + Date.now(), title, text, href: href || "#", read: false, time: Date.now() }, ...loadNotifications()]);
}

export const markRead = (id) => save(loadNotifications().map((n) => (n.id === id ? { ...n, read: true } : n)));
export const markAllRead = () => save(loadNotifications().map((n) => ({ ...n, read: true })));
export const clearNotifications = () => save([]);

/* use this anywhere to get the number for the red badge: const unread = useUnreadCount(); */
export function useUnreadCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(loadNotifications().filter((n) => !n.read).length);
    update();
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return count;
}