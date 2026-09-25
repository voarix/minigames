import { createAuthDialog } from "../components/auth-dialog/auth-dialog.ts";
import { createFooter } from "../components/footer/footer.ts";
import { createHeader } from "../components/header/header.ts";
import { createHomePage } from "../pages/home/home-page.ts";
import { createLibraryPage } from "../pages/library/library-pages.ts";

export const startApp = (): void => {
  let main: HTMLElement = createHomePage();

  const showPage = (page: "home" | "library"): void => {
    const otherMain =
      page === "library" ? createLibraryPage() : createHomePage();

    main.replaceWith(otherMain);
    main = otherMain;
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

  const footer = createFooter();

  document.body.replaceChildren(header, main, footer, authDialog.element);
};
