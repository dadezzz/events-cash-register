import { invalid } from "@sveltejs/kit";
import { requireAdmin } from "#lib/auth/index.server.ts";
import { User } from "#lib/entities/user/index.ts";
import { redirect } from "#lib/redirect.ts";
import { logger } from "#lib/server/logger/request.ts";
import { form } from "$app/server";
import { addUserFormSchema } from "./_schemas.ts";

export const addUserForm = form(addUserFormSchema, async (data, issue) => {
  await requireAdmin();

  if (await User.fromUsername(data.username)) {
    invalid(issue.username("Esiste già un altro utente con questo nome"));
  }

  const profile = { ...data, password: data._password };
  const user = await User.create(profile);

  logger.info({ message: "created new user", userId: user.id });
  redirect(`/admin/users/${user.id}`);
});
