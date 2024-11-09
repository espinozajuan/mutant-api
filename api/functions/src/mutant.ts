import { Request, Response } from "express";
import * as admin from "firebase-admin";

const db = admin.firestore();

const isMutantSequence = (sequence: string[]): boolean => {
  // Store unique sequences of 4 identical charss
  const sequences = new Set<string>();

  // Adds sequences of 4 consecutive identical letters to the set
  const addSequence = (seq: string) => {
    if (seq.length >= 4) sequences.add(seq);
  };

  // Loop through each cell in the 6x6 matrix
  for (let row = 0; row < sequence.length; row++) {
    for (let col = 0; col < sequence[row].length; col++) {
      // Horizontal
      if (col + 3 < sequence[row].length) {
        addSequence(sequence[row].substring(col, col + 4));
      }

      // Vertical
      if (row + 3 < sequence.length) {
        addSequence(
          sequence[row][col] +
            sequence[row + 1][col] +
            sequence[row + 2][col] +
            sequence[row + 3][col]
        );
      }

      // Diagonal (down-right)
      if (row + 3 < sequence.length && col + 3 < sequence[row].length) {
        addSequence(
          sequence[row][col] +
            sequence[row + 1][col + 1] +
            sequence[row + 2][col + 2] +
            sequence[row + 3][col + 3]
        );
      }

      // Diagonal (down-left)
      if (row + 3 < sequence.length && col - 3 >= 0) {
        addSequence(
          sequence[row][col] +
            sequence[row + 1][col - 1] +
            sequence[row + 2][col - 2] +
            sequence[row + 3][col - 3]
        );
      }
    }
  }

  // Mutant if there are at least two sequences with 4 identical letters
  return (
    Array.from(sequences).filter((seq) => /AAAA|CCCC|GGGG|TTTT/.test(seq))
      .length > 1
  );
};

export const isMutant = async (req: Request, res: Response): Promise<void> => {
  const { dna } = req.body;

  // Validate the DNA array structure
  if (
    !dna ||
    !Array.isArray(dna) ||
    dna.length !== 6 ||
    !dna.every((seq) => typeof seq === "string")
  ) {
    res.status(400).json({
      error: "Invalid DNA format. Must be an array of 6 DNA strings.",
    });
    return;
  }

  // Check if each DNA string is exactly 6 characters long
  if (!dna.every((seq) => seq.length === 6)) {
    res
      .status(400)
      .json({ error: "Each DNA string must be exactly 6 characters long." });
    return;
  }

  const mutantDetected = isMutantSequence(dna);

  try {
    // Store the result in Firestore
    await db.collection("dna_sequences").add({
      dna,
      isMutant: mutantDetected,
    });

    if (mutantDetected) {
      res.status(200).send("Mutant detected");
    } else {
      res.status(403).send("Forbidden");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to process DNA sequence" });
  }
};
