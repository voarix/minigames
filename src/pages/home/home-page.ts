export const createHomePage = (): HTMLElement => {
  const main = document.createElement('main');
  const title = document.createElement('h1');

  title.textContent = 'MiniGames';

  main.append(title);

  return main;
}