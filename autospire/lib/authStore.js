import { useEffect, useState } from "react";

/* Demo accounts, saved in the browser (localStorage). A real backend replaces this later. */
const USERS = "autospire.users.v1";
const SESSION = "autospire.session.v1";
const EVENT = "autospire-auth";

/* demo account for client presentations (works on the login page with "Use demo account") */
export const DEMO = { name: "Sania Khandakar", email: "demo@autospire.ae", password: "Demo@1234", phone: "+971 50 123 4567", emirate: "Dubai" };

/* turns a password into a scrambled code so it is never stored as plain text */
async function scramble(text) {
  try {
    if (globalThis.crypto?.subtle) {
      const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("autospire:" + text));
      return "s:" + [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {}
  // simple fallback for pages opened over plain http (not secure)
  let h = 5381;
  for (const c of "autospire:" + text) h = ((h << 5) + h + c.charCodeAt(0)) | 0;
  return "f:" + h;
}

const read = (key, store = localStorage) => {
  try { return JSON.parse(store.getItem(key)); } catch { return null; }
};
const getUsers = () => read(USERS) || [];
const saveUsers = (list) => { try { localStorage.setItem(USERS, JSON.stringify(list)); } catch {} };
const tell = () => window.dispatchEvent(new Event(EVENT));

export const initialsOf = (name) => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "U";
export const firstName = (name) => name.trim().split(/\s+/)[0];

/* only allow redirects to pages on this site */
export const safeNext = (next, fallback = "/my-vehicles") =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;

function startSession(user, remember) {
  const session = { id: user.id, name: user.name, email: user.email, initials: initialsOf(user.name) };
  try {
    localStorage.removeItem(SESSION);
    sessionStorage.removeItem(SESSION);
    (remember ? localStorage : sessionStorage).setItem(SESSION, JSON.stringify(session));
  } catch {}
  tell();
  return session;
}

export const currentUser = () => read(SESSION, sessionStorage) || read(SESSION);

export async function registerUser({ name, email, phone, emirate, password }) {
  const clean = email.trim().toLowerCase();
  const users = getUsers();
  if (users.some((u) => u.email === clean)) {
    return { ok: false, field: "email", error: "An account with this email already exists. Try logging in." };
  }
  const user = { id: "u" + Date.now(), name: name.trim(), email: clean, phone: phone.trim(), emirate, pass: await scramble(password), created: Date.now() };
  saveUsers([...users, user]);
  return { ok: true, user: startSession(user, true) };
}

export async function loginUser({ email, password, remember }) {
  const clean = email.trim().toLowerCase();
  let users = getUsers();

  // create the demo account the first time it is used
  if (clean === DEMO.email && password === DEMO.password && !users.some((u) => u.email === clean)) {
    const demo = { id: "u-demo", name: DEMO.name, email: DEMO.email, phone: DEMO.phone, emirate: DEMO.emirate, pass: await scramble(DEMO.password), created: Date.now() };
    users = [...users, demo];
    saveUsers(users);
  }

  const user = users.find((u) => u.email === clean);
  // same message for "no such email" and "wrong password" on purpose
  if (!user || user.pass !== (await scramble(password))) return { ok: false, error: "Email or password is incorrect." };
  return { ok: true, user: startSession(user, remember) };
}

export function logout() {
  try { localStorage.removeItem(SESSION); sessionStorage.removeItem(SESSION); } catch {}
  tell();
}

/* use anywhere: const { user, ready } = useAuth();  (user is null when logged out) */
export function useAuth() {
  const [state, setState] = useState({ user: null, ready: false });
  useEffect(() => {
    const update = () => setState({ user: currentUser(), ready: true });
    update();
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return state;
}