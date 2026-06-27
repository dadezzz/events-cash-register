import { invalid } from "@sveltejs/kit";
import { requireAdmin } from "#lib/auth/index.server.ts";
import { form } from "$app/server";
import { addUserFormSchema, deleteUserFormSchema, updateUserFormSchema } from "./_schemas.ts";

export const addUserForm = form(addUserFormSchema, async (data, issue) => {
  const admin = await requireAdmin();

  if (await admin.verifyUsername(data.username)) {
    invalid(issue.username("Esiste già un altro utente con questo nome"));
  }

  const profile = { ...data, password: data._password };
  await admin.addUser(profile);
});

export const deleteUserForm = form(deleteUserFormSchema, async (data) => {
  const admin = await requireAdmin();
  const user = await admin.getUser(data.id);
  await user?.delete();
});

export const updateUserForm = form(updateUserFormSchema, async (data, issue) => {
  const admin = await requireAdmin();
  const user = await admin.getUser(data.id);

  if (await admin.verifyUsername(data.username)) {
    invalid(issue.username("Esiste già un altro utente con questo nome"));
  }

  const profile = { ...data, password: data._password };
  user?.updateProfile(profile);
});
