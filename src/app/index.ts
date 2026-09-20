import { createHomePage } from "../pages/home/home-page.ts";
import { createAuthDialog } from "../components/auth-dialog/auth-dialog.ts";
import { createFooter } from "../components/footer/footer.ts";
import { createHeader } from "../components/header/header.ts";

export const startApp = (): void => {
  const authDialog = createAuthDialog();
  const header = createHeader({
    onLogin: () => {
      authDialog.open("login");
    },
    onRegister: () => {
      authDialog.open("register");
    },
  });
  const main = createHomePage();
  const footer = createFooter();

  document.body.replaceChildren(header, main, footer, authDialog.element);
};
