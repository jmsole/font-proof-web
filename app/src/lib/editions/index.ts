import type { EditionMeta, Tab } from "./types";

/** Served at the site root; the others at /<slug> */
export const ROOT_EDITION = "latin";

// Menu order: Latins first, then the other scripts alphabetically
export const EDITIONS: EditionMeta[] = [
  { slug: "latin", label: "Latin 1", title: "Font Proof - Latin", scripts: ["latn", "DFLT"] },
  { slug: "arabic", label: "Arabic", title: "Font Proof - Arabic", scripts: ["arab", "DFLT"] },
  { slug: "latin-02", label: "Latin 2", title: "Font Proof - Latin 2", scripts: ["latn", "DFLT"] },
  { slug: "latin-african", label: "African Latin", title: "Font Proof - African Latin", scripts: ["latn", "DFLT"] },
];

// Each edition's tabs load as their own chunk, only when that page is opened
const tabModules: Record<string, () => Promise<{ tabs: Tab[] }>> = {
  latin: () => import("./latin"),
  arabic: () => import("./arabic"),
  "latin-02": () => import("./latin-02"),
  "latin-african": () => import("./latin-african"),
};

export async function loadEdition(slug: string) {
  const meta = EDITIONS.find((edition) => edition.slug === slug);
  if (!meta) return null;
  const { tabs } = await tabModules[slug]();
  return { edition: meta, tabs };
}
