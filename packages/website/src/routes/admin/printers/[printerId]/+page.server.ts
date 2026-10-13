import { requireAdmin } from "#lib/auth/index.server.ts";
import type { PageServerLoad } from "./$types.ts";

export const load: PageServerLoad = async (event) => {
  await requireAdmin(event.url.pathname);
};
