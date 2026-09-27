import gameData from "../../data/game-tukoni-forest-keepers.json";

export const createGameDetailsRecords = (): HTMLElement => {
  const section = document.createElement("section");
  const title = document.createElement("h3");
  const list = document.createElement("ol");
  const trophy = document.createElement("span");
  const titleText = document.createElement("span");

  const medals = ["🥇", "🥈", "🥉"];
  const dates = ["2 days ago", "5 days ago", "1 week ago"];
  section.className = "game-details__records";
  trophy.className = "game-details__records-icon";
  trophy.textContent = "🏆";
  titleText.textContent = "Top Records";
  title.append(trophy, titleText);
  for (const record of gameData.data.topRecords) {
    const row = document.createElement("li");
    const medal = document.createElement("span");
    const player = document.createElement("span");
    const score = document.createElement("span");
    const date = document.createElement("span");
    medal.textContent = medals[record.position - 1];
    player.textContent = record.playerName;
    score.textContent = `${record.score.toLocaleString("en-US")} pts`;
    date.textContent = dates[record.position - 1];
    row.append(medal, player, score, date);
    list.append(row);
  }
  section.append(title, list);
  return section;
};
