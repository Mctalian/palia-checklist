"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetWeeklyWants = resetWeeklyWants;
const logger_1 = require("./logger");
const page_helpers_1 = require("./page-helpers");
const wiki_api_1 = require("./wiki-api");
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
  const wiki = await wiki_api_1.WikiApi.getInstance();
  const weeklyWantPages = await (0, page_helpers_1.getWeeklyWantTranscludes)();
  logger_1.logger.debug(JSON.stringify(weeklyWantPages, null, 2));
  if (dryRun) {
    logger_1.logger.info(
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
//# sourceMappingURL=reset-weekly-wants.js.map
