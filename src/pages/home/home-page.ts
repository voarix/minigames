import { createHero } from "../../components/hero/hero.ts";

export const createHomePage = (): HTMLElement => {
  const main = document.createElement("main");
  const hero = createHero();

  main.append(hero);

  return main;
};
