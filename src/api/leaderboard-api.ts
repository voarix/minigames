import { API_BASE_URL } from "./api-config.ts";

export interface LeaderboardPlayer {
  readonly rank: number;
  readonly playerName: string;
  readonly gamesPlayed: number;
  readonly totalScore: number;
  readonly streakDays: number;
  readonly favoriteGameSlug: string;
  readonly favoriteGameName: string;
}

interface LeaderboardResponse {
  readonly data: readonly LeaderboardPlayer[];
}

export const getLeaderboard = async () => {
  const response = await fetch(API_BASE_URL + "/leaderboard");

  if (!response.ok) {
    throw new Error("Failed to load leaderboard");
  }

  const result: LeaderboardResponse = await response.json();
  return result.data;
};
