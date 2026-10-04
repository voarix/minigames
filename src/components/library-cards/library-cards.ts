import "./library-cards.scss";
import type { GameCardData } from "../../data/games.ts";
import { createLibraryCard } from "../library-card/library-card.ts";

export const createLibraryCards = (
  games: readonly GameCardData[],
  onDetails: (slug: string) => void,
): HTMLElement => {
  const list = document.createElement("ul");
  list.className = "library-cards";

  for (const game of games) {
    const item = document.createElement("li");
    item.className = "library-cards__item";
    item.append(createLibraryCard(game, onDetails));
    list.append(item);
  }

  return list;
};

export const createLibraryCardsSkeleton = (): HTMLElement => {
  const list = document.createElement("ul");
  list.className = "library-cards";
  list.setAttribute("aria-hidden", "true");

  for (let index = 0; index < 6; index += 1) {
    const item = document.createElement("li");
    const placeholder = document.createElement("div");
    item.className = "library-cards__item";
    placeholder.className = "library-cards__skeleton";
    item.append(placeholder);
    list.append(item);
  }

  return list;
};
