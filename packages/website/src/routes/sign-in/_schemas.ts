import * as v from "valibot";

export const signInFormSchema = v.object({
  _password: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  username: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
});
