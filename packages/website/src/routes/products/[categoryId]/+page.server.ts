import { requireUser } from "#lib/auth/index.server.ts";
import type { PageServerLoad } from "./$types.ts";

export const load: PageServerLoad = async (event) => {
  await requireUser(event.url.pathname);
};
