import { getEnglishVillagerPages } from "./page-helpers";

export const CURRENT_NUMBER_OF_VILLAGERS = 24;

export async function allVillagers() {
  return (await getEnglishVillagerPages()).map((p) => p.title);
}
