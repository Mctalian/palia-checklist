import { /* CallableRequest,*/ onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
// import { CollectionReference, DocumentSnapshot, Firestore } from "firebase-admin/firestore";
// import * as Wikiapi from "wikiapi";
import { wikiApiUrl, wikiUsername, wikiPassword } from "../utils/params";

admin.initializeApp({
  projectId: "palia-checklist",
});

// type GetWeeklyWantsRequest = object

type GetWeeklyWantsResponse = {
  wants: VillagerWant[];
};

type VillagerWant = {
  villager: string;
  level: number;
  item: string;
};

export const getWeeklyWants = onCall(
  {
    secrets: [wikiApiUrl, wikiUsername, wikiPassword],
  },
  async (/* request: CallableRequest<GetWeeklyWantsRequest>*/): Promise<GetWeeklyWantsResponse> => {
    // No input data is required for this function right now.
    // const data = request.data;
    logger.info("Getting weekly wants!");
    return {
      wants: [],
    };
  },
);
