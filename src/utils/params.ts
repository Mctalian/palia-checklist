export const isDebug = process.env.DEBUG === "true";
export const isDryRun = process.env.DO_WEEKLY_RESET !== "true";
export const wikiApiUrl = process.env.WIKI_API_URL || "";
export const wikiUsername = process.env.WIKI_USERNAME || "";
export const wikiPassword = process.env.WIKI_PASSWORD || "";
