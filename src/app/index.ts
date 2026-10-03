import { createAuthDialog } from "../components/auth-dialog/auth-dialog.ts";
import { createGameDetails } from "../components/game-details/game-details.ts";
import { createFooter } from "../components/footer/footer.ts";
import { createHeader } from "../components/header/header.ts";
import { createHomePage } from "../pages/home/home-page.ts";
import { createLibraryPage } from "../pages/library/library-pages.ts";

export const startApp = (): void => {
  const gameDetails = createGameDetails();
  const homePage = createHomePage(gameDetails.open, () => showPage("library"));
  let main: HTMLElement = homePage.element;
  let destroyPage: (() => void) | undefined = homePage.destroy;

  const showPage = (page: "home" | "library"): void => {
    destroyPage?.();
    let otherMain: HTMLElement;

    if (page === "library") {
      const libraryPage = createLibraryPage(gameDetails.open);
      otherMain = libraryPage.element;
      destroyPage = libraryPage.destroy;
    } else {
      const nextHomePage = createHomePage(gameDetails.open, () =>
        showPage("library"),
      );
      otherMain = nextHomePage.element;
      destroyPage = nextHomePage.destroy;
    }

    main.replaceWith(otherMain);
    main = otherMain;
    updateActiveNavigation(page);
  };

  const authDialog = createAuthDialog();
  const header = createHeader({
    onLogin: () => {
      authDialog.open("login");
    },
    onRegister: () => {
      authDialog.open("register");
    },
    onNavigate: showPage,
  });

  const updateActiveNavigation = (page: "home" | "library"): void => {
    const activeText = page === "home" ? "Home" : "Library";

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

  const footer = createFooter({ onNavigate: showPage });

  document.body.replaceChildren(
    header,
    main,
    footer,
    authDialog.element,
    gameDetails.element,
  );
  updateActiveNavigation("home");
};
