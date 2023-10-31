import { onSchedule } from "firebase-functions/v2/scheduler";
import {
  doResetWeek,
  wikiApiUrl,
  wikiUsername,
  wikiPassword,
} from "../utils/params";
import * as logger from "firebase-functions/logger";
import * as Wikiapi from "wikiapi";
import { WikiPage } from "../utils/types";
import { getEnglishVillagerWeeklyWantSubPages } from "../utils/page-helpers";
import { getLoggedInWiki } from "../utils/wiki";

const { skip_edit: skipEdit } = Wikiapi;

export const paliaWikiResetWeeklyWants = onSchedule(
  {
    schedule: "0 22 * * SUN",
    timeZone: "America/Denver",
    timeoutSeconds: 240,
    secrets: [wikiApiUrl, wikiUsername, wikiPassword],
    serviceAccount:
      "reset-weekly-wants-fn@palia-checklist.iam.gserviceaccount.com",
  },
  async () => {
    logger.info(`doResetWeek? ${doResetWeek.value().toString()}`, {
      structuredData: true,
    });
    await resetWeeklyWants().catch((reason: unknown) => {
      if (reason instanceof Error) {
        logger.error(`${reason.name}: ${reason.message}`, {
          structuredData: true,
        });
        logger.error(reason.stack, { structuredData: true });
      } else {
        logger.error(JSON.stringify(reason), { structuredData: true });
      }
      return;
    });
    const successMessage = doResetWeek.value()
      ? "Weekly Wants Reset"
      : "We didn't actually do anything";
    logger.log(successMessage, { structuredData: true });
  },
);

const clearWants = 
`{{Weekly Wants
  |
  |
  |
  |
}}`;

/**
 * Edits each English villager page to reset the Weekly Wants
 */
async function resetWeeklyWants() {
  const wiki = await getLoggedInWiki();

  const enVillagerWeeklyWantSubpages = await getEnglishVillagerWeeklyWantSubPages(wiki);

  await wiki.for_each_page(
    enVillagerWeeklyWantSubpages,
    (pageData: WikiPage) => {
      const editedText = pageData.wikitext.replace(
        /\{\{Weekly Wants[\s\S]*?\}\}/,
        clearWants,
      );
      if (doResetWeek.value()) {
        logger.info("Actually resetting!", { structuredData: true });
        return editedText;
      } else {
        logger.info("No edit!", { structuredData: true });
        return skipEdit;
      }
    },
    {
      summary: "Reset weekly wants",
      bot: 1,
      minor: 1,
    },
  );
}
