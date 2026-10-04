import "./retry-button.scss";

export const createRetryButton = (onRetry: () => void): HTMLButtonElement => {
  const button = document.createElement("button");
  button.className = "retry-button";
  button.type = "button";
  button.textContent = "Retry";
  button.addEventListener("click", onRetry);

  return button;
};
