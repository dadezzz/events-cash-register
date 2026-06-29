import { invalid } from "@sveltejs/kit";
import { requireAdmin } from "#lib/auth/index.server.ts";
import { User } from "#lib/entities/user/index.ts";
import { e } from "#lib/error.ts";
import { logger } from "#lib/server/logger/request.ts";
import { form } from "$app/server";
import { addUserFormSchema, deleteUserFormSchema, updateUserFormSchema } from "./_schemas.ts";

export const addUserForm = form(addUserFormSchema, async (data, issue) => {
  await requireAdmin();

  if (await User.fromUsername(data.username)) {
    invalid(issue.username("Esiste già un altro utente con questo nome"));
  }

  const profile = { ...data, password: data._password };
  const user = await User.create(profile);

  logger.info({ message: "created new user", userId: user.id });
});

export const deleteUserForm = form(deleteUserFormSchema, async (data) => {
  await requireAdmin();
  const user = await User.fromId(data.id);

  if (!user) {
    throw e.error404();
  }

  await user.delete();

  logger.info({ message: "deleted user", userId: user.id });
});

export const updateUserForm = form(updateUserFormSchema, async (data, issue) => {
  await requireAdmin();
  const user = await User.fromId(data.id);

  if (!user) {
    throw e.error404();
  }

  const userProfile = await user.getProfile();

  if (data.username !== userProfile.username && (await User.fromUsername(data.username))) {
    invalid(issue.username("Esiste già un altro utente con questo nome"));
  }

  const profile = { ...data, password: data._password };
  await user.updateProfile(profile);

  logger.info({ message: "updated user", userId: user.id });
});
