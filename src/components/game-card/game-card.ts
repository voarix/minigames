import "./game-card.scss";
import type { GameCardData } from "../../data/games.ts";
import starIcon from "../../assets/icons/star.svg";
import favoriteIcon from "../../assets/icons/favorite.svg";

const formatLikesCount = (likesCount: number): string =>
  likesCount < 1000
    ? String(likesCount)
    : `${Math.floor(likesCount / 100) / 10}K`;

export const createGameCard = (game: GameCardData): HTMLElement => {
  const card = document.createElement("article");
  const image = document.createElement("img");
  const information = document.createElement("div");
  const title = document.createElement("h3");
  const statistics = document.createElement("div");

  const rating = document.createElement("span");
  const ratingIcon = document.createElement("img");
  const ratingValue = document.createElement("span");

  const likes = document.createElement("span");
  const likesIcon = document.createElement("img");
  const likesValue = document.createElement("span");

  card.className = "game-card";
  image.className = "game-card__image";
  information.className = "game-card__information";
  title.className = "game-card__title";
  statistics.className = "game-card__statistics";

  rating.className = "game-card__rating";
  ratingIcon.className = "game-card__rating-icon";
  ratingValue.className = "game-card__rating-value";

  likes.className = "game-card__likes";
  likesIcon.className = "game-card__likes-icon";
  likesValue.className = "game-card__likes-value";

  image.src = game.image;
  image.alt = game.name;
  image.loading = "lazy";

  title.textContent = game.name;

  ratingIcon.src = starIcon;
  ratingIcon.alt = "";
  ratingValue.textContent = game.rating.toFixed(1);
  rating.setAttribute("aria-label", `Rating ${game.rating} out of 5`);

  likesIcon.src = favoriteIcon;
  likesIcon.alt = "";
  likesValue.textContent = formatLikesCount(game.likesCount);
  likes.setAttribute("aria-label", `${game.likesCount} likes`);

  rating.append(ratingIcon, ratingValue);
  likes.append(likesIcon, likesValue);
  statistics.append(rating, likes);
  information.append(title, statistics);
  card.append(image, information);

  return card;
};
