/* Keeps the quote request's photos while the customer moves from the homepage to My Quotes.
   A real backend would upload these files instead. */
const KEY = "autospire.quoteDraft.v1";

export function saveQuoteDraft(draft) {
  try { sessionStorage.setItem(KEY, JSON.stringify(draft)); } catch {}
}

export function loadQuoteDraft() {
  try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch { return {}; }
}