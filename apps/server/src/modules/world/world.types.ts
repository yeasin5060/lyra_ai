export interface NewsArticle {
  id: string;
  title: string;
  snippet: string;
  source: string;
  sourceUrl: string;
  imageUrl?: string;
  publishedAt: string;
  category: "bangladesh" | "international" | "tech" | "politics" | "general";
  spokenSummary: string;
}

export interface WeatherReport {
  city: string;
  temperatureC: number;
  condition: string;
  conditionBangla: string;
  humidity: number;
  windSpeedKmH: number;
  precipitationMm: number;
  spokenSummary: string;
}

export interface SearchResult {
  query: string;
  title: string;
  snippet: string;
  sourceUrl: string;
  sourceName: string;
  spokenSummary: string;
}

