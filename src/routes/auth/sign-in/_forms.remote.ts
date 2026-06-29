import { invalid } from "@sveltejs/kit";
import { User } from "#lib/entities/user/index.ts";
import { getRedirectParam, redirect } from "#lib/redirect.ts";
import { form, getRequestEvent } from "$app/server";
import { signInFormSchema } from "./_schemas.ts";

export const signInForm = form(signInFormSchema, async (data, issue) => {
  const user = await User.fromUsernameAndPassword(data.username, data.password);

  if (!user) {
    invalid(issue.password("Nome utente o password non trovati"));
  }

  await user.createSessionCookie();
  redirect(getRedirectParam(getRequestEvent().url));
});
