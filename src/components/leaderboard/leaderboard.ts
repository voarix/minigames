import { createRetryButton } from "../ui/retry-button/retry-button.ts";
import "./leaderboard.scss";
import {
  getLeaderboard,
  type LeaderboardPlayer,
} from "../../api/leaderboard-api.ts";
import { showSnackbar } from "../snackbar/snackbar.ts";

interface Leaderboard {
  readonly element: HTMLElement;
  readonly destroy: () => void;
}

type LeaderboardCellModifier =
  "rank" | "player" | "games" | "score" | "streak" | "favorite";

const getPlayerInitials = (playerName: string): string => {
  const capitalLetters = playerName.match(/[A-Z]/g);

  return (
    capitalLetters?.slice(0, 2).join("") ?? playerName.slice(0, 2).toUpperCase()
  );
};

const formatCompactScore = (score: number): string =>
  score < 1000 ? String(score) : `${Math.floor(score / 100) / 10}K`;

const createHeaderCell = (
  text: string,
  modifier: LeaderboardCellModifier,
): HTMLTableCellElement => {
  const cell = document.createElement("th");

  cell.className = `leaderboard__cell leaderboard__cell--${modifier}`;
  cell.scope = "col";
  cell.textContent = text;

  return cell;
};

const createResponsiveHeaderCell = (
  compactText: string,
  desktopText: string,
  modifier: LeaderboardCellModifier,
): HTMLTableCellElement => {
  const cell = createHeaderCell("", modifier);
  const desktopLabel = document.createElement("span");
  const compactLabel = document.createElement("span");

  desktopLabel.className = "leaderboard__header-label--desktop";
  compactLabel.className = "leaderboard__header-label--compact";

  desktopLabel.textContent = desktopText;
  compactLabel.textContent = compactText;

  cell.append(desktopLabel, compactLabel);

  return cell;
};

const createDataCell = (
  text: string,
  modifier: LeaderboardCellModifier,
): HTMLTableCellElement => {
  const cell = document.createElement("td");

  cell.className = `leaderboard__cell leaderboard__cell--${modifier}`;
  cell.textContent = text;

  return cell;
};

const createPlayerCell = (
  player: LeaderboardPlayer,
  index: number,
): HTMLTableCellElement => {
  const cell = document.createElement("td");
  const playerContent = document.createElement("div");
  const avatar = document.createElement("span");
  const playerName = document.createElement("span");

  cell.className = "leaderboard__cell leaderboard__cell--player";
  playerContent.className = "leaderboard__player";
  avatar.className = `leaderboard__avatar leaderboard__avatar--${index + 1}`;
  playerName.className = "leaderboard__player-name";

  avatar.textContent = getPlayerInitials(player.playerName);
  avatar.setAttribute("aria-hidden", "true");

  playerName.textContent = player.playerName;

  playerContent.append(avatar, playerName);
  cell.append(playerContent);

  return cell;
};

const createScoreCell = (score: number): HTMLTableCellElement => {
  const cell = document.createElement("td");
  const desktopValue = document.createElement("span");
  const mobileValue = document.createElement("span");

  cell.className = "leaderboard__cell leaderboard__cell--score";
  desktopValue.className = "leaderboard__score-value--desktop";
  mobileValue.className = "leaderboard__score-value--mobile";

  desktopValue.textContent = score.toLocaleString("en-US");
  mobileValue.textContent = formatCompactScore(score);

  cell.setAttribute("aria-label", score.toLocaleString("en-US"));

  cell.append(desktopValue, mobileValue);

  return cell;
};

const createStreakCell = (streakDays: number): HTMLTableCellElement => {
  const cell = document.createElement("td");
  const icon = document.createElement("span");
  const value = document.createElement("span");
  const desktopUnit = document.createElement("span");
  const tabletUnit = document.createElement("span");

  cell.className = "leaderboard__cell leaderboard__cell--streak";
  icon.className = "leaderboard__streak-icon";
  value.className = "leaderboard__streak-value";
  desktopUnit.className = "leaderboard__streak-unit--desktop";
  tabletUnit.className = "leaderboard__streak-unit--tablet";

  icon.textContent = "🔥";
  icon.setAttribute("aria-hidden", "true");

  desktopUnit.textContent = " days";
  tabletUnit.textContent = "d";

  value.append(String(streakDays), desktopUnit, tabletUnit);
  cell.setAttribute("aria-label", `${streakDays} days`);

  cell.append(icon, value);

  return cell;
};

const createFavoriteGameCell = (
  favoriteGameName: string,
): HTMLTableCellElement => {
  const cell = document.createElement("td");
  const favoriteGame = document.createElement("span");

  cell.className = "leaderboard__cell leaderboard__cell--favorite";
  favoriteGame.className = "leaderboard__favorite-game";
  favoriteGame.textContent = favoriteGameName;

  cell.append(favoriteGame);

  return cell;
};

const createPlayerRow = (
  player: LeaderboardPlayer,
  index: number,
): HTMLTableRowElement => {
  const row = document.createElement("tr");

  row.className = "leaderboard__row";

  row.append(
    createDataCell(`#${player.rank}`, "rank"),
    createPlayerCell(player, index),
    createDataCell(String(player.gamesPlayed), "games"),
    createScoreCell(player.totalScore),
    createStreakCell(player.streakDays),
    createFavoriteGameCell(player.favoriteGameName),
  );

  return row;
};

export const createLeaderboard = (): Leaderboard => {
  let isDestroyed = false;
  const section = document.createElement("section");
  const container = document.createElement("div");
  const heading = document.createElement("div");
  const accent = document.createElement("span");
  const title = document.createElement("h2");
  const titleSuffix = document.createElement("span");

  const tableWrapper = document.createElement("div");
  const table = document.createElement("table");
  const tableHead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const tableBody = document.createElement("tbody");

  section.className = "leaderboard";
  container.className = "leaderboard__container";
  heading.className = "leaderboard__heading";
  accent.className = "leaderboard__heading-accent";
  title.className = "leaderboard__title";
  titleSuffix.className = "leaderboard__title-suffix";

  tableWrapper.className = "leaderboard__table-wrapper";
  table.className = "leaderboard__table";
  tableHead.className = "leaderboard__table-head";
  headerRow.className = "leaderboard__row";
  tableBody.className = "leaderboard__table-body";

  title.id = "leaderboard-title";
  title.textContent = "Top Players";
  titleSuffix.textContent = " This Week";

  section.setAttribute("aria-labelledby", title.id);
  accent.setAttribute("aria-hidden", "true");

  title.append(titleSuffix);

  headerRow.append(
    createHeaderCell("Rank", "rank"),
    createHeaderCell("Player", "player"),
    createResponsiveHeaderCell("Games", "Games Played", "games"),
    createResponsiveHeaderCell("Score", "Total Score", "score"),
    createHeaderCell("Streak", "streak"),
    createHeaderCell("Favorite Game", "favorite"),
  );

  tableHead.append(headerRow);

  table.append(tableHead, tableBody);
  tableWrapper.append(table);
  heading.append(accent, title);
  container.append(heading, tableWrapper);
  section.append(container);

  const showLoading = (): void => {
    const loadingMessage = document.createElement("p");
    loadingMessage.className = "leaderboard__loading";
    loadingMessage.setAttribute("role", "status");
    loadingMessage.textContent = "Loading top players…";
    tableWrapper.setAttribute("aria-busy", "true");
    table.setAttribute("aria-hidden", "true");
    tableBody.replaceChildren();

    const modifiers: readonly LeaderboardCellModifier[] = [
      "rank",
      "player",
      "games",
      "score",
      "streak",
      "favorite",
    ];

    for (let index = 0; index < 5; index += 1) {
      const row = document.createElement("tr");
      row.className = "leaderboard__row";
      for (const modifier of modifiers) {
        const cell = createDataCell("", modifier);
        const placeholder = document.createElement("span");
        placeholder.className = "leaderboard__skeleton";
        cell.append(placeholder);
        row.append(cell);
      }
      tableBody.append(row);
    }

    tableWrapper.replaceChildren(loadingMessage, table);
  };

  const showMessage = (text: string, isError: boolean): void => {
    const state = document.createElement("div");
    const message = document.createElement("p");
    state.className = isError
      ? "leaderboard__state leaderboard__state--error"
      : "leaderboard__state";
    message.textContent = text;
    message.setAttribute("role", isError ? "alert" : "status");
    state.append(message);

    if (isError) {
      const retryButton = createRetryButton(() => {
        void loadPlayers();
      });
      state.append(retryButton);
    }

    tableWrapper.replaceChildren(state);
  };

  const loadPlayers = async (): Promise<void> => {
    showLoading();

    try {
      const players = await getLeaderboard();
      if (isDestroyed) return;

      if (players.length === 0) {
        showMessage("No top players found.", false);
        return;
      }

      const rows = players.map((player, index) =>
        createPlayerRow(player, index),
      );
      tableBody.replaceChildren(...rows);
      table.removeAttribute("aria-hidden");
      tableWrapper.replaceChildren(table);
    } catch {
      if (isDestroyed) return;
      showMessage("Failed to load top players.", true);
      showSnackbar("Failed to load top players. Please try again.", "error");
    } finally {
      if (!isDestroyed) tableWrapper.setAttribute("aria-busy", "false");
    }
  };

  void loadPlayers();

  return {
    element: section,
    destroy: () => {
      isDestroyed = true;
    },
  };
};
