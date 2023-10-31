import { WikiApi } from "./wiki-api";

/**
 *
 * @return {PageInCategory[]} - English pages for villagers
 */
export async function getEnglishVillagerPages() {
  const wiki = await WikiApi.getInstance();
  const villagers = (await wiki.getPagesInCategory("Villager")) ?? [];
  return villagers
    .filter((p) => p.title.indexOf("/") < 0);
}

/**
 *
 * @return {PageInCategory[]} - English Weekly Wants subpage names for villagers
 */
export async function getEnglishVillagerWeeklyWantSubPageNames() {
  const villagers = await getEnglishVillagerPages();
  const villagerPageTitles = villagers
    .filter((p) => p.title.indexOf("/") < 0)
    .filter((p) => p.title.indexOf("Category") < 0)
    .map((p) => `${p.title}/Weekly Wants`);
  return villagerPageTitles
  
}
