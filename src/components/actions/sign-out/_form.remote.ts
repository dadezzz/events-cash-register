import { getSession } from "#lib/auth/index.server.ts";
import { form } from "$app/server";

export const signOutForm = form(async () => {
  const session = await getSession();

  if (session) {
    await session.deleteCookie();
  }
});
