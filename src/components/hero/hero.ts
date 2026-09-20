import "./hero.scss";

export const createHero = (): HTMLElement => {
  const hero = document.createElement("section");
  const container = document.createElement("div");
  const content = document.createElement("div");
  const title = document.createElement("h1");
  const description = document.createElement("p");
  const button = document.createElement("button");
  const desktopDescription = document.createElement("span");
  const mobileDescription = document.createElement("span");
  const tabletLineBreak = document.createElement("br");

  hero.className = "hero";
  container.className = "hero__container";
  content.className = "hero__content";
  title.className = "hero__title";
  description.className = "hero__description";
  button.className = "hero__button";

  desktopDescription.className = "hero__description-desktop";
  mobileDescription.className = "hero__description-mobile";
  tabletLineBreak.className = "hero__description-break";

  title.append("Take a Short Break & ", "Have Fun");

  desktopDescription.append(
    "Discover hundreds of curated casual mini-games. Play instantly",
    tabletLineBreak,
    " in your browser — puzzle, match 3, farm, and board classics.",
  );

  mobileDescription.textContent =
    "Discover hundreds of curated casual mini-games right in your browser.";

  description.append(desktopDescription, mobileDescription);

  button.type = "button";
  button.textContent = "Browse Library";

  content.append(title, description, button);
  container.append(content);
  hero.append(container);

  return hero;
};
