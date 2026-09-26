import "./library-page.scss";
import { createLibraryCards } from "../../components/library-cards/library-cards.ts";
import { createLibraryFilters } from "../../components/library-filters/library-filters.ts";
import { createLibraryPagination } from "../../components/library-pagination/library-pagination.ts";

export const createLibraryPage = (): HTMLElement => {
  const main = document.createElement("main");
  const container = document.createElement("div");
  const title = document.createElement("h1");
  const description = document.createElement("p");
  const filters = createLibraryFilters();
  const cards = createLibraryCards();
  const pagination = createLibraryPagination();

  main.className = "library-page";
  container.className = "library-page__container";
  title.className = "library-page__title";
  description.className = "library-page__description";

  title.textContent = "Game Library";
  description.textContent = "Browse our collection of casual mini-games";

  container.append(title, description, filters, cards, pagination);
  main.append(container);

  return main;
};
