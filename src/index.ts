import dotenv from "dotenv";

dotenv.config({ quiet: true });

import { resetWeeklyWants } from "./utils/reset-weekly-wants";
import { isDryRun } from "./utils/params";
import { logger } from "./utils/logger";

logger.info("Starting Weekly reset...");

(async () => {
  if (!isDryRun) {
    logger.warn("Dry run is disabled, this will make live edits!");
  } else {
    logger.info("Dry run is enabled, no live edits will be made.");
  }

  await resetWeeklyWants(isDryRun);
})();
