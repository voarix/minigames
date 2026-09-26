import "./game-details.scss";
import closeIcon from "../../assets/icons/close-details.svg";

interface GameDetailsDialog {
  readonly element: HTMLDialogElement;
  readonly open: () => void;
  readonly close: () => void;
}

export const createGameDetails = (): GameDetailsDialog => {
  const dialog = document.createElement("dialog");
  const panel = document.createElement("section");
  const closeButton = document.createElement("button");
  const closeImage = document.createElement("img");
  const title = document.createElement("h2");

  dialog.className = "game-details";
  panel.className = "game-details__panel";
  closeButton.className = "game-details__close";
  title.className = "game-details__title";

  title.id = "game-details-title";
  title.textContent = "Tukoni: Forest Keepers";
  dialog.setAttribute("aria-labelledby", title.id);

  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close game details");
  closeImage.src = closeIcon;
  closeImage.alt = "";
  closeButton.append(closeImage);
  panel.append(closeButton, title);
  dialog.append(panel);

  let isClosing = false;
  let wasBackdropPressed = false;

  const open = (): void => {
    if (dialog.open) return;

    dialog.classList.remove("game-details--closing");
    isClosing = false;
    wasBackdropPressed = false;
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
