import { Wiki, WikiPage } from "./types";

/**
 *
 * @param {Wiki} wiki - the instantiated wikiapi object
 * @return {WikiPage[]} - English pages for villagers
 */
export async function getEnglishVillagerPages(wiki: Wiki) {
  const villagers = await wiki.categorymembers("Villager");
  return villagers
    .filter((p: WikiPage) => p.title.indexOf("/") < 0);
}

/**
 *
 * @param {Wiki} wiki - the instantiated wikiapi object
 * @return {WikiPage[]} - English pages for villagers
 */
export async function getEnglishVillagerWeeklyWantSubPages(wiki: Wiki) {
  const villagers = await getEnglishVillagerPages(wiki);
  const villagerPageTitles = villagers
    .filter((p: WikiPage) => p.title.indexOf("/") < 0)
    .map((p: WikiPage) => `${p.title}/Weekly Wants`);
  const includesWeeklyWants = await wiki.embeddedin("Template:Weekly_Wants");
  return includesWeeklyWants.filter(p => {
    return villagerPageTitles.includes(p.title);
  });
}
