import { apiClient } from "./client";

interface IProgressPayload {
  score: number;
  timeMs: number;
  mistakes: number;
}

export async function saveUserProgress(result: IProgressPayload, gameName?: string): Promise<void> {
  try {
    await apiClient.post(
      "/user-progress",
      { score: result.score, timeMs: result.timeMs, mistakes: result.mistakes, gameName },
      { withAuth: true },
    );
  } catch {
    // Endpoint not yet implemented on backend (BE-07) — fail silently
  }
}
