import "./snackbar.scss";

export type SnackbarVariant = "success" | "error";

const dismissDelay = 5000;
const createSnackbar = () => {
  let activeSnackbar: HTMLElement | undefined;
  let dismissTimer: number | undefined;

  const dismissSnackbar = (): void => {
    clearTimeout(dismissTimer);
    dismissTimer = undefined;
    activeSnackbar?.remove();
    activeSnackbar = undefined;
  };

  const show = (message: string, variant: SnackbarVariant): void => {
    dismissSnackbar();

    const snackbar = document.createElement("div");
    const text = document.createElement("p");
    const closeButton = document.createElement("button");

    snackbar.className = `snackbar snackbar--${variant}`;
    text.className = "snackbar__message";
    text.setAttribute("role", variant === "error" ? "alert" : "status");
    text.setAttribute("aria-atomic", "true");
    text.textContent = message;

    closeButton.className = "snackbar__close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close notification");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", dismissSnackbar);

    snackbar.append(text, closeButton);
    document.body.append(snackbar);
    activeSnackbar = snackbar;
    dismissTimer = setTimeout(dismissSnackbar, dismissDelay);
  };

  return show;
};

export const showSnackbar = createSnackbar();
