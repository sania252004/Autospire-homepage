// lib/authStore.js
// DEMO login: accounts and the login session are kept in the browser (localStorage).
// Replace the functions below with calls to a real backend later.
import { useEffect, useState } from "react";

const USERS_KEY = "autospire-users";
const SESSION_KEY = "autospire-session";
const AUTH_EVENT = "autospire-auth";   // tells the header / login pages that login changed

// true = logging in with a new number creates the account automatically (easy testing)
// false = the number must be registered first
const AUTO_CREATE = true;

/* ---------- small helpers ---------- */

// "050 123 4567" -> "0501234567"
export function cleanPhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

// only allow redirects to pages on this site (stops ?next=https://evil.com)
export function safeNext(next) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

// "Ahmed Ali" -> "Ahmed". Used for "Hi, Ahmed" in the header.
export function firstName(user) {
  if (!user) return "";
  const name = (user.name || "").trim().split(/\s+/)[0];
  return name || "there";
}

function read(storage, key, fallback) {
  try { return JSON.parse(storage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function announce() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_EVENT));
}

/* ---------- accounts ---------- */

export function registerUser({ name = "", phone, email = "" }) {
  const p = cleanPhone(phone);
  const users = read(localStorage, USERS_KEY, []);
  if (users.some((u) => u.phone === p)) {
    return { ok: false, error: "An account with this number already exists. Please log in." };
  }
  const user = { id: Date.now(), name, email, phone: p };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  startSession(user, true);
  return { ok: true, user };
}

export function loginUser({ phone, remember = true }) {
  const p = cleanPhone(phone);
  const users = read(localStorage, USERS_KEY, []);
  let user = users.find((u) => u.phone === p);

  if (!user) {
    if (!AUTO_CREATE) return { ok: false, error: "No account found for this number. Please create an account." };
    user = { id: Date.now(), name: "", email: "", phone: p };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  }

  startSession(user, remember);
  return { ok: true, user };
}

/* ---------- login session ---------- */

// "Keep me logged in" -> stays after the browser closes. Otherwise it ends with the tab.
function startSession(user, remember) {
  const where = remember ? localStorage : sessionStorage;
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  where.setItem(SESSION_KEY, JSON.stringify(user));
  announce();
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  return read(sessionStorage, SESSION_KEY, null) || read(localStorage, SESSION_KEY, null);
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  announce();
}

// same thing with other names, in case other files use them
export const logoutUser = logout;
export const getSession = getCurrentUser;
export const isLoggedIn = () => !!getCurrentUser();

/* ---------- React hook: who is logged in right now ---------- */

// Use it like:   const { user, ready } = useAuth();
//   user  = the logged-in user, or null
//   ready = false for the first instant (before the browser has been checked)
export function useAuth() {
  const [state, setState] = useState({ user: null, ready: false });

  useEffect(() => {
    const sync = () => setState({ user: getCurrentUser(), ready: true });
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return state;
}