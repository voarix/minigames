import "./burger-menu.scss";
import logoIcon from "../../assets/icons/logo.svg";
import menuIcon from "../../assets/icons/menu.svg";
import closeIcon from "../../assets/icons/close.svg";

interface BurgerMenu {
  button: HTMLButtonElement;
  panel: HTMLElement;
}

export const createBurgerMenu = (
  navigationItems: readonly string[],
): BurgerMenu => {
  const button = document.createElement("button");
  const buttonImage = document.createElement("img");

  const panel = document.createElement("div");
  const panelHeader = document.createElement("div");
  const panelLogo = document.createElement("a");
  const panelLogoImage = document.createElement("img");
  const panelLogoText = document.createElement("span");
  const navigation = document.createElement("nav");
  const navigationList = document.createElement("ul");

  const actions = document.createElement("div");
  const loginButton = document.createElement("button");
  const signupButton = document.createElement("button");

  button.className = "burger-menu__button";
  button.type = "button";
  button.setAttribute("aria-label", "Open navigation menu");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "mobile-navigation");

  buttonImage.className = "burger-menu__icon";
  buttonImage.src = menuIcon;
  buttonImage.alt = "";
  button.append(buttonImage);

  panel.className = "burger-menu__panel";
  panel.id = "mobile-navigation";
  panel.setAttribute("aria-hidden", "true");

  panelHeader.className = "burger-menu__header";

  panelLogo.className = "burger-menu__logo";
  panelLogo.href = "./";

  panelLogoImage.className = "burger-menu__logo-icon";
  panelLogoImage.src = logoIcon;
  panelLogoImage.alt = "";

  panelLogoText.className = "burger-menu__logo-text";
  panelLogoText.textContent = "MiniGames";

  panelLogo.append(panelLogoImage, panelLogoText);
  panelHeader.append(panelLogo);

  navigation.className = "burger-menu__navigation";
  navigation.setAttribute("aria-label", "Mobile navigation");

  navigationList.className = "burger-menu__navigation-list";

  for (const item of navigationItems) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");

    listItem.className = "burger-menu__navigation-item";
    link.className = "burger-menu__navigation-link";
    link.href = "./";
    link.textContent = item;

    if (item === "Home") {
      link.classList.add("burger-menu__navigation-link--active");
    }

    listItem.append(link);
    navigationList.append(listItem);
  }

  actions.className = "burger-menu__actions";

  loginButton.className = "burger-menu__auth-button burger-menu__login-button";
  loginButton.type = "button";
  loginButton.textContent = "Log In";

  signupButton.className =
    "burger-menu__auth-button burger-menu__signup-button";
  signupButton.type = "button";
  signupButton.textContent = "Sign Up";

  navigation.append(navigationList);
  actions.append(loginButton, signupButton);
  panel.append(panelHeader, navigation, actions);

  let isOpen = false;

  const setMenuState = (isMenuOpen: boolean): void => {
    isOpen = isMenuOpen;

    button.setAttribute("aria-expanded", String(isMenuOpen));
    button.setAttribute(
      "aria-label",
      isMenuOpen ? "Close navigation menu" : "Open navigation menu",
    );

    panel.setAttribute("aria-hidden", String(!isMenuOpen));
    panel.classList.toggle("burger-menu__panel--open", isMenuOpen);
    document.body.classList.toggle("menu-open", isMenuOpen);

    buttonImage.src = isMenuOpen ? closeIcon : menuIcon;
  };

  button.addEventListener("click", () => {
    setMenuState(!isOpen);
  });

  panel.addEventListener("click", (event: MouseEvent) => {
    if (event.target instanceof HTMLAnchorElement) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (isOpen && event.key === "Escape") {
      setMenuState(false);
    }
  });

  const tabletMediaQuery = matchMedia("(max-width: 768px)");

  tabletMediaQuery.addEventListener("change", (event: MediaQueryListEvent) => {
    if (isOpen && !event.matches) {
      setMenuState(false);
    }
  });

  return { button, panel };
};
