import "./game-developer.scss";
import developerIllustration from "../../assets/illustrations/game-developer.png";
import uploadIcon from "../../assets/icons/upload.svg";

export const createGameDeveloper = (): HTMLElement => {
  const section = document.createElement("section");
  const container = document.createElement("div");
  const illustration = document.createElement("div");
  const image = document.createElement("img");
  const content = document.createElement("div");
  const title = document.createElement("h2");
  const description = document.createElement("p");
  const button = document.createElement("button");
  const buttonIcon = document.createElement("img");
  const contact = document.createElement("p");

  section.className = "game-developer";
  container.className = "game-developer__container";
  illustration.className = "game-developer__illustration";
  image.className = "game-developer__image";
  content.className = "game-developer__content";
  title.className = "game-developer__title";
  description.className = "game-developer__description";
  button.className = "game-developer__button";
  buttonIcon.className = "game-developer__button-icon";
  contact.className = "game-developer__contact";

  title.id = "game-developer-title";
  title.textContent = "Are You a Game Developer?";
  description.textContent =
    "Want to see your game on MiniGames? We're always looking for fun,\nengaging mini games to add to our platform. Submit your game\nand reach thousands of players!";
  contact.textContent = "or contact us at developers@minigames.com";

  image.src = developerIllustration;
  image.alt = "";

  button.type = "button";
  buttonIcon.src = uploadIcon;
  buttonIcon.alt = "";
  button.append(buttonIcon, "Submit Form");

  section.setAttribute("aria-labelledby", title.id);
  illustration.setAttribute("aria-hidden", "true");

  illustration.append(image);
  content.append(title, description, button, contact);
  container.append(illustration, content);
  section.append(container);

  return section;
};
