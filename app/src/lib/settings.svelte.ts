// OpenType feature, CSS and variable-axis settings applied to the specimens.

import type { LoadedFont } from "./fonts/fonts.svelte";

/** On by default; switching one off writes `"tag" off` */
export const DEFAULT_ON: [string, string][] = [
  ["kern", "OpenType Kerning"],
  ["liga", "Standard Ligatures"],
  ["ccmp", "Glyph Composition/Decomposition"],
  ["calt", "Contextual Alternates"],
  ["rlig", "Required Ligatures"],
  ["rclt", "Required Contextual Alternates"],
  ["rvrn", "Required Variation Alternates"],
  ["mark", "Mark Positioning"],
  ["mkmk", "Mark-to-mark Positioning"],
];

/** Off by default; switching one on writes `"tag"` */
export const CASING: [string, string][] = [
  ["c2sc", "Capitals to Small Caps"],
  ["case", "Case Sensitive Forms"],
];
export const OTHER: [string, string][] = [
  ["dlig", "Discretionary Ligatures"],
  ["hlig", "Historical Ligatures"],
  ["swsh", "Swashes"],
  ["salt", "Stylistic Alternates"],
];
export const NUMERALS: [string, string][] = [
  ["ordn", "Ordinals"],
  ["frac", "Fractions"],
  ["zero", "Slashed zero"],
  ["sups", "Superiors"],
  ["numr", "Numerator"],
  ["dnom", "Denominator"],
  ["sinf", "Inferiors"],
];
export const STYLISTIC_SETS = Array.from({ length: 20 }, (_, i) => "ss" + String(i + 1).padStart(2, "0"));

const optional = [...CASING, ...OTHER, ...NUMERALS].map(([tag]) => tag).concat(STYLISTIC_SETS);

export const settings = $state({
  features: Object.fromEntries([
    ...DEFAULT_ON.map(([tag]) => [tag, true]),
    ...optional.map((tag) => [tag, false]),
  ]) as Record<string, boolean>,
  smallCaps: "off" as "off" | "fake" | "smcp",
  figureStyle: "" as "" | "lnum" | "onum",
  figureWidth: "" as "" | "pnum" | "tnum",
  rtl: false,
  allCaps: false,
  underline: false,
  strikethrough: false,
  fallback: "system" as "system" | "blank",
  /** Variable axis values for the active font */
  axes: {} as Record<string, number>,
  instance: "",
});

/** CSS font-family for a loaded font, with the chosen fallback */
export function fontFamily(name: string) {
  return settings.fallback === "blank" ? `"${name}", "Adobe Blank"` : `"${name}"`;
}

/** Axis values for a newly active font: the font's default instance (fvar axis
    defaults), with the instance menu on the named instance at those values, if any */
export function resetAxes(font: LoadedFont | null) {
  const info = font?.info;
  const axes = info?.axes ?? [];
  settings.axes = Object.fromEntries(axes.map((axis) => [axis.tag, axis.default]));
  const atDefault = info?.instances.find((instance) =>
    axes.every((axis) => instance.coordinates[axis.tag] === axis.default),
  );
  settings.instance = atDefault?.name ?? "";
}

/** Inline style for the specimen area */
export function specimenStyle(font: LoadedFont | null): string {
  const tags = DEFAULT_ON.map(([tag]) => `"${tag}" ${settings.features[tag] ? "on" : "off"}`);
  for (const tag of optional) if (settings.features[tag]) tags.push(`"${tag}"`);
  if (settings.smallCaps === "smcp") tags.push('"smcp"');
  if (settings.figureStyle) tags.push(`"${settings.figureStyle}"`);
  if (settings.figureWidth) tags.push(`"${settings.figureWidth}"`);

  const decoration = [settings.underline && "underline", settings.strikethrough && "line-through"].filter(Boolean);
  const axes = Object.entries(settings.axes).map(([tag, value]) => `"${tag}" ${value}`);

  return [
    font && `font-family: ${fontFamily(font.name)}`,
    `font-feature-settings: ${tags.join(", ")}`,
    settings.smallCaps === "fake" && "font-variant: small-caps",
    decoration.length && `text-decoration: ${decoration.join(" ")}; text-decoration-thickness: from-font`,
    settings.rtl && "direction: rtl",
    settings.allCaps && "text-transform: uppercase",
    axes.length && `font-variation-settings: ${axes.join(", ")}`,
  ]
    .filter(Boolean)
    .join("; ");
}
