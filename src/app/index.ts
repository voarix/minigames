import { createHomePage } from "../pages/home/home-page.ts";
import { createFooter } from "../components/footer/footer.ts";
import { createHeader } from "../components/header/header.ts";

export const startApp = (): void => {
  const header = createHeader();
  const main = createHomePage();
  const footer = createFooter();

  document.body.replaceChildren(header, main, footer);
};
