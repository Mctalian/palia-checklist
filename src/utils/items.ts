import { WikiApi } from "./wiki-api";

export const arrowItems = new Set<string>();
export const baitItems = new Set<string>();
export const bugItems = new Set<string>();
export const consumableItems = new Set<string>();
export const cropItems = new Set<string>();
export const dishItems = new Set<string>();
export const fertilizerItems = new Set<string>();
export const fishItems = new Set<string>();
export const fireworkItems = new Set<string>();
export const gatherableItems = new Set<string>();
export const ingredientItems = new Set<string>();
export const junkItems = new Set<string>();
export const materialItems = new Set<string>();
export const pebbleItems = new Set<string>();
export const seedItems = new Set<string>();
export const smokeBombItems = new Set<string>();
export const treasureChestItems = new Set<string>();

export async function getAllKnownItems() {
  await Promise.all([
    getAllArrows(),
    getAllBait(),
    getAllBugs(),
    getAllConsumables(),
    getAllCrops(),
    getAllDishes(),
    getAllFertilizers(),
    getAllFireworks(),
    getAllFish(),
    getAllGatherables(),
    getAllIngredients(),
    getAllJunk(),
    getAllMaterials(),
    getAllShinyPebbles(),
    getAllSeeds(),
    getAllSmokeBombs(),
    getAllTreasureChests(),
  ]);
}

async function queryWikiForCategory(category: string, set: Set<string>) {
  const wiki = await WikiApi.getInstance();
  const pages = (await wiki.getPagesInCategory(category))?.filter(p => !p.title.includes("/")).filter(p => !p.title.includes("Category:")).map(
    (p) => p.title,
  ) ?? [];
  for (const page of pages) {
    set.add(page);
  }
  console.assert(
    set.size > 0,
    `There must have been a category change because we found no ${category} items.`,
  );
  return set;
}

async function getAllArrows() {
  await queryWikiForCategory("Arrow", arrowItems);
  return arrowItems;
}

async function getAllBait() {
  await queryWikiForCategory("Bait", baitItems);
  return baitItems;
}

async function getAllBugs() {
  await queryWikiForCategory("Insect", bugItems);
  return bugItems;
}

async function getAllCrops() {
  await queryWikiForCategory("Crop", cropItems);
  return cropItems;
}

async function getAllConsumables() {
  await queryWikiForCategory("Consumable", consumableItems);
  return consumableItems;
}

async function getAllDishes() {
  await queryWikiForCategory("Dish", dishItems);
  return dishItems;
}

async function getAllFertilizers() {
  await queryWikiForCategory("Fertilizer", fertilizerItems);
  return fertilizerItems;
}

async function getAllFireworks() {
  await queryWikiForCategory("Firework", fireworkItems);
  return fireworkItems;
}

async function getAllFish() {
  await queryWikiForCategory("Fish", fishItems);
  return fishItems;
}

async function getAllGatherables() {
  await queryWikiForCategory("Gatherable", gatherableItems);
  return gatherableItems;
}

async function getAllIngredients() {
  await queryWikiForCategory("Ingredient", ingredientItems);
  return ingredientItems;
}

async function getAllJunk() {
  await queryWikiForCategory("Junk", junkItems);
  return junkItems;
}

async function getAllMaterials() {
  const tempSet = await queryWikiForCategory("Material", new Set<string>());
  tempSet.forEach((item) => {
    if (item.indexOf("Materials") < 0 && item.indexOf("/") < 0 ) {
      materialItems.add(item);
    }
  });
  return materialItems;
}

async function getAllShinyPebbles() {
  await queryWikiForCategory("Shiny Pebble", pebbleItems);
  return pebbleItems;
}

async function getAllSeeds() {
  await queryWikiForCategory("Seed", seedItems);
  return seedItems;
}

async function getAllSmokeBombs() {
  await queryWikiForCategory("Smoke Bomb", smokeBombItems);
  return smokeBombItems;
}

async function getAllTreasureChests() {
  await queryWikiForCategory("Treasure Chest", treasureChestItems);
  return treasureChestItems;
}
