import * as v from "valibot";
import { userIdSchema } from "#lib/entities/user/id.ts";
import { paginationSortColumns } from "#lib/entities/user/pagination.ts";
import { paginationSchemaFactory } from "#lib/pagination.ts";

export const addUserFormSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  _password: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  username: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
});

export const deleteUserFormSchema = v.object({
  id: userIdSchema,
});

export const updateUserFormSchema = v.object({
  id: userIdSchema,
  name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  // Password input is empty by the default since we obviously don't want to
  // send the password back to the user.
  _password: v.string(),
  username: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
});

export const paginationSchema = paginationSchemaFactory(paginationSortColumns);
