import type { ApiGameDetails } from "../../api/game-details-api.ts";

export const createGameDetailsRecords = (
  records: ApiGameDetails["topRecords"],
): HTMLElement => {
  const section = document.createElement("section");
  const title = document.createElement("h3");
  const list = document.createElement("ol");
  const trophy = document.createElement("span");
  const titleText = document.createElement("span");

  const medals = ["🥇", "🥈", "🥉"];
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  section.className = "game-details__records";
  trophy.className = "game-details__records-icon";
  trophy.textContent = "🏆";
  titleText.textContent = "Top Records";
  title.append(trophy, titleText);
  for (const record of records) {
    const row = document.createElement("li");
    const medal = document.createElement("span");
    const player = document.createElement("span");
    const score = document.createElement("span");
    const date = document.createElement("span");
    medal.textContent = medals[record.position - 1] ?? String(record.position);
    player.textContent = record.playerName;
    score.textContent = `${record.score.toLocaleString("en-US")} pts`;
    date.textContent = dateFormatter.format(new Date(record.achievedAt));
    row.append(medal, player, score, date);
    list.append(row);
  }
  if (records.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No records found";
    message.setAttribute("role", "status");
    section.append(title, message);
    return section;
  }

  section.append(title, list);
  return section;
};
