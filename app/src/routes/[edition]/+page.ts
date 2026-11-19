import { error } from "@sveltejs/kit";
import { EDITIONS, ROOT_EDITION, loadEdition } from "#lib/editions/index.ts";

// The Latin edition lives at the site root
export const entries = () => EDITIONS.filter((e) => e.slug !== ROOT_EDITION).map((e) => ({ edition: e.slug }));

export const load = async ({ params }) => {
  if (params.edition === ROOT_EDITION) error(404);
  const data = await loadEdition(params.edition);
  if (!data) error(404);
  return data;
};
