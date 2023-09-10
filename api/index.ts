import dotenv from "dotenv";
import express from "express";
import Wikiapi from "wikiapi";

import {
  getAllVillagerLikesAndWeeklyWants,
  getVillagerWeeklyWants,
  knownGifts,
  resetWeeklyWants,
  villagerLikes,
  villagerWeeklyWants,
} from "./src/gifts";
import { allItems, getAllKnownItems } from "./src/items";

dotenv.config();

const { WIKI_API_URL, WIKI_USERNAME, WIKI_PASSWORD } = process.env;

let wiki;

(async () => {
  wiki = new Wikiapi(WIKI_API_URL);
  await wiki.login(WIKI_USERNAME, WIKI_PASSWORD);

  await getAllKnownItems(wiki);

  await getAllVillagerLikesAndWeeklyWants(wiki);

  const diff = new Set(knownGifts);
  for (const item of allItems) {
    diff.delete(item);
  }

  if (diff.size) {
    console.warn("Found gift(s) missing from all items.");
    console.log([...diff]);
  }

  const app = express();

  app.get("/weekly-wants", async (req, res, next) => {
    res.json([...villagerWeeklyWants]);
  });

  app.get("/known-gifts", (req, res, next) => {
    res.json([...knownGifts]);
  });

  app.get("/likes", (req, res, next) => {
    res.json([...villagerLikes]);
  });

  // app.get("/items", (req, res, next) => {
  //   res.json([...allItems]);
  // });

  // app.post("/reset-weekly", async (req, res, next) => {
  //   await resetWeeklyWants(wiki)
  //   res.status(200).send("Weekly Wants Reset");
  // });

  app.listen(3000, () => {
    console.log("Server runniong on port 3000");
  });
})();
