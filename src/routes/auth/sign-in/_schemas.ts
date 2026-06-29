import * as v from "valibot";

export const signInFormSchema = v.object({
  username: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  password: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
});
