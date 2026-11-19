import type { Tab } from "./types";
import kernKing from "../content/latin-02/kern-king.html?raw";
import kernWords from "../content/latin-02/kern-words.html?raw";
import kernMinimal from "../content/latin-02/kern-minimal.html?raw";
import ngrams from "../content/latin-02/ngrams.html?raw";
import gridCaps from "../content/latin-02/grid-caps.html?raw";
import ucSpacing01 from "../content/latin-02/uc-spacing-01.html?raw";
import ucSpacing02 from "../content/latin-02/uc-spacing-02.html?raw";
import ucSpacing03 from "../content/latin-02/uc-spacing-03.html?raw";
import ucToLc from "../content/latin-02/uc-to-lc.html?raw";
import gridLower from "../content/latin-02/grid-lower.html?raw";
import lcSpacing01 from "../content/latin-02/lc-spacing-01.html?raw";
import lcSpacing02 from "../content/latin-02/lc-spacing-02.html?raw";
import lcSpacing03 from "../content/latin-02/lc-spacing-03.html?raw";
import gridNumbers from "../content/latin-02/grid-numbers.html?raw";
import numbers01 from "../content/latin-02/numbers-01.html?raw";
import numbers02 from "../content/latin-02/numbers-02.html?raw";
import numbers03 from "../content/latin-02/numbers-03.html?raw";
import numbers04 from "../content/latin-02/numbers-04.html?raw";
import fractions from "../content/latin-02/fractions.html?raw";
import overshoots from "../content/latin-02/overshoots.html?raw";
import apostrophes from "../content/latin-02/apostrophes.html?raw";
import dia01 from "../content/latin-02/dia-01.html?raw";
import dia02 from "../content/latin-02/dia-02.html?raw";
import dia03 from "../content/latin-02/dia-03.html?raw";
import dia04 from "../content/latin-02/dia-04.html?raw";
import locale from "../content/latin-02/locale.html?raw";
import groups from "../content/latin-02/groups.html?raw";

export const tabs: Tab[] = [
  { id: "king", label: "Kern King", kind: "html", html: kernKing },
  { id: "words", label: "Kern Words", kind: "html", html: kernWords },
  { id: "minimalkerning", label: "Minimal Kerning Pairs", kind: "html", html: kernMinimal },
  { id: "ngrams", label: "Ngrams", kind: "html", html: ngrams },
  { id: "capsgrid", label: "UC Grid", kind: "html", html: gridCaps },
  { id: "upperspacing01", label: "UC 1", kind: "html", html: ucSpacing01 },
  { id: "upperspacing02", label: "UC 2", kind: "html", html: ucSpacing02 },
  { id: "upperspacing03", label: "UC 3", kind: "html", html: ucSpacing03 },
  { id: "captolower", label: "UC 2 Lc", kind: "html", html: ucToLc },
  { id: "lowergrid", label: "Lc Grid", kind: "html", html: gridLower },
  { id: "lowerspacing01", label: "Lc 1", kind: "html", html: lcSpacing01 },
  { id: "lowerspacing02", label: "Lc 2", kind: "html", html: lcSpacing02 },
  { id: "lowerspacing03", label: "Lc 3", kind: "html", html: lcSpacing03 },
  { id: "numbersgrid", label: "Numbers Grid", kind: "html", html: gridNumbers },
  { id: "numbers1", label: "Num 1", kind: "html", html: numbers01 },
  { id: "numbers2", label: "Num 2", kind: "html", html: numbers02 },
  { id: "numbers3", label: "Num 3", kind: "html", html: numbers03 },
  { id: "numbers4", label: "Num 4", kind: "html", html: numbers04 },
  { id: "fractions", label: "Fractions", kind: "html", html: fractions },
  { id: "overshoots", label: "Overshoots", kind: "html", html: overshoots },
  { id: "apostrophes", label: "Apostrophes", kind: "html", html: apostrophes },
  { id: "dia_one", label: "Diacritics 1", kind: "html", html: dia01 },
  { id: "dia_two", label: "Diacritics 2", kind: "html", html: dia02 },
  { id: "dia_three", label: "Diacritics 3", kind: "html", html: dia03 },
  { id: "dia_four", label: "Diacritics 4", kind: "html", html: dia04 },
  { id: "locale", label: "Locale", kind: "html", html: locale },
  { id: "groups", label: "Groups", kind: "html", html: groups },
  {
    id: "compare", label: "Compare", kind: "compare",
    text: "Hamburgefonstiv HAMBURGEFONSTIV 0123456789\nJackdaws love my big sphinx of quartz.",
  },
];
