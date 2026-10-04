import { createAuthDialog } from "../components/auth-dialog/auth-dialog.ts";
import { createGameDetails } from "../components/game-details/game-details.ts";
import { createFooter } from "../components/footer/footer.ts";
import { createHeader } from "../components/header/header.ts";
import { createHomePage } from "../pages/home/home-page.ts";
import { createLibraryPage } from "../pages/library/library-pages.ts";
import { getPageFromPath, type Page } from "./router.ts";

export const startApp = (): void => {
  const gameDetails = createGameDetails();
  let main: HTMLElement = document.createElement("main");
  let destroyPage: (() => void) | undefined;

  const showPage = (page: Page): void => {
    destroyPage?.();
    destroyPage = undefined;
    let otherMain: HTMLElement;

    if (page === "library") {
      const libraryPage = createLibraryPage(gameDetails.open);
      otherMain = libraryPage.element;
      destroyPage = libraryPage.destroy;
    } else if (page === "home") {
      const nextHomePage = createHomePage(gameDetails.open, () =>
        navigate("library"),
      );
      otherMain = nextHomePage.element;
      destroyPage = nextHomePage.destroy;
    } else {
      otherMain = document.createElement("main");
      const title = document.createElement("h1");
      title.textContent = "404 — Page Not Found";
      otherMain.append(title);
    }

    main.replaceWith(otherMain);
    main = otherMain;
    updateActiveNavigation(page);
  };

  const navigate = (page: "home" | "library"): void => {
    if (getPageFromPath(location.pathname) === page) return;

    const path = page === "home" ? "/" : "/library";
    history.pushState(undefined, "", path);
    showPage(page);
  };

  const authDialog = createAuthDialog();
  const header = createHeader({
    onLogin: () => {
      authDialog.open("login");
    },
    onRegister: () => {
      authDialog.open("register");
    },
    onNavigate: navigate,
  });

  const updateActiveNavigation = (page: Page): void => {
    const navigationLabels = {
      home: "Home",
      library: "Library",
      "not-found": "",
    };
    const activeText = navigationLabels[page];

    for (const link of header.querySelectorAll(".header__navigation-link")) {
      link.classList.toggle(
        "header__navigation-link--active",
        link.textContent?.trim() === activeText,
      );
    }

    for (const link of header.querySelectorAll(
      ".burger-menu__navigation-link",
    )) {
      link.classList.toggle(
        "burger-menu__navigation-link--active",
        link.textContent?.trim() === activeText,
      );
    }
  };

  const footer = createFooter({ onNavigate: navigate });

  document.body.replaceChildren(
    header,
    main,
    footer,
    authDialog.element,
    gameDetails.element,
  );
  addEventListener("popstate", () => {
    showPage(getPageFromPath(location.pathname));
  });
  showPage(getPageFromPath(location.pathname));
};
