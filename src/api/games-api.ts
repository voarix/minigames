const API_BASE_URL =
  "https://faxb76kxra.execute-api.eu-central-1.amazonaws.com/api";

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
