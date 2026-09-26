import "./library-cards.scss";
import { allGames } from "../../data/games.ts";

export const createLibraryCards = (): HTMLElement => {
  const list = document.createElement("ul");
  list.className = "library-cards";

  for (const game of allGames.slice(0, 6)) {
    const item = document.createElement("li");
    item.className = "library-cards__item";
    item.textContent = game.name;
    list.append(item);
  }

  return list;
};
