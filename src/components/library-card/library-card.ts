import "./library-card.scss";
import type { GameCardData } from "../../data/games.ts";
import starIcon from "../../assets/icons/star.svg";
import favoriteIcon from "../../assets/icons/favorite.svg";

export const createLibraryCard = (
  game: GameCardData,
  onDetails: () => void,
): HTMLElement => {
  const card = document.createElement("article");
  const image = document.createElement("img");
  const content = document.createElement("div");
  const heading = document.createElement("div");
  const title = document.createElement("h2");
  const category = document.createElement("span");
  const price = document.createElement("span");
  const description = document.createElement("p");
  const bottom = document.createElement("div");
  const statistics = document.createElement("div");
  const rating = document.createElement("span");
  const ratingIcon = document.createElement("img");
  const likes = document.createElement("span");
  const likesIcon = document.createElement("img");
  const detailsButton = document.createElement("button");

  card.className = "library-card";
  image.className = "library-card__image";
  content.className = "library-card__content";
  heading.className = "library-card__heading";
  title.className = "library-card__title";
  category.className = "library-card__category";
  price.className = "library-card__price";
  description.className = "library-card__description";
  bottom.className = "library-card__bottom";
  statistics.className = "library-card__statistics";
  rating.className = "library-card__statistic";
  likes.className = "library-card__statistic";
  detailsButton.className = "library-card__details";

  image.src = game.image;
  image.alt = game.name;
  title.textContent = game.name;
  category.textContent = game.category;
  price.textContent = game.price;
  price.classList.toggle("library-card__price--free", game.price === "Free");
  description.textContent = game.shortDescription;

  ratingIcon.src = starIcon;
  ratingIcon.alt = "";
  likesIcon.src = favoriteIcon;
  likesIcon.alt = "";
  const likesText =
    game.likesCount < 1000
      ? String(game.likesCount)
      : `${Math.floor(game.likesCount / 100) / 10}K`;
  rating.append(ratingIcon, game.rating.toFixed(1));
  likes.append(likesIcon, likesText);
  detailsButton.type = "button";
  detailsButton.textContent = "Details";
  detailsButton.addEventListener("click", onDetails);

  heading.append(title, category, price);
  statistics.append(rating, likes);
  bottom.append(statistics, detailsButton);
  content.append(heading, description, bottom);
  card.append(image, content);

  return card;
};
