/**
 * Review Logic Utilities for ToeVol
 * Contains helper functions for the review system
 */

/**
 * Normalize a string for comparison
 * - Lowercase
 * - Trim whitespace
 */
export function normalizeString(str: string): string {
  return str.trim().toLowerCase();
}

/**
 * Parse comma-separated synonyms string into array
 */
export function parseSynonyms(synonymsStr: string): string[] {
  if (!synonymsStr || !synonymsStr.trim()) {
    return [];
  }
  return synonymsStr
    .split(",")
    .map((s) => normalizeString(s))
    .filter(Boolean);
}

/**
 * Compare two string arrays, ignoring order and case
 * Returns missing and extra items
 */
export function compareStringArrays(
  expected: string[],
  actual: string[],
): {
  missing: string[];
  extra: string[];
  matching: string[];
  allMatch: boolean;
} {
  const normalizedExpected = expected.map(normalizeString);
  const normalizedActual = actual.map(normalizeString);

  const expectedSet = new Set(normalizedExpected);
  const actualSet = new Set(normalizedActual);

  const missing = normalizedExpected.filter((item) => !actualSet.has(item));
  const extra = normalizedActual.filter((item) => !expectedSet.has(item));
  const matching = normalizedExpected.filter((item) => actualSet.has(item));

  return {
    missing,
    extra,
    matching,
    allMatch: missing.length === 0,
  };
}

/**
 * Calculate score percentage
 */
export function calculateScorePercentage(
  correct: number,
  total: number,
): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Pick random items from array without duplicates
 */
export function pickRandom<T>(array: T[], count: number): T[] {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
}
