import { Request, Response } from "express";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const dnaSnapshots = await db.collection("dna_sequences").get();
    let mutantCount = 0;
    let humanCount = 0;

    dnaSnapshots.forEach((doc) => {
      const data = doc.data();
      if (data.isMutant) {
        mutantCount++;
      } else {
        humanCount++;
      }
    });

    const ratio = humanCount > 0 ? mutantCount / humanCount : 0;

    res.status(200).json({
      count_mutant_dna: mutantCount,
      count_human_dna: humanCount,
      ratio,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve statistics" });
  }
};
