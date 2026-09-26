import "./library-cards.scss";
import { allGames } from "../../data/games.ts";
import { createLibraryCard } from "../library-card/library-card.ts";

export const createLibraryCards = (): HTMLElement => {
  const list = document.createElement("ul");
  list.className = "library-cards";

  for (const game of allGames.slice(0, 6)) {
    const item = document.createElement("li");
    item.className = "library-cards__item";
    item.append(createLibraryCard(game));
    list.append(item);
  }

  return list;
};
