import * as v from "valibot";
import { userIdSchema } from "#lib/entities/user/id.ts";
import { type UserPrivilege, userPrivilegesMetadata } from "#lib/entities/user/privilege.ts";

export const deleteUserFormSchema = v.object({
  id: userIdSchema,
});

export const updateUserFormSchema = v.object({
  // Password input is empty by the default since we obviously don't want to
  // send the password back to the user.
  _password: v.string(),
  id: userIdSchema,
  name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  username: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
});

export const updateUserPrivilegeFormSchema = v.object({
  id: userIdSchema,
  privileges: v.array(
    v.object({
      granted: v.optional(v.boolean(), false),
      name: v.pipe(
        v.picklist(Object.keys(userPrivilegesMetadata)),
        v.transform((i) => i as UserPrivilege),
      ),
    }),
  ),
});
