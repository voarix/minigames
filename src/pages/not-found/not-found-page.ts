import "./not-found-page.scss";

export const createNotFoundPage = (onHome: () => void): HTMLElement => {
  const main = document.createElement("main");
  const title = document.createElement("h1");
  const description = document.createElement("p");
  const homeButton = document.createElement("button");

  main.className = "not-found-page";
  title.className = "not-found-page__title";
  title.textContent = "404 Page Not Found";
  description.className = "not-found-page__description";
  description.textContent = "This page doesn't exist";
  homeButton.className = "not-found-page__button";
  homeButton.type = "button";
  homeButton.textContent = "Return to Home Page";
  homeButton.addEventListener("click", onHome);

  main.append(title, description, homeButton);
  return main;
};
