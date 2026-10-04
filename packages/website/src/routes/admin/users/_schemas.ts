import * as v from "valibot";

export const addUserFormSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  _password: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  username: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
});
