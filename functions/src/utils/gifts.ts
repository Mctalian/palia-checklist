import {
  fishItems,
  pebbleItems,
  bugItems,
  treasureChestItems,
  arrowItems,
} from "./items";
import { skip_edit as skipEdit } from "wikiapi";
import { Wiki, WikiPage } from "./types";

const CURRENT_NUMBER_OF_VILLAGERS = 23;

export type WeeklyWant = {
  item: string;
  level: number;
};

export const villagerLikes = new Map<string, Set<string>>();
export const villagerWeeklyWants = new Map<string, WeeklyWant[]>();

export const knownGifts = new Set<string>();

function getVillagerLikes(pageData: WikiPage) {
  const pageText = pageData.wikitext;
  // console.log(pageText);
  const likesSectionHeader = "==== Likes ====\n";
  const beginningOfLikesSection = pageText.indexOf(likesSectionHeader);
  const sectionEnder = "\n\n"; // Assumption
  const endOfLikesSection = pageText.indexOf(
    sectionEnder,
    beginningOfLikesSection,
  );
  const likesSection = pageText
    .substring(beginningOfLikesSection, endOfLikesSection)
    .substring(likesSectionHeader.length);
  const likesList = likesSection
    .replace(new RegExp(/\*.*\[\[/, "g"), "")
    .replace(new RegExp(/\]\].*/, "g"), "")
    .replace("Fish|fish", "Any fish")
    .replace("Fish|Any Fish", "Any fish")
    .replace("Bugs|Any Bugs", "Any bugs")
    .replace("Einar#Shiny Pebbles|Shiny Pebble", "Any shiny pebble")
    .replace("Hunting#Arrows|Any Arrow", "Any arrow")
    .replace("Treasure Chests|Any treasure chest", "Any treasure chest")
    .split("\n")
    .filter((g) => !g.startsWith("<!--") && !g.endsWith("-->"));
  const foundAnyFish = likesList.indexOf("Any fish");
  if (foundAnyFish >= 0) {
    likesList.splice(foundAnyFish, 1, ...fishItems);
  }
  const foundAnyPebble = likesList.indexOf("Any shiny pebble");
  if (foundAnyPebble >= 0) {
    likesList.splice(foundAnyPebble, 1, ...pebbleItems);
  }
  const foundAnyBug = likesList.indexOf("Any bugs");
  if (foundAnyBug >= 0) {
    likesList.splice(foundAnyBug, 1, ...bugItems);
  }
  const foundAnyArrow = likesList.indexOf("Any arrow");
  if (foundAnyArrow >= 0) {
    likesList.splice(foundAnyArrow, 1, ...arrowItems);
  }
  const foundAnyTreasureChest = likesList.indexOf("Any treasure chest");
  if (foundAnyTreasureChest >= 0) {
    likesList.splice(foundAnyTreasureChest, 1, ...treasureChestItems);
  }
  const foundAnotherAny = likesList.filter((l) => l.indexOf("Any") >= 0);
  if (foundAnotherAny.length) {
    console.warn('Still have an "Any"');
    console.log(pageData.title, foundAnotherAny);
  }
  return new Set<string>(likesList);
}

export function getVillagerWeeklyWants(pageData: WikiPage) {
  const pageText = pageData.wikitext;
  // console.log(pageText);
  const weeklyWantsTemplate = "{{Weekly Wants|";
  const beginningOfWeeklyWants = pageText.indexOf(weeklyWantsTemplate);
  const templateEnder = "}}"; // Assumption
  const endOfWeeklyWantsSection = pageText.indexOf(
    templateEnder,
    beginningOfWeeklyWants,
  );
  const weeklyWantsSection = pageText
    .substring(beginningOfWeeklyWants, endOfWeeklyWantsSection)
    .substring(weeklyWantsTemplate.length);
  return weeklyWantsSection.split("|");
}

async function getEnglishVillagerPages(wiki: Wiki) {
  const villagers = await wiki.categorymembers("Villager");
  const villagerPageTitles = villagers.map((p) => p.title);
  const includesWeeklyWants = await wiki.embeddedin("Template:Weekly_Wants");
  return includesWeeklyWants.filter((a) =>
    villagerPageTitles.includes(a.title),
  );
}

export async function resetWeeklyWants(wiki: Wiki) {
  const enVillagers = await getEnglishVillagerPages(wiki);

  await wiki.for_each_page(
    enVillagers,
    (pageData) => {
      const editedText = pageData.wikitext.replace(
        /\{\{Weekly Wants.*\}\}/,
        "{{Weekly Wants|ChapaaCurious|ChapaaCurious|ChapaaCurious|ChapaaCurious}}",
      );
      return editedText;
    },
    {
      summary: "Reset weekly wants",
      bot: 1,
      minor: 1,
    },
  );
}

export async function getAllVillagerLikesAndWeeklyWants(
  wiki: Wiki,
  startListener = true,
) {
  const enVillagers = await getEnglishVillagerPages(wiki);

  console.assert(
    enVillagers.length === CURRENT_NUMBER_OF_VILLAGERS,
    `Villager count does not equal ${CURRENT_NUMBER_OF_VILLAGERS}, did a new villager get added? Or did we pick up a non-English translated page?`,
  );

  await wiki.for_each_page(enVillagers, (pageData) => {
    const likesList = getVillagerLikes(pageData);
    villagerLikes.set(pageData.title, likesList);
    for (const like of likesList) {
      if (like === "ChapaaCurious") {
        continue;
      }
      knownGifts.add(like);
    }
    const weeklyWantsList = getVillagerWeeklyWants(pageData);
    villagerWeeklyWants.set(
      pageData.title,
      weeklyWantsList.map((w, i) => ({
        item: w !== "ChapaaCurious" ? w : "",
        level: i + 1,
      })),
    );
    for (const want of weeklyWantsList) {
      if (want === "ChapaaCurious") {
        continue;
      }
      knownGifts.add(want);
    }
    return skipEdit;
  });

  const enVillagerTitles = enVillagers.map((p) => p.title);

  if (startListener) {
    await wiki.listen(
      async (pageData) => {
        console.log(pageData.title, JSON.stringify(pageData));
        await getAllVillagerLikesAndWeeklyWants(wiki, false);
      },
      {
        delay: "2m",
        filter: (pageData) => {
          return enVillagerTitles.includes(pageData.title);
        },
        namespace: "0",
      },
    );
  }
}
