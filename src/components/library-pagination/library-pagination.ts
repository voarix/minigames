import "./library-pagination.scss";

export const createLibraryPagination = (): HTMLElement => {
  const pagination = document.createElement("nav");
  const previousButton = document.createElement("button");
  const pageButtons = document.createElement("div");
  const nextButton = document.createElement("button");

  pagination.className = "library-pagination";

  previousButton.className =
    "library-pagination__button library-pagination__button--arrow";
  previousButton.textContent = "‹";
  previousButton.disabled = true;

  pageButtons.className = "library-pagination__pages";

  for (let page = 1; page <= 4; page += 1) {
    const button = document.createElement("button");

    button.className = "library-pagination__button";
    button.textContent = String(page);

    if (page === 1) {
      button.classList.add("library-pagination__button--active");
    }

    pageButtons.append(button);
  }

  nextButton.className =
    "library-pagination__button library-pagination__button--arrow";
  nextButton.textContent = "›";

  pagination.append(previousButton, pageButtons, nextButton);

  return pagination;
};
