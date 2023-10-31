import { CallableRequest, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { firestore } from "firebase-admin";
import {
  CollectionReference,
  DocumentReference,
  Firestore,
} from "firebase-admin/firestore";
import { wikiApiUrl, wikiUsername, wikiPassword } from "../utils/params";
import {
  WeeklyWant,
  getVillagerWeeklyWants,
  villagerWeeklyWants,
} from "../utils/gifts";
import { CURRENT_NUMBER_OF_VILLAGERS } from "../utils/villagers";
import { getEnglishVillagerPages } from "../utils/page-helpers";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

type GetVillagerGiftsRequest = {
  villager?: string;
};

type GetVillagerGiftsResponse = {
  wants: VillagerWant[];
};

type WeeklyWantsDocSchema = {
  lastPaliaWeeklyReset: string;
};

type VillagerWant = {
  villager: string;
  level: number;
  item: string;
};

export const getVillagerWants = onCall(
  {
    secrets: [wikiApiUrl, wikiUsername, wikiPassword],
  },
  async (
    request: CallableRequest<GetVillagerGiftsRequest>,
  ): Promise<GetVillagerGiftsResponse> => {
    // No input data is required for this function right now.
    const { villager } = request.data;

    const db = firestore();

    const allWants = await getAllWeeklyWants(db);

    let wants;
    if (villager) {
      wants = allWants.filter(
        (w) => w.villager.toUpperCase() === villager.toUpperCase(),
      );
    } else {
      wants = allWants.sort((a, b) => a.villager.localeCompare(b.villager));
    }

    return {
      wants,
    };
  },
);

async function getWeeklyWantsDoc(db: Firestore) {
  return db
    .collection("palia")
    .doc("weekly-wants") as DocumentReference<WeeklyWantsDocSchema>;
}

async function getAllWeeklyWants(db: Firestore) {
  const areStale = await areWeeklyWantsStale(db);
  const areFilled = await areAllVillagerWeeklyWantsFilled(db);
  if (!areStale && areFilled) {
    return getAllExistingVillagerWants(db);
  }

  await queryWiki();
  await logLastResetTime(db);
  await addWeeklyWantsToCollections(db);
  const weeklyWants: VillagerWant[] = [];
  for (const [villager, wants] of villagerWeeklyWants.entries()) {
    weeklyWants.push(
      ...wants.map(({ item, level }: WeeklyWant) => ({
        villager,
        item,
        level,
      })),
    );
  }
  return weeklyWants;
}

async function queryWiki() {
  await getVillagerWeeklyWants();
}

async function logLastResetTime(db: Firestore) {
  const doc = await getWeeklyWantsDoc(db);
  const t = new Date();
  const lastSunday = new Date(t.setDate(t.getDate() - t.getDay()));
  const lastSundayResetTime = new Date(lastSunday.setUTCHours(3, 0, 0, 0));
  await doc.set({
    lastPaliaWeeklyReset: lastSundayResetTime.toUTCString(),
  });
}

async function areAllVillagerWeeklyWantsFilled(db: Firestore) {
  const collections = await getWeeklyWantsVillagerCollections(db);
  if (collections.length < CURRENT_NUMBER_OF_VILLAGERS) {
    logger.info(
      `Don't have enough collections ${collections.length} < ${CURRENT_NUMBER_OF_VILLAGERS}`,
    );
    return false;
  }

  const reduced = await getAllExistingVillagerWants(db, collections);

  logger.info(reduced, { structuredData: true });

  // We should have 4 levels of gifts for each villager
  if (reduced.length !== CURRENT_NUMBER_OF_VILLAGERS * 4) {
    logger.info(
      `Don't have enough gifts ${reduced.length} < ${
        CURRENT_NUMBER_OF_VILLAGERS * 4
      }`,
    );
    return false;
  }

  // If an item is blank, we definitely aren't filled for every villager
  return reduced.filter((w) => w.item).length === reduced.length;
}

async function areWeeklyWantsStale(db: Firestore) {
  const doc = await getWeeklyWantsDoc(db);
  const weeklyWantsSnapshot = await doc.get();

  const data = weeklyWantsSnapshot.data();

  if (!data) {
    return true;
  }

  const now = new Date();
  const lastReset = new Date(data.lastPaliaWeeklyReset);

  return now.getTime() - lastReset.getTime() >= ONE_WEEK;
}

async function getWeeklyWantsVillagerCollections(db: Firestore) {
  return (await db
    .collection("palia")
    .doc("weekly-wants")
    .listCollections()) as CollectionReference<VillagerWant>[];
}

async function getAllExistingVillagerWants(
  db: Firestore,
  collections?: CollectionReference<VillagerWant>[],
) {
  if (!collections) {
    collections = await getWeeklyWantsVillagerCollections(db);
  }
  const collectionsWants = await Promise.all(
    collections.map((c) => getExistingVillagerWeeklyWants(db, c)),
  );
  return collectionsWants.reduce((p, c) => {
    return p.concat(c);
  }, [] as VillagerWant[]);
}

async function getExistingVillagerWeeklyWants(
  db: Firestore,
  collection: CollectionReference<VillagerWant>,
) {
  const documentRefs = await collection.listDocuments();
  const villagerWeeklyWants: VillagerWant[] = [];
  for (const ref of documentRefs) {
    const doc = await ref.get();
    const data = doc.data();
    if (data) {
      villagerWeeklyWants.push(data);
    }
  }

  return villagerWeeklyWants;
}

async function addWeeklyWantsToCollections(db: Firestore) {
  const enVillagers = await getEnglishVillagerPages();

  for (const villager of enVillagers.map((p) => p.title)) {
    const doc = await getWeeklyWantsDoc(db);
    const villagerWants = villagerWeeklyWants.get(villager);
    if (villagerWants) {
      for (const { item, level } of villagerWants) {
        await doc
          .collection(villager)
          .doc(`level-${level}`)
          .set({ villager, item, level });
      }
    }
  }
}
