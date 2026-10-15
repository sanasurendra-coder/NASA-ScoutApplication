export interface AppApiError {
  status: number;
  message: string;
  code?: string;
  timestamp: string;
  originalError?: unknown;
}
