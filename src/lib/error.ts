import { error } from "@sveltejs/kit";
import { newRedirectParam, redirect } from "./redirect.ts";

export const e = {
  error400: () => error(400, "Richiesta invalida"),
  error404: () => error(404, "Pagina non trovata"),
  error500: () => error(500, "Errore del server"),
  requireSignIn: (returnPath: string) => redirect(`/auth/sign-in?${newRedirectParam(returnPath)}`),
};
