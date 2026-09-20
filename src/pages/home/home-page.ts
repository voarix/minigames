import { createCarousel } from "../../components/carousel/carousel.ts";
import { createHero } from "../../components/hero/hero.ts";

export const createHomePage = (): HTMLElement => {
  const main = document.createElement("main");
  const hero = createHero();
  const carousel = createCarousel();

  main.append(hero, carousel);

  return main;
};
