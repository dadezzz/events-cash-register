import { requireUser } from "#lib/auth/index.server.ts";
import { redirect } from "#lib/redirect.ts";
import type { PageServerLoad } from "./$types.ts";

export const load: PageServerLoad = async () => {
  await requireUser();
  redirect("/products");
};
