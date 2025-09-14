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
    requests.push(wiki.edit(subpage, clearWants, "Reset Weekly Wants"));
  }
  await Promise.all(requests);

  await wiki.purge("Category:Villager");
  await wiki.purge(weeklyWantPages.join("|"));
}

export { resetWeeklyWants };
