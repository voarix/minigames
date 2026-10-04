import "./library-pagination.scss";

export const createLibraryPagination = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void,
): HTMLElement => {
  const pageCount = Math.max(1, totalPages);
  const desktopLimit = 4;
  const mobileLimit = 3;
  const desktopStart = Math.max(
    1,
    Math.min(currentPage - 1, pageCount - desktopLimit + 1),
  );
  const mobileStart = Math.max(
    1,
    Math.min(currentPage - 1, pageCount - mobileLimit + 1),
  );
  const pagination = document.createElement("nav");
  const previousButton = document.createElement("button");
  const pageButtons = document.createElement("div");
  const nextButton = document.createElement("button");

  pagination.className = "library-pagination";
  pagination.setAttribute("aria-label", "Library pagination");

  previousButton.className =
    "library-pagination__button library-pagination__button--arrow";
  previousButton.type = "button";
  previousButton.textContent = "‹";
  previousButton.setAttribute("aria-label", "Previous page");
  previousButton.disabled = currentPage <= 1;
  previousButton.addEventListener("click", () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  });

  pageButtons.className = "library-pagination__pages";

  for (let page = 1; page <= pageCount; page += 1) {
    const button = document.createElement("button");
    button.className = "library-pagination__button";
    button.type = "button";
    button.textContent = String(page);
    button.setAttribute("aria-label", `Page ${page}`);
    button.classList.toggle(
      "library-pagination__button--active",
      page === currentPage,
    );
    if (page === currentPage) button.setAttribute("aria-current", "page");
    button.classList.toggle(
      "library-pagination__button--desktop-hidden",
      page < desktopStart || page >= desktopStart + desktopLimit,
    );
    button.classList.toggle(
      "library-pagination__button--mobile-hidden",
      page < mobileStart || page >= mobileStart + mobileLimit,
    );
    button.addEventListener("click", () => {
      if (page !== currentPage) onPageChange(page);
    });
    pageButtons.append(button);
  }

  nextButton.className =
    "library-pagination__button library-pagination__button--arrow";
  nextButton.type = "button";
  nextButton.textContent = "›";
  nextButton.setAttribute("aria-label", "Next page");
  nextButton.disabled = currentPage >= pageCount;
  nextButton.addEventListener("click", () => {
    if (currentPage < pageCount) onPageChange(currentPage + 1);
  });

  pagination.append(previousButton, pageButtons, nextButton);
  return pagination;
};
