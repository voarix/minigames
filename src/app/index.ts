import { createAuthDialog } from "../components/auth-dialog/auth-dialog.ts";
import { createGameDetails } from "../components/game-details/game-details.ts";
import { createFooter } from "../components/footer/footer.ts";
import { createHeader } from "../components/header/header.ts";
import { createHomePage } from "../pages/home/home-page.ts";
import { createLibraryPage } from "../pages/library/library-pages.ts";
import {
  getPageFromPath,
  getGameSlugFromSearch,
  getLibraryStateFromSearch,
  getLibrarySearchFromState,
  type LibraryState,
  type Page,
} from "./router.ts";

const getPageKey = (): string => {
  const page = getPageFromPath(location.pathname);
  return page === "library"
    ? page +
        getLibrarySearchFromState(getLibraryStateFromSearch(location.search))
    : page;
};

export const startApp = (): void => {
  const gameDetails = createGameDetails(() => navigateGame());
  let main: HTMLElement = document.createElement("main");
  let destroyPage: (() => void) | undefined;
  let renderedPageKey: string | undefined;

  const showPage = (page: Page): void => {
    destroyPage?.();
    destroyPage = undefined;
    let otherMain: HTMLElement;

    if (page === "library") {
      const libraryPage = createLibraryPage(
        navigateGame,
        getLibraryStateFromSearch(location.search),
        updateLibraryUrl,
      );
      otherMain = libraryPage.element;
      destroyPage = libraryPage.destroy;
    } else if (page === "home") {
      const nextHomePage = createHomePage(navigateGame, () =>
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

  const syncGameDetailsFromUrl = (): void => {
    const slug = getGameSlugFromSearch(location.search);
    if (slug && getPageFromPath(location.pathname) !== "not-found") {
      gameDetails.open(slug);
    } else {
      gameDetails.close();
    }
  };

  const renderFromUrl = (): void => {
    const pageKey = getPageKey();
    if (renderedPageKey !== pageKey) {
      showPage(getPageFromPath(location.pathname));
      renderedPageKey = pageKey;
    }
    syncGameDetailsFromUrl();
  };

  const navigateGame = (slug?: string): void => {
    const url = new URL(location.href);
    if (slug) {
      url.searchParams.set("game", slug);
    } else {
      url.searchParams.delete("game");
    }
    if (url.search !== location.search) {
      history.pushState(undefined, "", url.pathname + url.search + url.hash);
    }
    syncGameDetailsFromUrl();
  };

  const updateLibraryUrl = (
    state: LibraryState,
    shouldReplace: boolean = false,
  ): void => {
    const search = getLibrarySearchFromState(state, location.search);
    if (search === location.search) return;

    const url = `${location.pathname}${search}${location.hash}`;
    if (shouldReplace) {
      history.replaceState(undefined, "", url);
    } else {
      history.pushState(undefined, "", url);
    }
    renderedPageKey = getPageKey();
  };

  const navigate = (page: "home" | "library"): void => {
    if (getPageFromPath(location.pathname) === page) return;

    const path = page === "home" ? "/" : "/library";
    history.pushState(undefined, "", path);
    renderFromUrl();
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
  addEventListener("popstate", renderFromUrl);
  renderFromUrl();
};
