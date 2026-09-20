import { createCarousel } from "../../components/carousel/carousel.ts";
import { createHero } from "../../components/hero/hero.ts";
import { createLeaderboard } from "../../components/leaderboard/leaderboard.ts";

export const createHomePage = (): HTMLElement => {
  const main = document.createElement("main");
  const hero = createHero();
  const carousel = createCarousel();
  const leaderboard = createLeaderboard();

  main.append(hero, carousel, leaderboard);

  return main;
};
