// The loaded fonts: the font bar's list, the active font and the sort order.

import { parseFont, type FontInfo } from "./parse";
import * as storage from "./storage";

export interface LoadedFont {
  name: string; // also the CSS font-family name
  size: string;
  info: FontInfo | null; // null if lib-font could not read the file
  face: FontFace;
}

export const SORT_KEYS = { family: "Family", weight: "Weight", width: "Width", slant: "Slant", opsz: "Optical Size" };
export type SortKey = keyof typeof SORT_KEYS;
export interface SortCriterion {
  key: SortKey;
  ascending: boolean;
}

const ACCEPTED = /\.(ttf|otf|woff|woff2)$/i;

class Fonts {
  list = $state.raw<LoadedFont[]>([]);
  activeName = $state<string | null>(null);
  /** Applied in order; the first is the primary key */
  sort = $state<SortCriterion[]>([]);
  /** Names shown in the font bar while saved fonts load after a reload */
  restoring = $state<string[]>([]);

  active = $derived(this.list.find((font) => font.name === this.activeName) ?? null);

  async addFiles(files: FileList | File[]) {
    for (const file of files) {
      if (!ACCEPTED.test(file.name)) {
        alert("Invalid file extension. Will only accept ttf, otf, woff or woff2 font files");
        continue;
      }
      const name = file.name.replace(/\..+$/, "").replace(/\W+/g, "-");
      const size = Math.round(file.size / 1024) + "kb";
      const data = await file.arrayBuffer();
      const font = await this.#load(name, size, data);
      if (!font) continue;
      this.#append(font);
      this.activate(font.name);
      storage.saveFont(font.name, size, data).catch((err) => console.warn("Could not keep font for reloads", err));
    }
  }

  /** Bring back this tab's fonts after a reload */
  async restore() {
    const order = storage.sessionGet<string[]>("fp-order", []);
    const activeName = storage.sessionGet<string | null>("fp-active", null);
    if (!order.length || !window.indexedDB) return;
    this.restoring = order;
    try {
      const stored = await storage.readFonts();
      const position = (name: string) => (order.includes(name) ? order.indexOf(name) : order.length);
      stored.sort((a, b) => position(a.name) - position(b.name));
      const loaded = await Promise.all(stored.map((font) => this.#load(font.name, font.size, font.data)));
      this.sort = storage.sessionGet<SortCriterion[]>("fp-sort", []).filter((c) => c.key in SORT_KEYS);
      for (const font of loaded) if (font) this.#append(font);
      const active = this.list.find((font) => font.name === activeName) ?? this.list.at(-1);
      if (active) this.activate(active.name);
    } catch (err) {
      console.warn("Could not restore fonts", err);
    } finally {
      this.restoring = [];
    }
  }

  activate(name: string) {
    this.activeName = name;
    this.#saveState();
  }

  /** Move the active font by `step` places, wrapping around at either end */
  step(step: number) {
    const count = this.list.length;
    if (!count) return;
    const current = this.list.findIndex((font) => font.name === this.activeName);
    this.activate(this.list[(current + step + count) % count].name);
  }

  /** Drag-to-reorder in the font bar */
  move(name: string, index: number) {
    const list = this.list.filter((font) => font.name !== name);
    const font = this.list.find((font) => font.name === name);
    if (!font) return;
    list.splice(index, 0, font);
    this.list = list;
    this.#saveState();
  }

  setSort(criteria: SortCriterion[]) {
    this.sort = criteria;
    storage.sessionSet("fp-sort", criteria);
    this.#applySort();
  }

  async clear() {
    for (const font of this.list) document.fonts.delete(font.face);
    this.list = [];
    this.activeName = null;
    this.sort = [];
    storage.sessionSet("fp-sort", []);
    this.#saveState();
    await storage.deleteFonts().catch((err) => console.warn("Could not forget fonts", err));
  }

  async #load(name: string, size: string, data: ArrayBuffer): Promise<LoadedFont | null> {
    // Same file name twice: append -2, -3 etc.
    const taken = new Set(this.list.map((font) => font.name));
    let unique = name;
    for (let n = 2; taken.has(unique); n++) unique = `${name}-${n}`;

    const face = new FontFace(unique, data.slice(0));
    try {
      await face.load();
    } catch {
      alert(`${name} could not be loaded by the browser.`);
      return null;
    }
    document.fonts.add(face);
    const info = await parseFont(unique, data).catch((err) => {
      console.error(err);
      return null;
    });
    return { name: unique, size, info, face };
  }

  #append(font: LoadedFont) {
    this.list = [...this.list, font];
    this.#applySort();
  }

  /** Multi-level sort. Fonts missing a value go after those that have it;
      fonts that compare equal keep their relative order. */
  #applySort() {
    if (this.sort.length) {
      this.list = this.list.toSorted((a, b) => {
        for (const { key, ascending } of this.sort) {
          const x = a.info?.sort[key] ?? null;
          const y = b.info?.sort[key] ?? null;
          if (x === null || y === null) {
            if (x === y) continue;
            return x === null ? 1 : -1;
          }
          const order =
            typeof x === "string" ? x.localeCompare(y as string, undefined, { numeric: true }) : x - (y as number);
          if (order) return ascending ? order : -order;
        }
        return 0; // toSorted is stable
      });
    }
    this.#saveState();
  }

  #saveState() {
    storage.sessionSet("fp-order", this.list.map((font) => font.name));
    storage.sessionSet("fp-active", this.activeName);
  }
}

export const fonts = new Fonts();
