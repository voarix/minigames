import "./library-pagination.scss";

export const createLibraryPagination = (): HTMLElement => {
  const totalPages: number = 4;
  let currentPage: number = 1;

  const pagination = document.createElement("nav");
  const previousButton = document.createElement("button");
  const pageButtons = document.createElement("div");
  const nextButton = document.createElement("button");
  const numberedButtons: HTMLButtonElement[] = [];

  const updatePagination = (): void => {
    for (const button of numberedButtons) {
      button.classList.toggle(
        "library-pagination__button--active",
        button.textContent === String(currentPage),
      );
    }

    previousButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    pageButtons.classList.toggle(
      "library-pagination__pages--end",
      currentPage >= totalPages - 1,
    );
  };

  pagination.className = "library-pagination";

  previousButton.className =
    "library-pagination__button library-pagination__button--arrow";
  previousButton.textContent = "‹";
  previousButton.addEventListener("click", () => {
    if (currentPage === 1) {
      return;
    }

    currentPage -= 1;
    updatePagination();
  });

  pageButtons.className = "library-pagination__pages";

  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement("button");

    button.className = "library-pagination__button";
    button.textContent = String(page);
    button.addEventListener("click", () => {
      currentPage = page;
      updatePagination();
    });

    pageButtons.append(button);
    numberedButtons.push(button);
  }

  nextButton.className =
    "library-pagination__button library-pagination__button--arrow";
  nextButton.textContent = "›";
  nextButton.addEventListener("click", () => {
    if (currentPage === totalPages) {
      return;
    }

    currentPage += 1;
    updatePagination();
  });

  pagination.append(previousButton, pageButtons, nextButton);
  updatePagination();

  return pagination;
};
