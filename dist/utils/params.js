"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikiPassword =
  exports.wikiUsername =
  exports.wikiApiUrl =
  exports.isDryRun =
  exports.isDebug =
    void 0;
exports.isDebug = process.env.DEBUG === "true";
exports.isDryRun = process.env.DO_WEEKLY_RESET !== "true";
exports.wikiApiUrl = process.env.WIKI_API_URL || "";
exports.wikiUsername = process.env.WIKI_USERNAME || "";
exports.wikiPassword = process.env.WIKI_PASSWORD || "";
//# sourceMappingURL=params.js.map
