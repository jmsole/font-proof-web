import type { Tab } from "./types";
import w from "../content/arabic/waterfalls.json";
import charset from "../content/arabic/charset.html?raw";
import kerning from "../content/arabic/kerning.html?raw";

const page = "width: 960px; direction: rtl;";

export const tabs: Tab[] = [
  {
    id: "headlines", label: "Headlines", lang: "ar", kind: "waterfalls",
    items: [{ ...w.short, style: "white-space: nowrap; overflow: hidden; direction: rtl;" }],
  },
  { id: "arabictext", label: "Arabic Text", lang: "ar", style: page, kind: "waterfalls", items: [{ ...w.arabiclong, spaced: true }] },
  { id: "persiantext", label: "Persian Text", lang: "fa", style: page, kind: "waterfalls", items: [{ ...w.persianlong, spaced: true }] },
  { id: "urdutext", label: "Urdu Text", lang: "ur", style: page, kind: "waterfalls", items: [{ ...w.urdulong, spaced: true }] },
  {
    id: "vocalized", label: "Vocalized Text", lang: "ar", kind: "waterfalls",
    items: [{ ...w.vocalizedLong, style: page + " line-height: 1.6;" }],
  },
  { id: "charset", label: "Character Set", kind: "html", html: charset },
  { id: "kern", label: "Kern", kind: "html", html: kerning },
  {
    id: "compare", label: "Compare", lang: "ar", kind: "compare",
    text: "ابجد هوز حطي كلمن سعفص قرشت ثخذ ضظغ.\nاصبر على حفظ خضر واستشر فطنا، وزج همك في بغداذ منثملا.",
  },
];
