import "./header.scss";
import logoIcon from "../../assets/logo.svg";

const navigationItems: string[] = [
  "Home",
  "Library",
  "Tournaments",
  "Community",
];

export const createHeader = (): HTMLElement => {
  const header = document.createElement("header");
  const container = document.createElement("div");

  const logo = document.createElement("a");
  const logoImage = document.createElement("img");
  const logoText = document.createElement("span");

  const navigation = document.createElement("nav");
  const navigationList = document.createElement("ul");

  const actions = document.createElement("div");
  const loginButton = document.createElement("button");
  const signupButton = document.createElement("button");
  const menuButton = document.createElement("button");

  header.className = "header";
  container.className = "header__container";

  logo.className = "header__logo";
  logoImage.className = "header__logo-icon";
  logoText.className = "header__logo-text";

  navigation.className = "header__navigation";
  navigationList.className = "header__navigation-list";

  actions.className = "header__actions";
  loginButton.className = "header__login-button header__auth-button";
  signupButton.className = "header__signup-button header__auth-button";
  menuButton.className = "header__menu-button";

  logo.href = "./";
  logoImage.src = logoIcon;
  logoImage.alt = "";
  logoText.textContent = "MiniGames";
  logo.append(logoImage, logoText);

  for (const item of navigationItems) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");

    if (item === "Home") {
      link.classList.add("header__navigation-link--active");
    }

    listItem.className = "header__navigation-item";
    link.className = "header__navigation-link";
    link.href = "./";
    link.textContent = item;

    listItem.append(link);
    navigationList.append(listItem);
  }

  loginButton.type = "button";
  loginButton.textContent = "Log In";

  signupButton.type = "button";
  signupButton.textContent = "Sign Up";

  menuButton.type = "button";
  menuButton.setAttribute("aria-label", "Open navigation menu");
  menuButton.textContent = "Menu";

  navigation.append(navigationList);
  actions.append(loginButton, signupButton);
  container.append(logo, navigation, actions, menuButton);
  header.append(container);

  return header;
};
