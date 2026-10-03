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

export type GameSort = "rating-desc" | "rating-asc" | "name-asc" | "name-desc";

interface GamesResponse {
  readonly data: readonly ApiGameCard[];
}

interface PaginatedGamesResponse extends GamesResponse {
  readonly meta: {
    readonly page: number;
    readonly limit: number;
    readonly totalItems: number;
    readonly totalPages: number;
    readonly appliedFilter: {
      readonly category: string;
      readonly sort: GameSort;
    };
  };
}

export const getFeaturedGames = async () => {
  const response = await fetch(API_BASE_URL + "/games?featured=true");

  if (!response.ok) {
    throw new Error("Failed to load featured games");
  }

  const result: GamesResponse = await response.json();
  return result.data;
};

export const getGames = async (
  category: string = "all",
  sort: GameSort = "rating-desc",
) => {
  const query = new URLSearchParams({ limit: "6", category, sort });
  const response = await fetch(API_BASE_URL + "/games?" + query);

  if (!response.ok) {
    throw new Error("Failed to load games");
  }

  const result: PaginatedGamesResponse = await response.json();
  return result;
};
