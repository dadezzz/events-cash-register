import { invalid } from "@sveltejs/kit";
import { requireAdmin } from "#lib/auth/index.server.ts";
import { logger } from "#lib/server/logger/request.ts";
import { form } from "$app/server";
import { addUserFormSchema, deleteUserFormSchema, updateUserFormSchema } from "./_schemas.ts";

export const addUserForm = form(addUserFormSchema, async (data, issue) => {
  const admin = await requireAdmin();

  if (await admin.verifyUsername(data.username)) {
    invalid(issue.username("Esiste già un altro utente con questo nome"));
  }

  const profile = { ...data, password: data._password };
  const user = await admin.addUser(profile);

  logger.info({ message: "created new user", userId: user.id });
});

export const deleteUserForm = form(deleteUserFormSchema, async (data) => {
  const admin = await requireAdmin();
  const user = await admin.getUser(data.id);

  if (!user) {
    return;
  }

  await user.delete();

  logger.info({ message: "deleted user", userId: user.id });
});

export const updateUserForm = form(updateUserFormSchema, async (data, issue) => {
  const admin = await requireAdmin();
  const user = await admin.getUser(data.id);

  if (!user) {
    return;
  }

  const userProfile = await user.getProfile();

  if (data.username !== userProfile.username && (await admin.verifyUsername(data.username))) {
    invalid(issue.username("Esiste già un altro utente con questo nome"));
  }

  const profile = { ...data, password: data._password };
  await user.updateProfile(profile);

  logger.info({ message: "updated user", userId: user.id });
});
