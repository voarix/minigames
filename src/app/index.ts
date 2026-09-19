import { createHomePage } from "../pages/home/home-page.ts";
import { createHeader } from "../components/header/header.ts";

export const startApp = (): void => {
  const header = createHeader();
  const main = createHomePage();

  document.body.replaceChildren(header, main);
};
