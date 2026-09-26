import "./library-filters.scss";

const categoryNames = [
  "All Games",
  "Puzzle",
  "Card",
  "Match",
  "Farm",
  "Strategy",
  "Arcade",
];

const sortOptions = ["Rating ↑", "Rating ↓", "Name A→Z", "Name Z→A"];

export const createLibraryFilters = (): HTMLElement => {
  const filters = document.createElement("div");
  const categories = document.createElement("div");
  const sorting = document.createElement("div");
  const sortButton = document.createElement("button");
  const sortList = document.createElement("div");
  let selectedSort = "Rating ↓";

  filters.className = "library-filters";
  categories.className = "library-filters__categories";
  sorting.className = "library-filters__sorting";

  for (const category of categoryNames) {
    const button = document.createElement("button");

    button.className = "library-filters__category";
    button.textContent = category;

    if (category === "All Games") {
      button.classList.add("library-filters__category--active");
    }

    button.addEventListener("click", () => {
      for (const categoryButton of categories.querySelectorAll("button")) {
        categoryButton.classList.toggle(
          "library-filters__category--active",
          categoryButton === button,
        );
      }
    });

    categories.append(button);
  }

  sortButton.className = "library-filters__sort-button";
  sortButton.textContent = `Sort by: ${selectedSort}`;
  sortList.className = "library-filters__sort-list";
  sortList.hidden = true;

  sortButton.addEventListener("click", () => {
    sortList.hidden = !sortList.hidden;
    sortButton.classList.toggle(
      "library-filters__sort-button--open",
      !sortList.hidden,
    );
  });

  for (const option of sortOptions) {
    const button = document.createElement("button");
    button.className = "library-filters__sort-option";
    button.textContent = option;
    button.classList.toggle(
      "library-filters__sort-option--active",
      option === selectedSort,
    );

    button.addEventListener("click", () => {
      selectedSort = option;
      sortButton.textContent = `Sort by: ${selectedSort}`;

      for (const optionButton of sortList.querySelectorAll("button")) {
        optionButton.classList.toggle(
          "library-filters__sort-option--active",
          optionButton === button,
        );
      }

      sortList.hidden = true;
      sortButton.classList.remove("library-filters__sort-button--open");
      sortButton.focus();
    });

    sortList.append(button);
  }

  sorting.append(sortButton, sortList);
  filters.append(categories, sorting);

  return filters;
};
