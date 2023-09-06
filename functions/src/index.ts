/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest, Request } from "firebase-functions/v2/https";
import { defineBoolean, defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import * as express from "express";
import * as Wikiapi from "wikiapi";

const { skip_edit: skipEdit } = Wikiapi;

const doResetWeek = defineBoolean("DO_RESET_WEEK", { default: false }).value();
const wikiApiUrl = defineSecret("WIKI_API_URL").value();
const wikiUsername = defineSecret("WIKI_USERNAME").value();
const wikiPassword = defineSecret("WIKI_PASSWORD").value();

type Wiki = {
  categorymembers: (s: string) => Promise<WikiPage[]>;
  embeddedin: (s: string) => Promise<WikiPage[]>;
}

type WikiPage = {
  title: string;
  wikitext: string;
}

export const paliaWikiResetWeeklyWants = onRequest(
  async (request: Request, response: express.Response<unknown>) => {
    logger.info(`doResetWeek? ${doResetWeek.toString()}`, { structuredData: true });
    await resetWeeklyWants();
    response.send("Weekly Wants Reset");
  }
);


/**
 *
 * @param {Wiki} wiki - the instantiated wikiapi object
 * @return {string} - English pages for villagers
 */
async function getEnglishVillagerPages(wiki: Wiki) {
  const villagers = await wiki.categorymembers("Villager");
  const villagerPageTitles = villagers.map((p: WikiPage) => p.title);
  const includesWeeklyWants = await wiki.embeddedin("Template:Weekly_Wants");
  return includesWeeklyWants.filter(
    (a: WikiPage) => villagerPageTitles.includes(a.title)
  );
}

/**
 * Edits each English villager page to reset the Weekly Wants
 */
export async function resetWeeklyWants() {
  const wiki = new Wikiapi(wikiApiUrl);
  await wiki.login(wikiUsername, wikiPassword);

  const enVillagers = await getEnglishVillagerPages(wiki);

  await wiki.for_each_page(
    enVillagers,
    (pageData: WikiPage) => {
      const editedText = pageData.wikitext.replace(
        /\{\{Weekly Wants.*\}\}/,
        "{{Weekly Wants|ChapaaCurious|ChapaaCurious|ChapaaCurious|ChapaaCurious}}"
      );
      if (doResetWeek) {
        logger.info("Actually resetting!", { structuredData: true });
        return editedText;
      } else {
        logger.info("No edit!", { structuredData: true });
        return skipEdit;
      }
    }, {
      summary: "Reset weekly wants",
      bot: 1,
      minor: 1,
    }
  );
}

