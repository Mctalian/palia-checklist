import pino from "pino";
import { isDebug } from "./params";

export const logger = pino();

if (isDebug) {
  logger.level = "debug";
  logger.debug("Debug mode is enabled");
}
