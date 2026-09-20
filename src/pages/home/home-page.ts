import { createCarousel } from "../../components/carousel/carousel.ts";
import { createGameDeveloper } from "../../components/game-developer/game-developer.ts";
import { createHero } from "../../components/hero/hero.ts";
import { createLeaderboard } from "../../components/leaderboard/leaderboard.ts";

export const createHomePage = (): HTMLElement => {
  const main = document.createElement("main");
  const hero = createHero();
  const carousel = createCarousel();
  const leaderboard = createLeaderboard();
  const gameDeveloper = createGameDeveloper();

  main.append(hero, carousel, leaderboard, gameDeveloper);

  return main;
};
