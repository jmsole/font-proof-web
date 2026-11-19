// Reads the OpenType data the interface needs from a font file, using lib-font.
// lib-font is loaded on demand (browser only) after its WOFF/WOFF2 decoders are
// installed as globals, which it reads when its modules first run.

export interface Axis {
  tag: string;
  name: string;
  min: number;
  max: number;
  default: number;
}

export interface Instance {
  name: string;
  coordinates: Record<string, number>;
}

export interface FontInfo {
  /** Values the font bar can sort by; null when the font has none */
  sort: {
    family: string;
    weight: number | null;
    width: number | null;
    slant: number | null; // post.italicAngle, negative for right-leaning italics
    opsz: number | null; // default of the opsz axis; static fonts have none
  };
  axes: Axis[];
  instances: Instance[];
  /** Stylistic set names (ss01 → "Single-storey a"), per OpenType script tag */
  ssNames: (scripts: string[]) => Record<string, string>;
}

let libFont: Promise<any> | null = null;

function loadLibFont() {
  libFont ??= import("./decoders").then(() => import("lib-font"));
  return libFont;
}

export async function parseFont(name: string, buffer: ArrayBuffer): Promise<FontInfo> {
  const { Font } = await loadLibFont();
  const font = new Font(name, { skipStyleSheet: true });
  await font.fromDataBuffer(buffer, name);

  const tables = font.opentype.tables;
  const names = tables.name;
  const os2 = tables["OS/2"];
  const fvar = tables.fvar;
  const axes: Axis[] = fvar
    ? fvar.axes.map((axis: any) => ({
        tag: axis.tag,
        name: names.get(axis.axisNameID) || axis.tag,
        min: axis.minValue,
        max: axis.maxValue,
        default: axis.defaultValue,
      }))
    : [];
  const instances: Instance[] = fvar
    ? fvar.instances.map((instance: any) => ({
        name: names.get(instance.subfamilyNameID),
        coordinates: Object.fromEntries(axes.map((axis, i) => [axis.tag, instance.coordinates[i]])),
      }))
    : [];

  return {
    sort: {
      family: names.get(16) || names.get(1) || name,
      weight: os2 ? os2.usWeightClass : null,
      width: os2 ? os2.usWidthClass : null,
      slant: tables.post ? tables.post.italicAngle : null,
      opsz: axes.find((axis) => axis.tag === "opsz")?.default ?? null,
    },
    axes,
    instances,
    ssNames(scripts) {
      const labels: Record<string, string> = {};
      const GSUB = tables.GSUB;
      if (!GSUB) return labels;
      // First script in priority order that the font has, e.g. latn then DFLT
      let langSys = null;
      for (const script of scripts) {
        langSys = GSUB.getLangSysTable(script, "dflt");
        if (langSys) break;
      }
      if (!langSys) return labels;
      for (const feature of GSUB.getFeatures(langSys)) {
        if (!feature.featureTag.startsWith("ss")) continue;
        const params = feature.getFeatureParams();
        const label = params && names.get(params.UINameID);
        if (label) labels[feature.featureTag] = label;
      }
      return labels;
    },
  };
}
