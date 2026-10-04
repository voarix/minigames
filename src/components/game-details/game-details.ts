import "./game-details.scss";
import { getGameDetails } from "../../api/game-details-api.ts";
import { resolveGameImage } from "../../data/games.ts";
import { createRetryButton } from "../ui/retry-button/retry-button.ts";
import { showSnackbar } from "../snackbar/snackbar.ts";
import { createGameDetailsInfo } from "./game-details-info";
import closeIcon from "../../assets/icons/close-details.svg";
import { createGameDetailsRecords } from "./game-details-records.ts";

import { createGameDetailsComments } from "./game-details-comments.ts";

interface GameDetailsDialog {
  readonly element: HTMLDialogElement;
  readonly open: (slug: string) => void;
  readonly close: () => void;
}

export const createGameDetails = (): GameDetailsDialog => {
  const dialog = document.createElement("dialog");
  const panel = document.createElement("div");
  const closeButton = document.createElement("button");
  const closeImage = document.createElement("img");
  const media = document.createElement("div");
  const hero = document.createElement("img");
  const content = document.createElement("div");

  dialog.className = "game-details";
  panel.className = "game-details__panel";
  closeButton.className = "game-details__close";
  hero.className = "game-details__hero";
  content.className = "game-details__body";

  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close game details");
  closeImage.src = closeIcon;
  closeImage.alt = "";
  closeButton.append(closeImage);
  panel.append(media, closeButton, content);
  dialog.append(panel);

  let destroyComments: (() => void) | undefined;
  let requestId = 0;
  let isClosing = false;
  let wasBackdropPressed = false;

  const showState = (
    titleText: string,
    messageText: string,
    isError: boolean,
  ): void => {
    destroyComments?.();
    destroyComments = undefined;
    const title = document.createElement("h2");
    const message = document.createElement("p");
    title.id = "game-details-title";
    title.className = "game-details__title";
    title.textContent = titleText;
    message.textContent = messageText;
    message.setAttribute("role", isError ? "alert" : "status");
    content.classList.toggle("game-details__body--error", isError);
    media.replaceChildren();
    content.replaceChildren(title, message);
  };

  const showLoading = (): void => {
    showState("Game Details", "Loading game details…", false);
    content.setAttribute("aria-busy", "true");
    const heroPlaceholder = document.createElement("div");
    heroPlaceholder.className =
      "game-details__skeleton game-details__skeleton--hero";
    heroPlaceholder.setAttribute("aria-hidden", "true");
    media.append(heroPlaceholder);
    for (let index = 0; index < 3; index += 1) {
      const placeholder = document.createElement("div");
      placeholder.className = "game-details__skeleton";
      placeholder.setAttribute("aria-hidden", "true");
      content.append(placeholder);
    }
  };

  const loadGame = async (slug: string): Promise<void> => {
    const currentRequestId = ++requestId;
    showLoading();

    try {
      const game = await getGameDetails(slug);
      if (isClosing || currentRequestId !== requestId || !dialog.open) return;

      if (!game) {
        showState("Game Not Found", "This game could not be found.", false);
        return;
      }

      hero.src = resolveGameImage(game.heroImage);
      hero.alt = game.name;
      media.replaceChildren(hero);
      const comments = createGameDetailsComments(game.slug);
      destroyComments = comments.destroy;
      content.replaceChildren(
        createGameDetailsInfo(game),
        createGameDetailsRecords(game.topRecords),
        comments.element,
      );
    } catch {
      if (isClosing || currentRequestId !== requestId || !dialog.open) return;
      showState("Game Details", "Failed to load game details.", true);
      content.append(
        createRetryButton(() => {
          void loadGame(slug);
        }),
      );
      showSnackbar("Failed to load game details. Please try again.", "error");
    } finally {
      if (currentRequestId === requestId) {
        content.setAttribute("aria-busy", "false");
      }
    }
  };

  const open = (slug: string): void => {
    if (dialog.open) return;

    dialog.classList.remove("game-details--closing");
    isClosing = false;
    wasBackdropPressed = false;
    dialog.setAttribute("aria-labelledby", "game-details-title");
    dialog.showModal();
    document.body.classList.add("game-details-open");
    dialog.scrollTop = 0;
    void loadGame(slug);
  };

  const close = (): void => {
    if (isClosing || !dialog.open) return;

    destroyComments?.();
    destroyComments = undefined;
    isClosing = true;
    requestId += 1;
    content.setAttribute("aria-busy", "false");
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
