import "./carousel.scss";
import { createGameCard } from "../game-card/game-card.ts";
import { resolveGameImage, type GameCardData } from "../../data/games.ts";
import { getFeaturedGames } from "../../api/games-api.ts";
import arrowIcon from "../../assets/icons/arrow.svg";
import { createCarouselAutoplay } from "./carousel-autoplay.ts";
import { showSnackbar } from "../snackbar/snackbar.ts";

const minDragDistance = 5;
const minSwipeDistance = 40;

interface Carousel {
  readonly element: HTMLElement;
  readonly destroy: () => void;
}

export const createCarousel = (onDetails: () => void): Carousel => {
  const section = document.createElement("section");
  const container = document.createElement("div");
  const header = document.createElement("div");
  const heading = document.createElement("div");
  const accent = document.createElement("span");
  const title = document.createElement("h2");

  const controls = document.createElement("div");
  const previousButton = document.createElement("button");
  const nextButton = document.createElement("button");
  const previousIcon = document.createElement("img");
  const nextIcon = document.createElement("img");

  const viewport = document.createElement("div");
  const track = document.createElement("div");
  const slides: HTMLDivElement[] = [];
  let currentIndex = 0;
  let isDestroyed = false;

  const renderSlides = (games: readonly GameCardData[]): void => {
    slides.length = 0;
    currentIndex = 0;
    track.replaceChildren();
    track.classList.remove("carousel__track--moving");

    for (const game of games) {
      const slide = document.createElement("div");

      slide.className = "carousel__slide";
      slide.append(createGameCard(game, onDetails));
      slides.push(slide);
      track.append(slide);
    }

    updateSlides();
  };

  const updateSlides = (): void => {
    const halfLength = Math.floor(slides.length / 2);

    for (const [index, slide] of slides.entries()) {
      let position = index - currentIndex;

      if (position > halfLength) {
        position -= slides.length;
      } else if (position < -halfLength) {
        position += slides.length;
      }

      slide.dataset.position = String(position);
      slide.classList.toggle("carousel__slide--hidden", Math.abs(position) > 3);
    }
  };

  const moveSlides = (direction: -1 | 1): void => {
    if (
      slides.length < 2 ||
      track.classList.contains("carousel__track--moving")
    ) {
      return;
    }
    track.classList.add("carousel__track--moving");
    currentIndex = (currentIndex + direction + slides.length) % slides.length;
    updateSlides();
  };

  const autoplay = createCarouselAutoplay(() => {
    moveSlides(1);
  });

  const moveManually = (direction: -1 | 1): void => {
    if (
      slides.length < 2 ||
      track.classList.contains("carousel__track--moving")
    ) {
      return;
    }

    moveSlides(direction);
    autoplay.reset();
  };

  const finishMove = (event: TransitionEvent): void => {
    if (
      event.target !== slides[currentIndex] ||
      event.propertyName !== "left"
    ) {
      return;
    }

    track.classList.remove("carousel__track--moving");
  };

  track.addEventListener("transitionend", finishMove);
  track.addEventListener("transitioncancel", finishMove);

  let pointerId: number | undefined;
  let startX = 0;
  let startY = 0;
  let wasDragged = false;

  const stopDragging = (event: PointerEvent): void => {
    if (event.pointerId !== pointerId) return;

    pointerId = undefined;
    viewport.classList.remove("carousel__viewport--dragging");

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }

    if (slides.length > 1) autoplay.start();
  };

  viewport.addEventListener("pointerdown", (event) => {
    if (
      pointerId !== undefined ||
      !event.isPrimary ||
      event.button !== 0 ||
      slides.length < 2
    ) {
      return;
    }

    wasDragged = false;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    autoplay.pause();
  });

  viewport.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;

    const distanceX = event.clientX - startX;
    const distanceY = event.clientY - startY;

    if (
      Math.abs(distanceX) < minDragDistance ||
      Math.abs(distanceX) <= Math.abs(distanceY)
    ) {
      return;
    }

    wasDragged = true;
    viewport.classList.add("carousel__viewport--dragging");
    if (!viewport.hasPointerCapture(event.pointerId)) {
      viewport.setPointerCapture(event.pointerId);
    }
  });

  viewport.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointerId) return;

    const distanceX = event.clientX - startX;
    const distanceY = event.clientY - startY;
    stopDragging(event);

    if (
      Math.abs(distanceX) < minSwipeDistance ||
      Math.abs(distanceX) <= Math.abs(distanceY)
    ) {
      return;
    }

    wasDragged = true;
    moveManually(distanceX < 0 ? 1 : -1);
  });

  viewport.addEventListener("pointercancel", stopDragging);
  viewport.addEventListener("lostpointercapture", (event) => {
    if (event.target === viewport) {
      stopDragging(event);
    }
  });
  viewport.addEventListener("pointerleave", (event) => {
    if (!viewport.hasPointerCapture(event.pointerId)) stopDragging(event);
  });

  viewport.addEventListener(
    "click",
    (event) => {
      if (!wasDragged || event.detail === 0) return;

      event.preventDefault();
      event.stopPropagation();
    },
    { capture: true },
  );

  section.className = "carousel";
  container.className = "carousel__container";
  header.className = "carousel__header";
  heading.className = "carousel__heading";
  accent.className = "carousel__heading-accent";
  title.className = "carousel__title";

  controls.className = "carousel__controls";
  previousButton.className = "carousel__control carousel__control--previous";
  nextButton.className = "carousel__control carousel__control--next";

  previousIcon.className =
    "carousel__control-icon carousel__control-icon--previous";
  nextIcon.className = "carousel__control-icon";

  viewport.className = "carousel__viewport";
  track.className = "carousel__track";

  title.id = "new-games-title";
  title.textContent = "New Games";

  accent.setAttribute("aria-hidden", "true");

  previousButton.type = "button";
  previousButton.setAttribute("aria-label", "Previous games");

  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Next games");

  previousButton.addEventListener("click", () => {
    moveManually(-1);
  });
  nextButton.addEventListener("click", () => {
    moveManually(1);
  });

  previousIcon.src = arrowIcon;
  previousIcon.alt = "";
  previousIcon.draggable = false;

  nextIcon.src = arrowIcon;
  nextIcon.alt = "";
  nextIcon.draggable = false;

  previousButton.append(previousIcon);
  nextButton.append(nextIcon);

  section.setAttribute("aria-labelledby", title.id);

  heading.append(accent, title);
  controls.append(previousButton, nextButton);
  header.append(heading, controls);
  viewport.append(track);
  container.append(header, viewport);
  section.append(container);

  const createSkeleton = (): HTMLElement => {
    const skeleton = document.createElement("div");
    skeleton.className = "carousel__track carousel__skeleton";
    skeleton.setAttribute("role", "status");
    skeleton.setAttribute("aria-label", "Loading featured games");

    for (let position = -2; position <= 2; position += 1) {
      const slide = document.createElement("div");
      const placeholder = document.createElement("div");
      slide.className = "carousel__slide";
      slide.dataset.position = String(position);
      slide.setAttribute("aria-hidden", "true");
      placeholder.className = "carousel__skeleton-card";
      slide.append(placeholder);
      skeleton.append(slide);
    }

    return skeleton;
  };

  const loadGames = async (): Promise<void> => {
    autoplay.pause();
    previousButton.disabled = true;
    nextButton.disabled = true;
    viewport.setAttribute("aria-busy", "true");
    const message = document.createElement("p");
    viewport.replaceChildren(createSkeleton());

    try {
      const games = await getFeaturedGames();
      if (isDestroyed) return;

      const cards: GameCardData[] = games.map((game) => ({
        ...game,
        image: resolveGameImage(game.cardImage),
        featured: true,
      }));

      if (cards.length === 0) {
        message.textContent = "No featured games found.";
        viewport.replaceChildren(message);
        return;
      }

      renderSlides(cards);
      viewport.replaceChildren(track);
      previousButton.disabled = cards.length < 2;
      nextButton.disabled = cards.length < 2;
      if (cards.length > 1) autoplay.start();
    } catch {
      if (isDestroyed) return;

      message.textContent = "Failed to load featured games.";
      message.setAttribute("role", "alert");
      const retryButton = document.createElement("button");
      retryButton.className = "carousel__retry";
      retryButton.type = "button";
      retryButton.textContent = "Retry";
      retryButton.addEventListener("click", () => {
        void loadGames();
      });
      viewport.replaceChildren(message, retryButton);
      showSnackbar("Failed to load featured games. Please try again.", "error");
    } finally {
      if (!isDestroyed) viewport.setAttribute("aria-busy", "false");
    }
  };

  void loadGames();

  const destroy = (): void => {
    isDestroyed = true;
    autoplay.destroy();
  };

  return { element: section, destroy };
};
