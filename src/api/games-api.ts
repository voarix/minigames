import { API_BASE_URL } from "./api-config.ts";

export interface ApiGameCard {
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly price: string;
  readonly shortDescription: string;
  readonly rating: number;
  readonly likesCount: number;
  readonly cardImage: string;
}

interface GamesResponse {
  readonly data: readonly ApiGameCard[];
}

export const getFeaturedGames = async () => {
  const response = await fetch(API_BASE_URL + "/games?featured=true");

  if (!response.ok) {
    throw new Error("Failed to load featured games");
  }

  const result: GamesResponse = await response.json();
  return result.data;
};

export const getGames = async (): Promise<readonly ApiGameCard[]> => {
  const response = await fetch(API_BASE_URL + "/games?limit=6");

  if (!response.ok) {
    throw new Error("Failed to load games");
  }

  const result: GamesResponse = await response.json();
  return result.data;
};
