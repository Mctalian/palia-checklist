import { getEnglishVillagerPages } from "./page-helpers";
import { getLoggedInWiki } from "./wiki";

export const CURRENT_NUMBER_OF_VILLAGERS = 24;

export async function allVillagers() {
  const wiki = await getLoggedInWiki();
  return (await getEnglishVillagerPages(wiki)).map((p) => p.title);
}
