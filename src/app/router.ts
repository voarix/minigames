import type { GameSort } from "../api/games-api.ts";
import type { AuthMode } from "../components/auth-dialog/auth-dialog.ts";

export type Page = "home" | "library" | "not-found";

export interface LibraryState {
  readonly category: string;
  readonly sort: GameSort;
  readonly page: number;
}

const isGameSort = (value: string | null): value is GameSort =>
  ["rating-desc", "rating-asc", "name-asc", "name-desc"].includes(value ?? "");

export const getPageFromPath = (pathname: string): Page => {
  if (pathname === "/" || pathname === "/home") {
    return "home";
  }

  return pathname === "/library" ? "library" : "not-found";
};

export const getGameSlugFromSearch = (search: string): string | undefined => {
  const parameters = new URLSearchParams(search);
  return parameters.get("game") || undefined;
};

export const getAuthModeFromSearch = (search: string): AuthMode | undefined => {
  const parameters = new URLSearchParams(search);
  const mode = parameters.get("auth");
  return mode === "login" || mode === "register" ? mode : undefined;
};

export const getLibraryStateFromSearch = (search: string): LibraryState => {
  const parameters = new URLSearchParams(search);
  const category = parameters.get("category") || "all";
  const sort = parameters.get("sort");
  const page = Number(parameters.get("page") ?? "1");

  return {
    category,
    sort: isGameSort(sort) ? sort : "rating-desc",
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  };
};

export const getLibrarySearchFromState = (
  state: LibraryState,
  search: string = "",
): string => {
  const parameters = new URLSearchParams(search);
  parameters.set("category", state.category);
  parameters.set("sort", state.sort);
  parameters.set("page", String(state.page));
  return `?${parameters}`;
};
