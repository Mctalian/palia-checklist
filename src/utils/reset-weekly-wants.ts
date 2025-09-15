import { logger } from "./logger";
import { getWeeklyWantTranscludes } from "./page-helpers";
import { WikiApi } from "./wiki-api";

const clearWants = `{{Weekly Wants
  |
  |
  |
  |
}}`;

/**
 * Edits each Weekly Wants subpage with the clearWants template
 * @param {boolean} dryRun - If true, will not make live edits
 */
async function resetWeeklyWants(dryRun = true) {
  const wiki = await WikiApi.getInstance();
  const weeklyWantPages = await getWeeklyWantTranscludes();

  logger.debug(JSON.stringify(weeklyWantPages, null, 2));

  if (dryRun) {
    logger.info(
      `Dry run enabled, would have reset ${weeklyWantPages.length} pages`,
    );
    return;
  }

  const requests = [];
  for (const subpage of weeklyWantPages) {
    logger.info(`Resetting ${subpage}`);
    requests.push(wiki.edit(subpage, clearWants, "Reset Weekly Wants"));
  }
  await Promise.all(requests);

  logger.info(`Successfully reset ${weeklyWantPages.length} pages`);

  logger.info("Purging Category:Villager");
  await wiki.purge("Category:Villager");
  logger.info("Purging weekly want sub-pages");
  await wiki.purge(weeklyWantPages.join("|"));

  logger.info("Weekly wants reset complete");
}

export { resetWeeklyWants };
