const STORAGE_KEY = "shigaTripDoneItems";

let doneItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveDoneItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doneItems));
}

function getItems() {
  return [...document.querySelectorAll(".item")];
}

function getHeaderOffset() {
  const header = document.querySelector(".header");
  const dayTitle = document.querySelector(".day-title");

  const headerHeight = header ? header.offsetHeight : 0;
  const dayTitleHeight = dayTitle ? dayTitle.offsetHeight : 0;

  return headerHeight + dayTitleHeight + 10;
}

function applyState() {
  const items = getItems();

  items.forEach(item => {
    const id = item.dataset.id;
    const checkbox = item.querySelector(".checkbox");
    const isDone = doneItems.includes(id);

    checkbox.checked = isDone;
    item.classList.toggle("done", isDone);
    item.classList.remove("next");
  });

  const nextItem = items.find(item => !item.classList.contains("done"));
  if (nextItem) {
    nextItem.classList.add("next");
  }
}

function scrollToElement(element) {
  const offset = getHeaderOffset();
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top,
    behavior: "smooth"
  });
}

function scrollToFirstUnchecked(dayId) {
  const section = document.getElementById(dayId);
  if (!section) return;

  const firstUnchecked = section.querySelector(".item:not(.done)");

  if (firstUnchecked) {
    scrollToElement(firstUnchecked);
  } else {
    scrollToElement(section);
  }
}

getItems().forEach(item => {
  const checkbox = item.querySelector(".checkbox");

  checkbox.addEventListener("change", () => {
    const id = item.dataset.id;

    if (checkbox.checked) {
      if (!doneItems.includes(id)) {
        doneItems.push(id);
      }
    } else {
      doneItems = doneItems.filter(doneId => doneId !== id);
    }

    saveDoneItems();
    applyState();
  });
});

document.querySelectorAll("[data-scroll]").forEach(button => {
  button.addEventListener("click", () => {
    scrollToFirstUnchecked(button.dataset.scroll);
  });
});

applyState();
