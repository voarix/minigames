import { createRetryButton } from "../../components/ui/retry-button/retry-button.ts";
import "./library-page.scss";
import {
  createLibraryCards,
  createLibraryCardsSkeleton,
} from "../../components/library-cards/library-cards.ts";
import { createLibraryFilters } from "../../components/library-filters/library-filters.ts";
import { createLibraryPagination } from "../../components/library-pagination/library-pagination.ts";

import { getGames, type GameSort } from "../../api/games-api.ts";
import { resolveGameImage, type GameCardData } from "../../data/games.ts";
import { showSnackbar } from "../../components/snackbar/snackbar.ts";
import { getCategories } from "../../api/categories-api.ts";

interface LibraryPage {
  readonly element: HTMLElement;
  readonly destroy: () => void;
}

export const createLibraryPage = (onDetails: () => void): LibraryPage => {
  let isDestroyed = false;
  let selectedCategory = "all";
  let selectedSort: GameSort = "rating-desc";
  let gamesRequestId = 0;
  const main = document.createElement("main");
  const container = document.createElement("div");
  const title = document.createElement("h1");
  const description = document.createElement("p");
  const filters = document.createElement("div");
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
      const retryButton = createRetryButton(() => {
        void loadGames();
      });
      state.append(retryButton);
    }

    results.replaceChildren(state);
  };

  const loadGames = async (): Promise<void> => {
    const requestId = ++gamesRequestId;
    const loadingMessage = document.createElement("p");
    loadingMessage.className = "library-page__loading";
    loadingMessage.setAttribute("role", "status");
    loadingMessage.textContent = "Loading games…";
    results.setAttribute("aria-busy", "true");
    results.replaceChildren(loadingMessage, createLibraryCardsSkeleton());
    pagination.hidden = true;

    try {
      const { data: games } = await getGames(selectedCategory, selectedSort);
      if (isDestroyed || requestId !== gamesRequestId) return;

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
      if (isDestroyed || requestId !== gamesRequestId) return;
      showMessage("Failed to load games.", true);
      showSnackbar("Failed to load games. Please try again.", "error");
    } finally {
      if (!isDestroyed && requestId === gamesRequestId) {
        results.setAttribute("aria-busy", "false");
      }
    }
  };

  void loadGames();

  const showCategoriesMessage = (text: string, isError: boolean): void => {
    const state = document.createElement("div");
    const message = document.createElement("p");
    state.className = isError
      ? "library-page__state library-page__state--error"
      : "library-page__state";
    message.textContent = text;
    message.setAttribute("role", isError ? "alert" : "status");
    state.append(message);

    if (isError) {
      state.append(
        createRetryButton(() => {
          void loadCategories();
        }),
      );
    }

    filters.replaceChildren(state);
  };

  const loadCategories = async (): Promise<void> => {
    const loadingMessage = document.createElement("p");
    const skeleton = document.createElement("div");
    loadingMessage.className = "library-page__loading";
    loadingMessage.setAttribute("role", "status");
    loadingMessage.textContent = "Loading categories…";
    skeleton.className = "library-page__filters-skeleton";
    skeleton.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 7; index += 1) {
      const chip = document.createElement("span");
      chip.className = "library-page__filter-placeholder";
      skeleton.append(chip);
    }
    filters.setAttribute("aria-busy", "true");
    filters.replaceChildren(loadingMessage, skeleton);

    try {
      const categories = await getCategories();

      if (isDestroyed) return;

      if (categories.length === 0) {
        showCategoriesMessage("No categories found.", false);
        return;
      }

      const defaultCategory = categories.find((category) => category.isDefault);
      const previousCategory = selectedCategory;
      selectedCategory = defaultCategory?.slug ?? "all";

      filters.replaceChildren(
        createLibraryFilters(
          categories,
          (slug) => {
            if (selectedCategory === slug) return;
            selectedCategory = slug;
            void loadGames();
          },
          (sort) => {
            if (selectedSort === sort) return;
            selectedSort = sort;
            void loadGames();
          },
        ),
      );

      if (selectedCategory !== previousCategory) void loadGames();
    } catch {
      if (isDestroyed) return;

      showCategoriesMessage("Failed to load categories.", true);
      showSnackbar("Failed to load categories. Please try again.", "error");
    } finally {
      if (!isDestroyed) filters.setAttribute("aria-busy", "false");
    }
  };

  void loadCategories();

  return {
    element: main,
    destroy: () => {
      isDestroyed = true;
    },
  };
};
