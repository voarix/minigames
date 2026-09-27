import "./game-details.scss";
import heroImage from "../../assets/games/tukoni-forest-keepers-hero.jpg";
import { createGameDetailsInfo } from "./game-details-info";
import closeIcon from "../../assets/icons/close-details.svg";
import { createGameDetailsRecords } from "./game-details-records.ts";
import { createGameDetailsComments } from "./game-details-comments.ts";

interface GameDetailsDialog {
  readonly element: HTMLDialogElement;
  readonly open: () => void;
  readonly close: () => void;
}

export const createGameDetails = (): GameDetailsDialog => {
  const dialog = document.createElement("dialog");
  const panel = document.createElement("div");
  const closeButton = document.createElement("button");
  const closeImage = document.createElement("img");
  const hero = document.createElement("img");
  const content = document.createElement("div");

  dialog.className = "game-details";
  panel.className = "game-details__panel";
  closeButton.className = "game-details__close";
  hero.className = "game-details__hero";
  hero.src = heroImage;
  hero.alt = "Tukoni: Forest Keepers forest characters";
  content.className = "game-details__body";

  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close game details");
  closeImage.src = closeIcon;
  closeImage.alt = "";
  closeButton.append(closeImage);
  panel.append(hero, closeButton, content);
  dialog.append(panel);

  let isClosing = false;
  let wasBackdropPressed = false;

  const open = (): void => {
    if (dialog.open) return;

    dialog.classList.remove("game-details--closing");
    isClosing = false;
    wasBackdropPressed = false;
    content.replaceChildren(
      createGameDetailsInfo(),
      createGameDetailsRecords(),
      createGameDetailsComments(),
    );
    dialog.setAttribute("aria-labelledby", "game-details-title");
    dialog.showModal();
    document.body.classList.add("game-details-open");
    dialog.scrollTop = 0;
  };

  const close = (): void => {
    if (isClosing || !dialog.open) return;

    isClosing = true;
    dialog.classList.add("game-details--closing");
  };

  dialog.addEventListener("animationend", (event) => {
    if (event.target !== dialog || event.animationName !== "game-details-out") {
      return;
    }

    dialog.close();
    dialog.classList.remove("game-details--closing");
    document.body.classList.remove("game-details-open");
    isClosing = false;
  });

  closeButton.addEventListener("click", close);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener("pointerdown", (event) => {
    wasBackdropPressed = event.target === dialog;
  });
  dialog.addEventListener("click", (event) => {
    if (wasBackdropPressed && event.target === dialog) close();
  });

  return { element: dialog, open, close };
};
