import { defineBoolean, defineSecret } from "firebase-functions/params";

export const doResetWeek = defineBoolean("DO_RESET_WEEK", { default: false });
export const wikiApiUrl = defineSecret("WIKI_API_URL");
export const wikiUsername = defineSecret("WIKI_USERNAME");
export const wikiPassword = defineSecret("WIKI_PASSWORD");
