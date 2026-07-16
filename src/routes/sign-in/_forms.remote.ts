import { error, invalid } from "@sveltejs/kit";
import { Duration } from "#lib/duration.ts";
import { User } from "#lib/entities/user/index.ts";
import { getRedirectParam, redirect } from "#lib/redirect.ts";
import { logger } from "#lib/server/logger/request.ts";
import { RateLimiter } from "#lib/server/rate-limiter.ts";
import { getRequestClientIp } from "#lib/server/request/index.ts";
import { form, getRequestEvent } from "$app/server";
import { signInFormSchema } from "./_schemas.ts";

const ipRateLimiter = new RateLimiter("sign-in-ip", [
  { duration: Duration.fromSeconds(1), tokens: 1 },
  { duration: Duration.fromMinutes(5), tokens: 5 },
]);

export const signInForm = form(signInFormSchema, async (data, issue) => {
  const rlDate = await ipRateLimiter.consumeToken(getRequestClientIp());
  if (rlDate) {
    error(429, `Raggiunto il limite di tentativi, riprovare tra ${Duration.fromDate(rlDate).toString(2)}`);
  }

  const user = await User.fromUsernameAndPassword(data.username, data._password);

  if (!user) {
    invalid(issue._password("Nome utente o password non trovati"));
  }

  await user.createSessionCookie();

  logger.info("user signed in with password");
  redirect(getRedirectParam(getRequestEvent().url));
});
