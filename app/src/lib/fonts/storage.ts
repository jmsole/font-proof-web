// Loaded fonts are kept in IndexedDB for as long as this browser tab is open,
// so a reload keeps them. A new tab starts empty. sessionStorage (per tab) holds
// the tab's id plus the font order, the active font and the sort criteria.

const DB_NAME = "fontproof-app";
const STORE = "fonts";
const MAX_AGE = 2 * 24 * 60 * 60 * 1000; // drop other tabs' fonts after two days

export interface StoredFont {
  session: string;
  name: string;
  size: string;
  data: ArrayBuffer;
  saved: number;
}

export function sessionGet<T>(key: string, fallback: T): T {
  try {
    const value = sessionStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function sessionSet(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function sessionId(): string {
  let id = sessionGet<string | null>("fp-session", null);
  if (!id) {
    id = Date.now() + "-" + Math.random().toString(36).slice(2);
    sessionSet("fp-session", id);
  }
  return id;
}

let db: Promise<IDBDatabase> | null = null;

function store(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  db ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: ["session", "name"] });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return db.then((d) => d.transaction(STORE, mode).objectStore(STORE));
}

export async function saveFont(name: string, size: string, data: ArrayBuffer) {
  const s = await store("readwrite");
  s.put({ session: sessionId(), name, size, data, saved: Date.now() } satisfies StoredFont);
}

/** Visit every stored font; `onFont` returns true to delete it */
async function eachFont(onFont: (font: StoredFont) => boolean | void) {
  const s = await store("readwrite");
  return new Promise<void>((resolve, reject) => {
    const request = s.openCursor();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return resolve();
      if (onFont(cursor.value)) cursor.delete();
      cursor.continue();
    };
  });
}

/** This tab's fonts; other tabs' fonts are dropped once they are old */
export async function readFonts(): Promise<StoredFont[]> {
  const session = sessionId();
  const fonts: StoredFont[] = [];
  await eachFont((font) => {
    if (font.session === session) fonts.push(font);
    else return Date.now() - font.saved > MAX_AGE;
  });
  return fonts;
}

/** Forget this tab's fonts */
export async function deleteFonts() {
  const session = sessionId();
  await eachFont((font) => font.session === session);
}
