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
const minDragDistance = 5;

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

  let pointerId: number | undefined;
  let startX = 0;
  let startScrollLeft = 0;
  let wasDragged = false;

  categories.addEventListener("pointerdown", (event) => {
    wasDragged = false;

    const isPrimaryMouseClick =
      event.pointerType === "mouse" && event.button === 0;
    const isScrollable = categories.scrollWidth > categories.clientWidth;
    if (!isPrimaryMouseClick || !isScrollable) return;

    pointerId = event.pointerId;
    startX = event.clientX;
    startScrollLeft = categories.scrollLeft;
  });

  categories.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;

    const distance = event.clientX - startX;

    if (!wasDragged && Math.abs(distance) < minDragDistance) {
      return;
    }

    wasDragged = true;
    categories.setPointerCapture(event.pointerId);
    categories.classList.add("library-filters__categories--dragging");
    categories.scrollLeft = startScrollLeft - distance;
  });

  const stopDragging = (): void => {
    if (pointerId !== undefined && categories.hasPointerCapture(pointerId)) {
      categories.releasePointerCapture(pointerId);
    }

    pointerId = undefined;
    categories.classList.remove("library-filters__categories--dragging");
  };

  categories.addEventListener("pointerup", stopDragging);
  categories.addEventListener("pointercancel", stopDragging);
  categories.addEventListener("lostpointercapture", stopDragging);
  categories.addEventListener("pointerleave", () => {
    if (!wasDragged) stopDragging();
  });

  categories.addEventListener(
    "click",
    (event) => {
      if (!wasDragged || event.detail === 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    },
    { capture: true },
  );

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
