import type { ApiGameDetails } from "../../api/game-details-api.ts";
import starIcon from "../../assets/icons/star.svg";
import favoriteIcon from "../../assets/icons/favorite.svg";

export const createGameDetailsInfo = (game: ApiGameDetails): HTMLElement => {
  const info = document.createElement("section");
  const heading = document.createElement("div");
  const title = document.createElement("h2");
  const statistics = document.createElement("div");
  const description = document.createElement("p");
  const specs = document.createElement("dl");
  const actions = document.createElement("div");
  const playButton = document.createElement("button");
  const favoriteButton = document.createElement("button");
  const favoriteLabel = document.createElement("span");

  info.className = "game-details__info";
  heading.className = "game-details__heading";
  title.className = "game-details__title";
  title.id = "game-details-title";
  title.textContent = game.name;
  statistics.className = "game-details__statistics";
  for (const stat of [
    { icon: starIcon, text: game.rating.toFixed(1) },
    { icon: favoriteIcon, text: `${game.likesCount / 1000}K` },
  ]) {
    const item = document.createElement("span");
    const icon = document.createElement("img");
    icon.src = stat.icon;
    icon.alt = "";
    item.append(icon, stat.text);
    statistics.append(item);
  }
  heading.append(title, statistics);
  description.className = "game-details__description";
  description.textContent = game.fullDescription;
  specs.className = "game-details__specs";
  for (const spec of [
    { label: "Genre", value: game.specs.genre },
    { label: "Players", value: game.specs.players },
    { label: "Duration", value: game.specs.duration },
    { label: "Price", value: game.specs.price },
  ]) {
    const badge = document.createElement("div");
    const label = document.createElement("dt");
    const value = document.createElement("dd");
    label.textContent = spec.label;
    value.textContent = spec.value;
    badge.append(label, value);
    specs.append(badge);
  }
  actions.className = "game-details__actions";
  playButton.className = "game-details__action game-details__play";
  playButton.type = "button";
  playButton.textContent = "Play Now";
  favoriteButton.className = "game-details__action game-details__favorite";
  favoriteButton.type = "button";
  favoriteButton.setAttribute("aria-label", "Add to Favorites");
  favoriteButton.classList.toggle(
    "game-details__favorite--active",
    game.isLikedByCurrentUser,
  );
  favoriteButton.setAttribute(
    "aria-pressed",
    String(game.isLikedByCurrentUser),
  );
  favoriteLabel.textContent = game.isLikedByCurrentUser
    ? "Remove from Favorites"
    : "Add to Favorites";
  favoriteButton.setAttribute("aria-label", favoriteLabel.textContent);
  favoriteButton.append(favoriteLabel);
  favoriteButton.addEventListener("click", () => {
    const isActive = favoriteButton.classList.toggle(
      "game-details__favorite--active",
    );
    favoriteButton.setAttribute("aria-pressed", String(isActive));
    favoriteLabel.textContent = isActive
      ? "Remove from Favorites"
      : "Add to Favorites";
    favoriteButton.setAttribute("aria-label", favoriteLabel.textContent);
  });
  actions.append(playButton, favoriteButton);
  info.append(heading, description, specs, actions);
  return info;
};
