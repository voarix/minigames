import "./carousel.scss";
import { createGameCard } from "../game-card/game-card.ts";
import { featuredGames } from "../../data/games.ts";
import arrowIcon from "../../assets/icons/arrow.svg";

const minDragDistance = 5;
const minSwipeDistance = 40;

export const createCarousel = (): HTMLElement => {
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
    if (track.classList.contains("carousel__track--moving")) return;
    track.classList.add("carousel__track--moving");
    currentIndex = (currentIndex + direction + slides.length) % slides.length;
    updateSlides();
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
  };

  viewport.addEventListener("pointerdown", (event) => {
    if (pointerId !== undefined || !event.isPrimary || event.button !== 0) {
      return;
    }

    wasDragged = false;
    if (track.classList.contains("carousel__track--moving")) return;

    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
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
    moveSlides(distanceX < 0 ? 1 : -1);
  });

  viewport.addEventListener("pointercancel", stopDragging);
  viewport.addEventListener("lostpointercapture", (event) => {
    if (event.target === viewport) {
      stopDragging(event);
    }
  });  viewport.addEventListener("pointerleave", (event) => {
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

  previousButton.addEventListener("click", () => moveSlides(-1));
  nextButton.addEventListener("click", () => moveSlides(1));

  previousIcon.src = arrowIcon;
  previousIcon.alt = "";
  previousIcon.draggable = false;

  nextIcon.src = arrowIcon;
  nextIcon.alt = "";
  nextIcon.draggable = false;

  previousButton.append(previousIcon);
  nextButton.append(nextIcon);

  section.setAttribute("aria-labelledby", title.id);

  for (const game of featuredGames) {
    const slide = document.createElement("div");

    slide.className = "carousel__slide";
    slide.append(createGameCard(game));
    slides.push(slide);
    track.append(slide);
  }

  updateSlides();

  heading.append(accent, title);
  controls.append(previousButton, nextButton);
  header.append(heading, controls);
  viewport.append(track);
  container.append(header, viewport);
  section.append(container);

  return section;
};
