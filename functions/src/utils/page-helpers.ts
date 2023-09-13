import { Wiki, WikiPage } from "./types";

/**
 *
 * @param {Wiki} wiki - the instantiated wikiapi object
 * @return {WikiPage[]} - English pages for villagers
 */
export async function getEnglishVillagerPages(wiki: Wiki) {
  const villagers = await wiki.categorymembers("Villager");
  const villagerPageTitles = villagers
    .filter((p: WikiPage) => p.title.indexOf("/") < 0)
    .map((p: WikiPage) => p.title);
  const includesWeeklyWants = await wiki.embeddedin("Template:Weekly_Wants");
  return includesWeeklyWants.filter((a: WikiPage) =>
    villagerPageTitles.includes(a.title),
  );
}
