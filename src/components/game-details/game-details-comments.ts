import {
  getGameComments,
  type ApiGameComment,
} from "../../api/game-comments-api.ts";
import { formatRelativeTime } from "../../utils/format-relative-time.ts";
import { createRetryButton } from "../ui/retry-button/retry-button.ts";
import { showSnackbar } from "../snackbar/snackbar.ts";

interface GameDetailsComments {
  readonly element: HTMLElement;
  readonly destroy: () => void;
}

const createComment = (comment: ApiGameComment): HTMLLIElement => {
  const item = document.createElement("li");
  const heading = document.createElement("div");
  const authorAvatar = document.createElement("span");
  const author = document.createElement("span");
  const date = document.createElement("time");
  const text = document.createElement("p");
  const like = document.createElement("button");

  heading.className = "game-details__comment-heading";
  authorAvatar.className = "game-details__avatar";
  authorAvatar.textContent = comment.authorName.charAt(0);
  authorAvatar.setAttribute("aria-hidden", "true");
  author.textContent = comment.authorName;
  date.dateTime = comment.createdAt;
  date.textContent = formatRelativeTime(comment.createdAt);
  text.textContent = comment.text;
  like.type = "button";
  like.disabled = true;
  like.className = "game-details__comment-like";
  like.textContent = String(comment.likesCount);
  like.setAttribute("aria-label", `${comment.likesCount} likes`);
  like.setAttribute("aria-pressed", String(comment.isLikedByCurrentUser));
  like.classList.toggle(
    "game-details__comment-like--active",
    comment.isLikedByCurrentUser,
  );

  heading.append(authorAvatar, author, date);
  item.append(heading, text, like);
  return item;
};

export const createGameDetailsComments = (
  slug: string,
): GameDetailsComments => {
  let isDestroyed = false;
  const section = document.createElement("section");
  const title = document.createElement("h3");
  const form = document.createElement("form");
  const avatar = document.createElement("span");
  const input = document.createElement("textarea");
  const submit = document.createElement("button");
  const results = document.createElement("div");

  section.className = "game-details__comments";
  title.textContent = "Comments";
  form.className = "game-details__comment-form";
  avatar.className = "game-details__avatar game-details__avatar--user";
  avatar.textContent = "U";
  input.placeholder = "Log in to write a comment";
  input.setAttribute("aria-label", "Write a comment");
  input.rows = 1;
  input.disabled = true;
  submit.type = "button";
  submit.disabled = true;
  submit.className = "game-details__submit";
  submit.setAttribute("aria-label", "Submit comment");
  form.append(avatar, input, submit);
  section.append(title, form, results);

  const showMessage = (text: string, isError: boolean): void => {
    const state = document.createElement("div");
    const message = document.createElement("p");
    state.className = isError
      ? "game-details__comments-state game-details__comments-state--error"
      : "game-details__comments-state";
    message.textContent = text;
    message.setAttribute("role", isError ? "alert" : "status");
    state.append(message);
    if (isError) {
      state.append(
        createRetryButton(() => {
          void loadComments();
        }),
      );
    }
    results.replaceChildren(state);
  };

  const loadComments = async (): Promise<void> => {
    const message = document.createElement("p");
    const skeleton = document.createElement("div");
    message.textContent = "Loading comments…";
    message.setAttribute("role", "status");
    skeleton.className = "game-details__comment-list";
    skeleton.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 3; index += 1) {
      const placeholder = document.createElement("div");
      placeholder.className =
        "game-details__skeleton game-details__comment-skeleton";
      skeleton.append(placeholder);
    }
    results.setAttribute("aria-busy", "true");
    results.replaceChildren(message, skeleton);

    try {
      const { data: comments, meta } = await getGameComments(slug);
      if (isDestroyed) return;
      title.textContent = `Comments (${meta.totalComments})`;
      if (comments.length === 0) {
        showMessage("No comments yet.", false);
        return;
      }
      const list = document.createElement("ul");
      list.className = "game-details__comment-list";
      list.append(...comments.map((comment) => createComment(comment)));
      results.replaceChildren(list);
    } catch {
      if (isDestroyed) return;
      showMessage("Failed to load comments.", true);
      showSnackbar("Failed to load comments. Please try again.", "error");
    } finally {
      if (!isDestroyed) results.setAttribute("aria-busy", "false");
    }
  };

  void loadComments();
  return {
    element: section,
    destroy: () => {
      isDestroyed = true;
    },
  };
};
