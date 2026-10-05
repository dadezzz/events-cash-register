import { CupsConnection } from "@workspace/cups";
import { CUPS_URL } from "$app/env/private";

export const cups = new CupsConnection(CUPS_URL);
