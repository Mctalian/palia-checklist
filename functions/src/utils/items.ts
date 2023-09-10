import { Wiki } from "./types";

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

export async function getAllKnownItems(wiki: Wiki) {
  await Promise.all([
    getAllArrows(wiki),
    getAllBait(wiki),
    getAllBugs(wiki),
    getAllConsumables(wiki),
    getAllCrops(wiki),
    getAllDishes(wiki),
    getAllFertilizers(wiki),
    getAllFireworks(wiki),
    getAllFish(wiki),
    getAllGatherables(wiki),
    getAllIngredients(wiki),
    getAllJunk(wiki),
    getAllMaterials(wiki),
    getAllShinyPebbles(wiki),
    getAllSeeds(wiki),
    getAllSmokeBombs(wiki),
    getAllTreasureChests(wiki),
  ]);
}

async function getAllArrows(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Arrow", { namespace: "0" })).map(
    (p) => p.title,
  );
  for (const page of pages) {
    arrowItems.add(page);
  }
  console.assert(
    arrowItems.size > 0,
    "There must have been a category change because arrowItemns has no elements.",
  );
  return arrowItems;
}

async function getAllBait(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Bait", { namespace: "0" })).map(
    (p) => p.title,
  );
  for (const page of pages) {
    baitItems.add(page);
  }
  console.assert(
    baitItems.size > 0,
    "There must have been a category change because baitItems has no elements.",
  );
  return baitItems;
}

async function getAllBugs(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Insect", { namespace: "0" })).map(
    (p) => p.title,
  );
  for (const page of pages) {
    bugItems.add(page);
  }
  console.assert(
    bugItems.size > 0,
    "There must have been a category change because bugItems has no elements.",
  );
  return bugItems;
}

async function getAllCrops(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Crop", { namespace: "0" })).map(
    (p) => p.title,
  );
  for (const page of pages) {
    cropItems.add(page);
  }
  console.assert(
    cropItems.size > 0,
    "There must have been a category change because cropItems has no elements.",
  );
  return cropItems;
}

async function getAllConsumables(wiki: Wiki) {
  const pages = (
    await wiki.categorymembers("Consumable", { namespace: "0" })
  ).map((p) => p.title);
  for (const page of pages) {
    consumableItems.add(page);
  }
  console.assert(
    consumableItems.size > 0,
    "There must have been a category change because consumableItems has no elements.",
  );
  return consumableItems;
}

async function getAllDishes(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Dish", { namespace: "0" })).map(
    (p) => p.title,
  );
  for (const page of pages) {
    dishItems.add(page);
  }
  console.assert(
    dishItems.size > 0,
    "There must have been a category change because dishItems has no elements.",
  );
  return dishItems;
}

async function getAllFertilizers(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Fertilizer")).map((p) => p.title);
  for (const page of pages) {
    fertilizerItems.add(page);
  }
  console.assert(
    fertilizerItems.size > 0,
    "There must have been a category change because fertilizerItems has no elements.",
  );
  return fertilizerItems;
}

async function getAllFireworks(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Firework")).map((p) => p.title);
  for (const page of pages) {
    fireworkItems.add(page);
  }
  console.assert(
    fireworkItems.size > 0,
    "There must have been a category change because fireworkItems has no elements.",
  );
  return fireworkItems;
}

async function getAllFish(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Fish")).map((p) => p.title);
  for (const page of pages) {
    fishItems.add(page);
  }
  console.assert(
    fishItems.size > 0,
    "There must have been a category change because fishItems has no elements.",
  );
  return fishItems;
}

async function getAllGatherables(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Gatherable")).map((p) => p.title);
  for (const page of pages) {
    gatherableItems.add(page);
  }
  console.assert(
    gatherableItems.size > 0,
    "There must have been a category change because gatherableItems has no elements.",
  );
  return gatherableItems;
}

async function getAllIngredients(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Ingredient")).map((p) => p.title);
  for (const page of pages) {
    ingredientItems.add(page);
  }
  console.assert(
    ingredientItems.size > 0,
    "There must have been a category change because ingredientItems has no elements.",
  );
  return ingredientItems;
}

async function getAllJunk(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Junk")).map((p) => p.title);
  for (const page of pages) {
    junkItems.add(page);
  }
  console.assert(
    junkItems.size > 0,
    "There must have been a category change because junkItems has no elements.",
  );
  return junkItems;
}

async function getAllMaterials(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Material")).map((p) => p.title);
  for (const page of pages) {
    materialItems.add(page);
  }
  console.assert(
    materialItems.size > 0,
    "There must have been a category change because materialItems has no elements.",
  );
  return materialItems;
}

async function getAllShinyPebbles(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Shiny Pebble")).map(
    (p) => p.title,
  );
  for (const page of pages) {
    pebbleItems.add(page);
  }
  console.assert(
    pebbleItems.size > 0,
    "There must have been a category change because pebbleItems has no elements.",
  );
  return pebbleItems;
}

async function getAllSeeds(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Seed")).map((p) => p.title);
  for (const page of pages) {
    seedItems.add(page);
  }
  console.assert(
    seedItems.size > 0,
    "There must have been a category change because seedItems has no elements.",
  );
  return seedItems;
}

async function getAllSmokeBombs(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Smoke Bomb")).map((p) => p.title);
  for (const page of pages) {
    smokeBombItems.add(page);
  }
  console.assert(
    smokeBombItems.size > 0,
    "There must have been a category change because smokeBombItems has no elements.",
  );
  return smokeBombItems;
}

async function getAllTreasureChests(wiki: Wiki) {
  const pages = (await wiki.categorymembers("Treasure Chest")).map(
    (p) => p.title,
  );
  for (const page of pages) {
    treasureChestItems.add(page);
  }
  console.assert(
    treasureChestItems.size > 0,
    "There must have been a category change because treasureChestItems has no elements.",
  );
  return treasureChestItems;
}
