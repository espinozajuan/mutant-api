import axios from "axios";

const MUTANT_URL = process.env.NEXT_PUBLIC_MUTANT_URL || "";
const STATS_URL = process.env.NEXT_PUBLIC_STATS_URL || "";

export const checkMutantDNA = async (dna: string[]): Promise<string> => {
  try {
    const response = await axios.post(MUTANT_URL, { dna });
    return response.status === 200
      ? "Mutant DNA detected!"
      : "No mutant DNA detected.";
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return "No mutant DNA detected.";
    } else {
      throw new Error("An error occurred while checking the DNA.");
    }
  }
};

export const fetchStats = async (): Promise<{
  totalMutants: number;
  totalHumans: number;
}> => {
  const response = await axios.get(STATS_URL);
  const { count_mutant_dna, count_human_dna } = response.data;
  return {
    totalMutants: count_mutant_dna,
    totalHumans: count_human_dna,
  };
};
