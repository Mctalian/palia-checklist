import * as admin from "firebase-admin";

admin.initializeApp({
  projectId: "palia-checklist",
});

export * from "./handlers";
export * from "./schedules";
