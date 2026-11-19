import type { Tab } from "./types";
import letteringPri from "../content/latin-african/lettering-pri.html?raw";
import barstroke from "../content/latin-african/barstroke.html?raw";
import placeholder from "../content/latin-african/placeholder.html?raw";

export const tabs: Tab[] = [
  { id: "lettering-pri", label: "AfricanPri Lettering", kind: "html", html: letteringPri },
  { id: "barstroke", label: "Bars & Strokes", kind: "html", html: barstroke },
  { id: "placeholder", label: "Tap 2 Placeholder", kind: "html", html: placeholder },
  {
    id: "compare", label: "Compare", kind: "compare",
    text: "Hamburgefonstiv HAMBURGEFONSTIV 0123456789\nJackdaws love my big sphinx of quartz.",
  },
];
