import { CallableRequest, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { firestore } from "firebase-admin";
import {
  CollectionReference,
  DocumentSnapshot,
  Firestore,
} from "firebase-admin/firestore";
import { wikiApiUrl, wikiUsername, wikiPassword } from "../utils/params";
import {
  arrowItems,
  baitItems,
  bugItems,
  consumableItems,
  cropItems,
  dishItems,
  fertilizerItems,
  fireworkItems,
  fishItems,
  gatherableItems,
  getAllKnownItems,
  junkItems,
  materialItems,
  pebbleItems,
  seedItems,
  smokeBombItems,
  treasureChestItems,
} from "../utils/items";

type GetAllItemsRequest = {
  reset: boolean;
};

type GetAllItemsResponse = {
  items: string[];
  nextRefresh: string;
};

type ItemTypesDocSchema = {
  name: string;
};

type ItemDocSchema = {
  lastRefreshTime: string;
};

const THIRTY_MINUTES = 30 * 60 * 1000;

export const getAllItems = onCall(
  {
    secrets: [wikiApiUrl, wikiUsername, wikiPassword],
  },
  async (
    request: CallableRequest<GetAllItemsRequest>,
  ): Promise<GetAllItemsResponse> => {
    const { reset } = request.data;
    const db = firestore();
    // const itemsCollection = await db.collection("palia").doc('items').
    // // logger.info(itemsCollection, { structuredData: true });
    // const items = await itemsCollection.listDocuments();
    const items = await getItemsFromTypeCollections(db);
    logger.info(items, { structuredData: true });
    if (items.size === 0 || reset) {
      await queryWiki();
      await addItemsToCollections(db);
      await logLastRefreshTime(db);
      return {
        items: Array.from(await getItemsFromTypeCollections(db)),
        nextRefresh: await timeOfNextAutoRefresh(db),
      };
    } else {
      logger.info("We have existing data!");
      // Kick off a refresh of the data;
      const isStale = await isDataStale(db);
      if (isStale) {
        logger.info("Aaaaaand it's stale :/");
        await queryWiki();
        await logLastRefreshTime(db);
        await addItemsToCollections(db);
      }
      return {
        items: Array.from(items),
        nextRefresh: await timeOfNextAutoRefresh(db),
      };
    }
  },
);

async function getItemsFromTypeCollections(db: Firestore) {
  const collections = (await db
    .collection("palia")
    .doc("items")
    .listCollections()) as CollectionReference<ItemTypesDocSchema>[];
  const collectionsItems = await Promise.all(
    collections.map((c) => getItemsFromSingleTypeCollection(db, c)),
  );
  logger.info(collectionsItems, { structuredData: true });
  const reduced = collectionsItems.reduce((p, c) => {
    return new Set<string>([...p, ...c]);
  }, new Set<string>());
  return new Set<string>(
    [...reduced].filter((e) => e.indexOf("Materials") < 0).sort(),
  );
}

async function getItemsFromSingleTypeCollection(
  db: Firestore,
  collection: CollectionReference<ItemTypesDocSchema>,
) {
  const documentRefs = await collection.listDocuments();
  const itemNames = new Set<string>();
  for (const ref of documentRefs) {
    const doc = await ref.get();
    const data = doc.data();
    if (data) {
      itemNames.add(data.name);
    }
  }
  return itemNames;
}

async function queryWiki() {
  await getAllKnownItems();
}

async function logLastRefreshTime(db: Firestore) {
  await db.collection("palia").doc("items").set({
    lastRefreshTime: new Date().toUTCString(),
  });
}

async function isDataStale(db: Firestore) {
  const itemsRef = (await db
    .collection("palia")
    .doc("items")
    .get()) as DocumentSnapshot<ItemDocSchema>;
  const data = itemsRef.data();
  if (!data || !data.lastRefreshTime) {
    return true;
  }
  const now = new Date();
  const lastRefresh = new Date(data.lastRefreshTime);

  return now.getTime() - lastRefresh.getTime() >= THIRTY_MINUTES;
}

async function timeOfNextAutoRefresh(db: Firestore) {
  const itemsRef = (await db
    .collection("palia")
    .doc("items")
    .get()) as DocumentSnapshot<ItemDocSchema>;
  const data = itemsRef.data();
  if (!data) {
    return new Date().toUTCString();
  }

  const now = new Date();
  const lastRefresh = new Date(data.lastRefreshTime);

  const msUntilRefresh =
    THIRTY_MINUTES - (now.getTime() - lastRefresh.getTime());
  return new Date(Date.now() + msUntilRefresh).toUTCString();
}

async function addItemsToCollections(db: Firestore) {
  await Promise.all([
    addItemsToSingleCollection(db, "arrows", arrowItems),
    addItemsToSingleCollection(db, "baits", baitItems),
    addItemsToSingleCollection(db, "bugs", bugItems),
    addItemsToSingleCollection(db, "consumables", consumableItems),
    addItemsToSingleCollection(db, "crops", cropItems),
    addItemsToSingleCollection(db, "dishes", dishItems),
    addItemsToSingleCollection(db, "fertilizers", fertilizerItems),
    addItemsToSingleCollection(db, "fireworks", fireworkItems),
    addItemsToSingleCollection(db, "fish", fishItems),
    addItemsToSingleCollection(db, "gatherables", gatherableItems),
    addItemsToSingleCollection(db, "junk", junkItems),
    addItemsToSingleCollection(db, "materials", materialItems),
    addItemsToSingleCollection(db, "shiny-pebbles", pebbleItems),
    addItemsToSingleCollection(db, "seeds", seedItems),
    addItemsToSingleCollection(db, "smoke-bombs", smokeBombItems),
    addItemsToSingleCollection(db, "treasure-chests", treasureChestItems),
  ]);
}

async function addItemsToSingleCollection(
  db: Firestore,
  subcollection: string,
  items: Set<string>,
) {
  const collection = await db
    .collection("palia")
    .doc("items")
    .collection(subcollection);

  for (const item of items) {
    await collection.doc(item).set({ name: item });
  }
}
