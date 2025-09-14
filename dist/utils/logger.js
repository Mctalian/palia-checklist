"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const params_1 = require("./params");
exports.logger = (0, pino_1.default)();
if (params_1.isDebug) {
  exports.logger.level = "debug";
  exports.logger.debug("Debug mode is enabled");
}
//# sourceMappingURL=logger.js.map
