import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";

admin.initializeApp();

const corsHandler = cors({ origin: true });

import { isMutant } from "./mutant";
import { getStats } from "./stats";

exports.mutant = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => isMutant(req, res));
});

exports.stats = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => getStats(req, res));
});
