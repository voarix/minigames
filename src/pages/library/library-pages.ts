export const createLibraryPage = (): HTMLElement => {
  const main = document.createElement("main");
  const title = document.createElement("h1");

  title.textContent = "Game Library";
  main.append(title);

  return main;
};
