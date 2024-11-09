"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkMutantDNA, fetchStats } from "@/services/api";

interface Stats {
  totalMutants: number;
  totalHumans: number;
}

export default function Checker() {
  const [dnaInput, setDnaInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const fetchStatistics = async () => {
    setIsStatsLoading(true);
    try {
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  const exampleDNA = "ATGCGA\nCAGTGC\nTTATGT\nAGAAGG\nCCCCTA\nTCACTG";

  const handleCopyExample = async () => {
    try {
      await navigator.clipboard.writeText(exampleDNA);
      setCopySuccess("Example DNA copied to clipboard!");
      setTimeout(() => setCopySuccess(null), 2000); // Clear message after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopySuccess("Failed to copy DNA to clipboard.");
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (refreshCountdown === null) return;

    if (refreshCountdown > 0) {
      const timerId = setTimeout(() => {
        setRefreshCountdown(refreshCountdown - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      setRefreshCountdown(null);
    }
  }, [refreshCountdown]);

  const handleSubmit = async () => {
    setError(null);
    setResult(null);

    // Validate DNA input format
    const dnaSequences = dnaInput.trim().split("\n");

    // Check if there are exactly 6 sequences
    if (dnaSequences.length !== 6) {
      setError("Please enter exactly 6 DNA sequences.");
      return;
    }

    // Check if each sequence is 6 characters long
    const isValidDNA = dnaSequences.every((sequence) =>
      /^[ATCG]{6}$/.test(sequence)
    );
    if (!isValidDNA) {
      setError(
        "Each DNA sequence must be exactly 6 characters long and contain only A, T, C, and G."
      );
      return;
    }

    setIsLoading(true);
    try {
      const dnaResult = await checkMutantDNA(dnaSequences);
      setResult(dnaResult);
      fetchStatistics();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshClick = () => {
    fetchStatistics();
    setRefreshCountdown(30);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Mutant DNA Checker
      </h1>

      <div>
        <p className="text-sm text-gray-600 mb-2">
          Enter DNA sequences (one per line, exactly 6 lines and 6 characters
          per line):
        </p>
        <Textarea
          value={dnaInput}
          onChange={(e) => setDnaInput(e.target.value)}
          placeholder={"ATGCGA\nCAGTGC\nTTATGT\nAGAAGG\nCCCCTA\nTCACTG"}
          className="mb-4 h-40"
        />
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking DNA...
              </>
            ) : (
              "Check DNA"
            )}
          </Button>
          <Button
            onClick={handleCopyExample}
            variant="outline"
            className="flex items-center"
            title="Copy example DNA"
          >
            <Copy className="h-4 w-4 mr-1" />
          </Button>
        </div>
        {copySuccess && (
          <p className="text-green-500 text-sm mt-2">{copySuccess}</p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Alert>
          <AlertTitle>Result</AlertTitle>
          <AlertDescription>{result}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {stats ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Mutants
                </p>
                <p className="text-2xl font-bold">{stats.totalMutants}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Humans
                </p>
                <p className="text-2xl font-bold">{stats.totalHumans}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </CardContent>
      </Card>
      <Button
        onClick={handleRefreshClick}
        className="w-full"
        disabled={!!refreshCountdown || isStatsLoading}
      >
        {isStatsLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Refreshing Stats...
          </>
        ) : refreshCountdown ? (
          `Wait ${refreshCountdown}s`
        ) : (
          "Refresh Stats"
        )}
      </Button>
    </div>
  );
}
