// lib-font looks for these globals to unpack WOFF (zlib) and WOFF2 (brotli).
import { inflate } from "pako";
import { decompress } from "brotli/decompress";

const g = globalThis as any;
g.pako = { inflate };
g.unbrotli = (data: Uint8Array) => decompress(data as any);
