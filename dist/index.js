"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ quiet: true });
const reset_weekly_wants_1 = require("./utils/reset-weekly-wants");
const params_1 = require("./utils/params");
const logger_1 = require("./utils/logger");
logger_1.logger.info("Starting Weekly reset...");
(async () => {
  if (!params_1.isDryRun) {
    logger_1.logger.warn("Dry run is disabled, this will make live edits!");
  } else {
    logger_1.logger.info("Dry run is enabled, no live edits will be made.");
  }
  await (0, reset_weekly_wants_1.resetWeeklyWants)(params_1.isDryRun);
})();
//# sourceMappingURL=index.js.map
