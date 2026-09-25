import "./auth-dialog.scss";
import googleIcon from "../../assets/icons/google.svg";

export type AuthMode = "login" | "register";

const AUTH_DIALOG_TRANSITION_DURATION = 200;

export interface AuthDialog {
  readonly element: HTMLElement;
  readonly open: (mode: AuthMode) => void;
  readonly close: () => void;
}

interface FieldOptions {
  readonly autocomplete: HTMLInputElement["autocomplete"];
  readonly label: string;
  readonly name: string;
  readonly placeholder: string;
  readonly type: "email" | "password" | "text";
}

const createField = ({
  autocomplete,
  label,
  name,
  placeholder,
  type,
}: FieldOptions): HTMLElement => {
  const field = document.createElement("div");
  const fieldHeader = document.createElement("div");
  const fieldLabel = document.createElement("label");
  const input = document.createElement("input");

  field.className = "auth-dialog__field";
  fieldHeader.className = "auth-dialog__field-header";
  fieldLabel.className = "auth-dialog__label";
  input.className = "auth-dialog__input";

  input.id = `auth-${name}`;
  input.name = name;
  input.type = type;
  input.placeholder = placeholder;
  input.autocomplete = autocomplete;
  input.required = true;

  fieldLabel.htmlFor = input.id;
  fieldLabel.textContent = label;

  fieldHeader.append(fieldLabel);

  if (name === "login-password") {
    const forgotPasswordButton = document.createElement("button");

    forgotPasswordButton.className = "auth-dialog__text-button";
    forgotPasswordButton.type = "button";
    forgotPasswordButton.textContent = "Forgot Password?";
    fieldHeader.append(forgotPasswordButton);
  }

  field.append(fieldHeader, input);

  return field;
};

export const createAuthDialog = (): AuthDialog => {
  const dialog = document.createElement("div");
  const panel = document.createElement("section");
  const tabs = document.createElement("div");
  const loginTab = document.createElement("button");
  const registerTab = document.createElement("button");
  const view = document.createElement("div");

  dialog.className = "auth-dialog";
  panel.className = "auth-dialog__panel";
  tabs.className = "auth-dialog__tabs";
  loginTab.className = "auth-dialog__tab";
  registerTab.className = "auth-dialog__tab";
  view.className = "auth-dialog__view";

  dialog.hidden = true;
  dialog.setAttribute("aria-hidden", "true");

  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "auth-dialog-title");
  panel.tabIndex = -1;

  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "Authentication options");

  loginTab.type = "button";
  loginTab.id = "auth-login-tab";
  loginTab.textContent = "Login";
  loginTab.setAttribute("role", "tab");
  loginTab.setAttribute("aria-controls", "auth-dialog-view");

  registerTab.type = "button";
  registerTab.id = "auth-register-tab";
  registerTab.textContent = "Register";
  registerTab.setAttribute("role", "tab");
  registerTab.setAttribute("aria-controls", "auth-dialog-view");

  view.id = "auth-dialog-view";
  view.setAttribute("role", "tabpanel");

  tabs.append(loginTab, registerTab);
  panel.append(tabs, view);
  dialog.append(panel);

  let activeMode: AuthMode = "login";
  let elementToRestoreFocus: HTMLElement | undefined;
  let closeTimer: number | undefined;

  const renderView = (mode: AuthMode): void => {
    activeMode = mode;
    const isLogin = mode === "login";
    const header = document.createElement("header");
    const title = document.createElement("h2");
    const description = document.createElement("p");
    const form = document.createElement("form");
    const fields = document.createElement("div");
    const actions = document.createElement("div");
    const submitButton = document.createElement("button");
    const divider = document.createElement("div");
    const dividerText = document.createElement("span");
    const googleButton = document.createElement("button");
    const googleIconImage = document.createElement("img");
    const footer = document.createElement("p");
    const switchButton = document.createElement("button");

    panel.classList.toggle("auth-dialog__panel--register", !isLogin);
    loginTab.classList.toggle("auth-dialog__tab--active", isLogin);
    registerTab.classList.toggle("auth-dialog__tab--active", !isLogin);
    loginTab.setAttribute("aria-selected", String(isLogin));
    registerTab.setAttribute("aria-selected", String(!isLogin));
    loginTab.tabIndex = isLogin ? 0 : -1;
    registerTab.tabIndex = isLogin ? -1 : 0;
    view.setAttribute(
      "aria-labelledby",
      isLogin ? loginTab.id : registerTab.id,
    );

    header.className = "auth-dialog__header";
    title.className = "auth-dialog__title";
    description.className = "auth-dialog__description";
    form.className = "auth-dialog__form";
    fields.className = "auth-dialog__fields";
    actions.className = "auth-dialog__actions";
    submitButton.className = "auth-dialog__submit-button";
    divider.className = "auth-dialog__divider";
    dividerText.className = "auth-dialog__divider-text";
    googleButton.className = "auth-dialog__google-button";
    googleIconImage.className = "auth-dialog__google-icon";
    footer.className = "auth-dialog__footer";
    switchButton.className = "auth-dialog__text-button";

    title.id = "auth-dialog-title";
    title.textContent = isLogin ? "Welcome Back!" : "Create Account";
    description.textContent = isLogin
      ? "Sign in to resume your games and progress."
      : "Join MiniGames to track your score & streak.";

    fields.append(
      ...(isLogin
        ? [
            createField({
              autocomplete: "email",
              label: "Email Address",
              name: "login-email",
              placeholder: "you@example.com",
              type: "email",
            }),
            createField({
              autocomplete: "current-password",
              label: "Password",
              name: "login-password",
              placeholder: "Enter your password",
              type: "password",
            }),
          ]
        : [
            createField({
              autocomplete: "username",
              label: "Username",
              name: "register-username",
              placeholder: "Choose a username",
              type: "text",
            }),
            createField({
              autocomplete: "email",
              label: "Email Address",
              name: "register-email",
              placeholder: "you@example.com",
              type: "email",
            }),
            createField({
              autocomplete: "new-password",
              label: "Password",
              name: "register-password",
              placeholder: "Create a password",
              type: "password",
            }),
            createField({
              autocomplete: "new-password",
              label: "Confirm Password",
              name: "register-password-confirmation",
              placeholder: "Repeat your password",
              type: "password",
            }),
          ]),
    );

    submitButton.type = "submit";
    submitButton.textContent = isLogin ? "Login" : "Create Account";

    dividerText.textContent = "or";
    divider.append(dividerText);

    googleButton.type = "button";
    googleIconImage.src = googleIcon;
    googleIconImage.alt = "";
    googleButton.append(googleIconImage, "Continue with Google");

    footer.append(
      isLogin ? "Don't have an account? " : "Already have an account? ",
    );
    switchButton.type = "button";
    switchButton.textContent = isLogin ? "Register" : "Login";
    footer.append(switchButton);

    header.append(title, description);
    actions.append(submitButton, divider, googleButton);
    form.append(fields, actions);
    view.replaceChildren(header, form, footer);

    form.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault();
    });

    switchButton.addEventListener("click", () => {
      renderView(isLogin ? "register" : "login");
    });

    view.classList.remove("auth-dialog__view--entered");
    requestAnimationFrame(() => {
      view.classList.add("auth-dialog__view--entered");
    });
  };

  const close = (): void => {
    if (dialog.hidden) {
      return;
    }

    clearTimeout(closeTimer);
    dialog.classList.remove("auth-dialog--open");
    document.body.classList.remove("auth-dialog-open");
    dialog.setAttribute("aria-hidden", "true");

    closeTimer = setTimeout(() => {
      dialog.hidden = true;
      elementToRestoreFocus?.focus();
      elementToRestoreFocus = undefined;
    }, AUTH_DIALOG_TRANSITION_DURATION);
  };

  const open = (mode: AuthMode): void => {
    clearTimeout(closeTimer);
    elementToRestoreFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : undefined;

    renderView(mode);
    dialog.hidden = false;
    dialog.setAttribute("aria-hidden", "false");
    document.body.classList.add("auth-dialog-open");

    requestAnimationFrame(() => {
      dialog.classList.add("auth-dialog--open");

      requestAnimationFrame(() => {
        view.querySelector<HTMLInputElement>("input")?.focus();
      });
    });
  };

  loginTab.addEventListener("click", () => {
    if (activeMode !== "login") {
      renderView("login");
    }
  });

  registerTab.addEventListener("click", () => {
    if (activeMode !== "register") {
      renderView("register");
    }
  });

  dialog.addEventListener("click", (event: MouseEvent) => {
    if (event.target === dialog) {
      close();
    }
  });

  dialog.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      close();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = [
      ...panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((element) => !element.hidden);
    const firstElement = focusableElements.at(0);
    const lastElement = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  });

  renderView("login");

  return { element: dialog, open, close };
};
