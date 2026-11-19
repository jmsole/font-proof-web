import type { Tab } from "./types";
import w from "../content/latin/waterfalls.json";
import lettering from "../content/latin/lettering.html?raw";
import kerning from "../content/latin/kerning.html?raw";
import fuchsKern from "../content/latin/fuchs-kern.html?raw";
import diacritics from "../content/latin/diacritics.html?raw";
import worldScripts from "../content/latin/world-scripts.html?raw";
import verticalMetrics from "../content/latin/vertical-metrics.html?raw";

const nowrap = "white-space: nowrap; overflow: hidden;";
const wide = "width: 96vw;";

export const tabs: Tab[] = [
  { id: "headlines", label: "Headlines", kind: "waterfalls", items: [{ ...w.short, style: nowrap }] },
  { id: "text", label: "Text", kind: "waterfalls", items: [{ ...w.long, spaced: true, style: wide }] },
  {
    id: "lowercases", label: "a-z", kind: "waterfalls",
    items: [{ ...w.lowercaseShort, style: nowrap }, { ...w.lowercaseLong, spaced: true, style: wide }],
  },
  {
    id: "uppercases", label: "A-Z", kind: "waterfalls",
    items: [{ ...w.uppercaseShort, style: nowrap }, { ...w.uppercaseLong, spaced: true, style: wide }],
  },
  { id: "caps", label: "Words", kind: "waterfalls", items: [{ ...w.caps, spaced: true }] },
  { id: "allcaps", label: "Caps", kind: "waterfalls", items: [{ ...w.allcaps, spaced: true }] },
  { id: "lettering", label: "Lettering", kind: "html", html: lettering },
  { id: "kern", label: "Kern", kind: "html", html: kerning },
  { id: "fuchs-kern", label: "Andre Fuchs", kind: "html", html: fuchsKern },
  { id: "hinting", label: "Hinting", kind: "hinting" },
  { id: "diacritics", label: "Diacritics", kind: "html", html: diacritics },
  { id: "world", label: "World Scripts", kind: "html", html: worldScripts },
  { id: "vmetrics", label: "Vertical Metrics", kind: "html", html: verticalMetrics },
  {
    id: "compare", label: "Compare", kind: "compare",
    text: "Hamburgefonstiv HAMBURGEFONSTIV 0123456789\nJackdaws love my big sphinx of quartz.",
  },
];
