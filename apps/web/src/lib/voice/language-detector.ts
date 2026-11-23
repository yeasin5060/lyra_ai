export type DetectedLanguage = "bn" | "en" | "mixed";

export interface DetectionResult {
  language: DetectedLanguage;
  confidence: number;
  banglaCharacters: number;
  englishCharacters: number;
}

/**
 * Fast client-side language detection for Bengali vs English.
 */
export function detectLanguage(text: string): DetectionResult {
  if (!text || text.trim().length === 0) {
    return {
      language: "en",
      confidence: 1.0,
      banglaCharacters: 0,
      englishCharacters: 0
    };
  }

  // Bengali Unicode range: 0980-09FF
  const banglaMatches = text.match(/[\u0980-\u09FF]/g) || [];
  // English alphabet: A-Z, a-z
  const englishMatches = text.match(/[a-zA-Z]/g) || [];

  const banglaCount = banglaMatches.length;
  const englishCount = englishMatches.length;
  const total = banglaCount + englishCount;

  if (total === 0) {
    return {
      language: "en",
      confidence: 0.5,
      banglaCharacters: 0,
      englishCharacters: 0
    };
  }

  const banglaRatio = banglaCount / total;
  const englishRatio = englishCount / total;

  if (banglaRatio > 0.6) {
    return {
      language: "bn",
      confidence: Number(banglaRatio.toFixed(2)),
      banglaCharacters: banglaCount,
      englishCharacters: englishCount
    };
  }

  if (englishRatio > 0.6) {
    return {
      language: "en",
      confidence: Number(englishRatio.toFixed(2)),
      banglaCharacters: banglaCount,
      englishCharacters: englishCount
    };
  }

  return {
    language: "mixed",
    confidence: Number(Math.max(banglaRatio, englishRatio).toFixed(2)),
    banglaCharacters: banglaCount,
    englishCharacters: englishCount
  };
}
