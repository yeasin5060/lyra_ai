export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface HealthResponse {
  success: boolean;
  service: string;
  version: string;
  status: "healthy" | "degraded";
  database: "connected" | "disconnected";
  timestamp: string;
}
