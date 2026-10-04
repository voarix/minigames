import { API_BASE_URL } from "./api-config.ts";

export interface ApiGameComment {
  readonly commentId: string;
  readonly authorName: string;
  readonly text: string;
  readonly likesCount: number;
  readonly isLikedByCurrentUser: boolean;
  readonly createdAt: string;
}

interface GameCommentsResponse {
  readonly data: readonly ApiGameComment[];
  readonly meta: {
    readonly totalComments: number;
    readonly returnedCount: number;
    readonly sort: "newest";
  };
}

export const getGameComments = async (slug: string) => {
  const query = new URLSearchParams({ limit: "3", sort: "newest" });
  const response = await fetch(
    API_BASE_URL + "/games/" + slug + "/comments?" + query,
  );

  if (!response.ok) {
    throw new Error("Failed to load game comments.");
  }

  const result: GameCommentsResponse = await response.json();
  return result;
};
