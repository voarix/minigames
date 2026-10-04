import { API_BASE_URL } from "./api-config.ts";

interface GameTopRecord {
  readonly position: number;
  readonly playerName: string;
  readonly score: number;
  readonly achievedAt: string;
}

export interface ApiGameDetails {
  readonly slug: string;
  readonly name: string;
  readonly heroImage: string;
  readonly rating: number;
  readonly likesCount: number;
  readonly isLikedByCurrentUser: boolean;
  readonly fullDescription: string;
  readonly specs: {
    readonly genre: string;
    readonly players: string;
    readonly duration: string;
    readonly price: string;
  };
  readonly topRecords: readonly GameTopRecord[];
}

interface GameDetailsResponse {
  readonly data: ApiGameDetails;
}

export const getGameDetails = async (slug: string) => {
  const response = await fetch(API_BASE_URL + "/games/" + slug);

  if (response.status === 404) return;

  if (!response.ok) {
    throw new Error("Failed to load game details");
  }

  const result: GameDetailsResponse = await response.json();
  return result.data;
};
