// Every page is built to static HTML ahead of time, as <page>/index.html so
// any static host serves it without rewrite rules
export const prerender = true;
export const trailingSlash = "always";
