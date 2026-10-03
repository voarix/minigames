import "./library-page.scss";
import {
  createLibraryCards,
  createLibraryCardsSkeleton,
} from "../../components/library-cards/library-cards.ts";
import { createLibraryFilters } from "../../components/library-filters/library-filters.ts";
import { createLibraryPagination } from "../../components/library-pagination/library-pagination.ts";

import { getGames } from "../../api/games-api.ts";
import { resolveGameImage, type GameCardData } from "../../data/games.ts";
import { showSnackbar } from "../../components/snackbar/snackbar.ts";

interface LibraryPage {
  readonly element: HTMLElement;
  readonly destroy: () => void;
}

export const createLibraryPage = (onDetails: () => void): LibraryPage => {
  let isDestroyed = false;
  const main = document.createElement("main");
  const container = document.createElement("div");
  const title = document.createElement("h1");
  const description = document.createElement("p");
  const filters = createLibraryFilters();
  const results = document.createElement("div");
  const pagination = createLibraryPagination();

  main.className = "library-page";
  container.className = "library-page__container";
  title.className = "library-page__title";
  description.className = "library-page__description";

  results.className = "library-page__results";
  results.setAttribute("role", "region");
  results.setAttribute("aria-label", "Library games");

  title.textContent = "Game Library";
  description.textContent = "Browse our collection of casual mini-games";

  container.append(title, description, filters, results, pagination);
  main.append(container);

  const showMessage = (text: string, isError: boolean): void => {
    const state = document.createElement("div");
    const message = document.createElement("p");
    state.className = isError
      ? "library-page__state library-page__state--error"
      : "library-page__state";
    message.textContent = text;
    message.setAttribute("role", isError ? "alert" : "status");
    state.append(message);

    if (isError) {
      const retryButton = document.createElement("button");
      retryButton.className = "library-page__retry";
      retryButton.type = "button";
      retryButton.textContent = "Retry";
      retryButton.addEventListener("click", () => {
        void loadGames();
      });
      state.append(retryButton);
    }

    results.replaceChildren(state);
  };

  const loadGames = async (): Promise<void> => {
    const loadingMessage = document.createElement("p");
    loadingMessage.className = "library-page__loading";
    loadingMessage.setAttribute("role", "status");
    loadingMessage.textContent = "Loading games…";
    results.setAttribute("aria-busy", "true");
    results.replaceChildren(loadingMessage, createLibraryCardsSkeleton());
    pagination.hidden = true;

    try {
      const games = await getGames();
      if (isDestroyed) return;

      if (games.length === 0) {
        showMessage("No games found.", false);
        return;
      }

      const cards: GameCardData[] = games.map((game) => ({
        ...game,
        image: resolveGameImage(game.cardImage),
        featured: false,
      }));
      results.replaceChildren(createLibraryCards(cards, onDetails));
      pagination.hidden = false;
    } catch {
      if (isDestroyed) return;
      showMessage("Failed to load games.", true);
      showSnackbar("Failed to load games. Please try again.", "error");
    } finally {
      if (!isDestroyed) results.setAttribute("aria-busy", "false");
    }
  };

  void loadGames();

  return {
    element: main,
    destroy: () => {
      isDestroyed = true;
    },
  };
};
