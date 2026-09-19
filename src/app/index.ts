import { createHomePage } from "../pages/home/home-page.ts";

export const startApp = (): void => {
  document.body.replaceChildren(createHomePage());
};
