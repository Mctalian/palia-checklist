import { onSchedule } from "firebase-functions/v2/scheduler";
import {
  doResetWeek,
  wikiApiUrl,
  wikiUsername,
  wikiPassword,
} from "../utils/params";
import * as logger from "firebase-functions/logger";
import { getEnglishVillagerWeeklyWantSubPageNames } from "../utils/page-helpers";
import { WikiApi } from "../utils/wiki-api";

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
  const wiki = await WikiApi.getInstance();
  const enVillagerWeeklyWantSubpages = await getEnglishVillagerWeeklyWantSubPageNames();

  logger.debug(enVillagerWeeklyWantSubpages, { structuredData: true });

  const requests = [];
  for (const subpage of enVillagerWeeklyWantSubpages) {
    requests.push(wiki.edit(subpage, clearWants, "Reset Weekly Wants"));
  }
  await Promise.all(requests);

  await wiki.purge("Category:Villager");
  await wiki.purge("Villager Weekly Wishes");
}
