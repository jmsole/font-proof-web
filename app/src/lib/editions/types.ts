/** One block of the same editable text at several sizes, in one or two columns */
export interface Waterfall {
  text: string;
  /** Font sizes in px, one list per column */
  columns: number[][];
  /** Blank line after each sample (used for long texts) */
  spaced?: boolean;
  /** Inline style for the block, e.g. no wrapping for headlines */
  style?: string;
}

interface TabBase {
  id: string;
  label: string;
  lang?: string;
  style?: string;
}

export type Tab = TabBase &
  (
    | { kind: "waterfalls"; items: Waterfall[] }
    | { kind: "html"; html: string }
    | { kind: "hinting" }
    | { kind: "compare"; text: string }
  );

export interface EditionMeta {
  slug: string;
  /** Label in the editions menu */
  label: string;
  title: string;
  /** OpenType script tags to read stylistic set names from, in priority order */
  scripts: string[];
}
