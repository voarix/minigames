import { createCarousel } from "../../components/carousel/carousel.ts";
import { createGameDeveloper } from "../../components/game-developer/game-developer.ts";
import { createHero } from "../../components/hero/hero.ts";
import { createLeaderboard } from "../../components/leaderboard/leaderboard.ts";

interface HomePage {
  readonly element: HTMLElement;
  readonly destroy: () => void;
}

export const createHomePage = (
  onDetails: () => void,
  onBrowseLibrary: () => void,
): HomePage => {
  const main = document.createElement("main");
  const hero = createHero(onBrowseLibrary);
  const carousel = createCarousel(onDetails);
  const leaderboard = createLeaderboard();
  const gameDeveloper = createGameDeveloper();

  main.append(hero, carousel.element, leaderboard.element, gameDeveloper);

  return {
    element: main,
    destroy: () => {
      carousel.destroy();
      leaderboard.destroy();
    },
  };
};
