import pino from "pino";
import { isDebug } from "./params";

export const logger = pino({
  level: isDebug ? "debug" : "info",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
        level: isDebug ? "debug" : "info",
      },
      {
        target: "pino/file",
        options: { destination: "./logs/weekly-reset.log", mkdir: true },
        level: "debug",
      },
    ],
  },
});
