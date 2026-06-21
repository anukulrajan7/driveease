/**
 * Remember the visitor's contact details across visits so forms come
 * pre-filled — less typing on a phone, more completed enquiries.
 *
 * Stored in localStorage only (never sent anywhere by itself). saveContact()
 * is called centrally from storeLead(), so every form feeds it automatically;
 * forms read it on mount via loadContact().
 */

const KEY = "sh_contact";

export interface RememberedContact {
  name?: string;
  phone?: string;
  email?: string;
}

/** Read the saved contact, or an empty object. Safe on the server. */
export function loadContact(): RememberedContact {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RememberedContact) : {};
  } catch {
    return {};
  }
}

/** Merge-save the contact. Blanks never overwrite an existing value. */
export function saveContact(next: RememberedContact): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadContact();
    const merged: RememberedContact = {
      name: next.name?.trim() || current.name,
      phone: next.phone?.trim() || current.phone,
      email: next.email?.trim() || current.email,
    };
    window.localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {
    /* storage disabled — no-op */
  }
}
