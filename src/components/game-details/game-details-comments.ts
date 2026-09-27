import commentsData from "../../data/comments-tukoni-forest-keepers.json";

export const createGameDetailsComments = (): HTMLElement => {
  const section = document.createElement("section");
  const title = document.createElement("h3");
  const form = document.createElement("form");
  const avatar = document.createElement("span");
  const input = document.createElement("textarea");
  const submit = document.createElement("button");
  const list = document.createElement("ul");
  const dates = ["3 hours ago", "1 day ago", "3 days ago"];

  section.className = "game-details__comments";
  title.textContent = `Comments (${commentsData.data.length})`;
  form.className = "game-details__comment-form";
  avatar.className = "game-details__avatar game-details__avatar--user";
  avatar.textContent = "U";
  input.placeholder = "Write a comment...";
  input.setAttribute("aria-label", "Write a comment");
  input.rows = 1;
  input.addEventListener("input", () => {
    input.style.height = "auto";
    const borderHeight = input.offsetHeight - input.clientHeight;
    input.style.height = `${input.scrollHeight + borderHeight}px`;
  });
  submit.type = "button";
  submit.className = "game-details__submit";
  submit.setAttribute("aria-label", "Submit");
  form.addEventListener("submit", (event) => event.preventDefault());
  form.append(avatar, input, submit);
  list.className = "game-details__comment-list";

  for (const [index, comment] of commentsData.data.entries()) {
    const item = document.createElement("li");
    const heading = document.createElement("div");
    const authorAvatar = document.createElement("span");
    const author = document.createElement("span");
    const date = document.createElement("span");
    const text = document.createElement("p");
    const like = document.createElement("button");
    heading.className = "game-details__comment-heading";
    authorAvatar.className = "game-details__avatar";
    authorAvatar.textContent = comment.authorName.charAt(0);
    author.textContent = comment.authorName;
    date.textContent = dates[index];
    text.textContent = comment.text;
    like.type = "button";
    like.className = "game-details__comment-like";
    like.textContent = String(comment.likesCount);
    like.setAttribute("aria-label", `Like comment by ${comment.authorName}`);
    like.setAttribute("aria-pressed", "false");
    if (index === commentsData.data.length - 1) {
      like.classList.add("game-details__comment-like--active");
      like.setAttribute("aria-pressed", "true");
    }
    like.addEventListener("click", () => {
      const isActive = like.classList.toggle(
        "game-details__comment-like--active",
      );
      like.setAttribute("aria-pressed", String(isActive));
    });
    heading.append(authorAvatar, author, date);
    item.append(heading, text, like);
    list.append(item);
  }
  section.append(title, form, list);
  return section;
};
