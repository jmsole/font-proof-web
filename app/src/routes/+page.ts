import { ROOT_EDITION, loadEdition } from "#lib/editions/index.ts";

export const load = async () => (await loadEdition(ROOT_EDITION))!;
