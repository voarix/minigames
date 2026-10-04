import {
  createAuthDialog,
  type AuthMode,
} from "../components/auth-dialog/auth-dialog.ts";
import { createGameDetails } from "../components/game-details/game-details.ts";
import { createFooter } from "../components/footer/footer.ts";
import { createHeader } from "../components/header/header.ts";
import { createHomePage } from "../pages/home/home-page.ts";
import { createLibraryPage } from "../pages/library/library-pages.ts";
import { createNotFoundPage } from "../pages/not-found/not-found-page.ts";
import {
  getPageFromPath,
  getGameSlugFromSearch,
  getAuthModeFromSearch,
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
  const authDialog = createAuthDialog({
    onClose: () => navigateAuth(),
    onModeChange: (mode) => navigateAuth(mode),
  });
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
      otherMain = createNotFoundPage(() => navigate("home"));
    }

    main.replaceWith(otherMain);
    main = otherMain;
    updateActiveNavigation(page);
  };

  const syncDialogsFromUrl = (): void => {
    const mode = getAuthModeFromSearch(location.search);
    const isValidPage = getPageFromPath(location.pathname) !== "not-found";
    if (mode && isValidPage) {
      gameDetails.close();
      authDialog.open(mode);
      return;
    }

    authDialog.close();
    const slug = getGameSlugFromSearch(location.search);
    if (slug && isValidPage) {
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
    syncDialogsFromUrl();
  };

  const navigateGame = (slug?: string): void => {
    const url = new URL(location.href);
    if (slug) {
      url.searchParams.set("game", slug);
      url.searchParams.delete("auth");
    } else {
      url.searchParams.delete("game");
    }
    if (url.search !== location.search) {
      history.pushState(undefined, "", url.pathname + url.search + url.hash);
    }
    syncDialogsFromUrl();
  };

  const navigateAuth = (mode?: AuthMode): void => {
    const url = new URL(location.href);
    if (mode) {
      url.searchParams.set("auth", mode);
    } else {
      url.searchParams.delete("auth");
    }
    if (url.search !== location.search) {
      history.pushState(undefined, "", url.pathname + url.search + url.hash);
    }
    syncDialogsFromUrl();
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

  const header = createHeader({
    onLogin: () => {
      navigateAuth("login");
    },
    onRegister: () => {
      navigateAuth("register");
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
