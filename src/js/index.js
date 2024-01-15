import "../sass/main.scss";
import pets from "./../assets/pets.json";
import selfCheck from "./selfcheck";

document.addEventListener("DOMContentLoaded", () => {
  // burger menu
  const burger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav-list");
  const overlay = document.querySelector(".overlay");
  const navLinks = document.querySelectorAll(".nav-link");

  function openMenu() {
    burger.classList.add("open");
    nav.classList.add("nav-list-open");
    document.body.style.position = "fixed";
    document.body.style.overflowY = "hidden";
    overlay.style.visibility = "visible";
    overlay.style.opacity = "1";
  }

  function closeMenu() {
    burger.classList.remove("open");
    nav.classList.remove("nav-list-open");
    document.body.style.position = "static";
    document.body.style.overflowY = "visible";
    overlay.style.visibility = "hidden";
    overlay.style.opacity = "0";
  }
  burger.addEventListener("click", () => {
    burger.classList.contains("open") ? closeMenu() : openMenu();
  });
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  overlay.addEventListener("click", closeMenu);

  // carousel
  const slider = document.querySelector(".slider");
  const cardsRow = document.querySelector(".cards-row");
  const sliderLeftBtn = document.querySelector(".arrow-left");
  const sliderRightBtn = document.querySelector(".arrow-right");
  let leftCards = document.querySelector(".cards-left");
  let centerCards = document.querySelector(".cards-center");
  let rightCards = document.querySelector(".cards-right");

  let slidesToChange;

  // generate cards
  let prevPetsCards = [],
    currPetsCards = [],
    nextPetsCards = [],
    shuffledPets = [],
    indexesForSlider;

  let petModals = [];

  function shuffleCardsForSlider() {
    indexesForSlider = [0, 1, 2, 3, 4, 5, 6, 7].sort(
      (a, b) => 0.5 - Math.random()
    );
    indexesForSlider.push(indexesForSlider[0]);
    for (let i = 0; i < indexesForSlider.length; i++) {
      shuffledPets.push(pets[indexesForSlider[i]]);
    }
    prevPetsCards = shuffledPets.slice(0, 3);
    currPetsCards = shuffledPets.slice(3, 6);
    nextPetsCards = shuffledPets.slice(6, 9);
  }
  shuffleCardsForSlider();

  function createRandomSlide(slide) {
    let randomPetsCard = pets
      .filter((pet) => !slide.includes(pet))
      .sort((a, b) => 0.5 - Math.random())
      .slice(0, 3);
    return randomPetsCard;
  }

  function renderCards(currentSlide, currentArray) {
    currentSlide.innerHTML = "";
    currentArray.forEach((pet) => {
      currentSlide.appendChild(createPetCard(pet));
    });
  }

  function createPetCard(pet) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-name", pet.name);
    card.innerHTML = `
    <img src="${pet.img}" alt="pet" class="card__image">
    <p class="card__title">${pet.name}</p>
    <div class="card__button">
      <button class="button button-transparent">Learn more</button>
    </div>
    `;
    return card;
  }

  if (slider) {
    renderCards(leftCards, prevPetsCards);
    renderCards(centerCards, currPetsCards);
    renderCards(rightCards, nextPetsCards);

    function moveSlidesLeft() {
      cardsRow.classList.add("transition-left");
      sliderLeftBtn.removeEventListener("click", moveSlidesLeft);
      sliderRightBtn.removeEventListener("click", moveSlidesRight);
    }

    function moveSlidesRight() {
      cardsRow.classList.add("transition-right");
      sliderLeftBtn.removeEventListener("click", moveSlidesLeft);
      sliderRightBtn.removeEventListener("click", moveSlidesRight);
    }

    sliderLeftBtn.addEventListener("click", moveSlidesLeft);
    sliderRightBtn.addEventListener("click", moveSlidesRight);

    cardsRow.addEventListener("animationend", (AnimationEvent) => {
      if (AnimationEvent.animationName === "to-left") {
        cardsRow.classList.remove("transition-left");
        nextPetsCards = currPetsCards;
        currPetsCards = prevPetsCards;
        let randomSlide = createRandomSlide(currPetsCards);
        prevPetsCards = randomSlide;
        rightCards.innerHTML = "";
        rightCards.innerHTML = centerCards.innerHTML;
        centerCards.innerHTML = "";
        centerCards.innerHTML = leftCards.innerHTML;
        leftCards.innerHTML = "";
        renderCards(leftCards, prevPetsCards);
      } else {
        cardsRow.classList.remove("transition-right");
        prevPetsCards = currPetsCards;
        currPetsCards = nextPetsCards;
        let randomSlide = createRandomSlide(currPetsCards);
        nextPetsCards = randomSlide;
        leftCards.innerHTML = "";
        leftCards.innerHTML = centerCards.innerHTML;
        centerCards.innerHTML = "";
        centerCards.innerHTML = rightCards.innerHTML;
        rightCards.innerHTML = "";
        renderCards(rightCards, nextPetsCards);
      }
      sliderLeftBtn.addEventListener("click", moveSlidesLeft);
      sliderRightBtn.addEventListener("click", moveSlidesRight);
    });
  }

  //pagination

  const pagination = document.querySelector(".pagination");
  const startBtn = document.querySelector(".pagination__arrow-start");
  const endBtn = document.querySelector(".pagination__arrow-end");
  const leftBtn = document.querySelector(".pagination__arrow-left");
  const rightBtn = document.querySelector(".pagination__arrow-right");
  const activePageBtn = document.querySelector(".pagination__arrow-page");
  const cardsPage = document.querySelector(".our-friends__cards-row");

  // create array with random numbers
  let shuffledIndexArray;
  let indexes = [0, 1, 2, 3, 4, 5, 6, 7];
  let petCardsPages = [];

  let cardsPerPage = 8;
  let totalPages = 6;
  let currentPage = 1;
  let petCardsByPages = [];

  const shuffle = (arr) => arr.sort((a, b) => 0.5 - Math.random());

  function shuffleCards() {
    let randomIndexArr = shuffle(indexes);
    let result = [];
    for (let i = 0; i < 6; i++) {
      result.push(
        shuffle(randomIndexArr.slice(0, 4)),
        shuffle(randomIndexArr.slice(4, 8))
      );
    }
    return result.flat();
  }

  shuffledIndexArray = shuffleCards();

  // generate pets array

  // split array according to number of items per page
  const splitByPages = (array, size) => {
    let result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  function createArrayWithCards(arr, pets) {
    petCardsPages = arr.map((i) => createPetCard(pets[i]));
    return petCardsPages;
  }

  createArrayWithCards(shuffledIndexArray, pets);

  function generatePetsPages(cardsPerPage) {
    let result = splitByPages(petCardsPages, cardsPerPage);
    petCardsByPages = result;
    return petCardsByPages;
  }
  generatePetsPages(cardsPerPage);

  // creating pages
  if (pagination) {
    leftBtn.classList.add("arrow-inactive");
    startBtn.classList.add("arrow-inactive");

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1280) {
        cardsPerPage = 8;
        totalPages = 6;
        generatePetsPages(cardsPerPage);
      } else if (window.innerWidth >= 768 && window.innerWidth < 1280) {
        cardsPerPage = 6;
        totalPages = 8;
        generatePetsPages(cardsPerPage);
      } else if (window.innerWidth < 768) {
        cardsPerPage = 3;
        totalPages = 16;
        generatePetsPages(cardsPerPage);
      }
    });

    function showCurrentPage(page, petCardsByPages) {
      cardsPage.innerHTML = "";
      petCardsByPages[page - 1].forEach((petCard) => {
        cardsPage.appendChild(petCard);
      });
    }

    function changePageToNext() {
      currentPage += 1;
      if (currentPage >= totalPages) {
        currentPage = totalPages;
        rightBtn.classList.add("arrow-inactive");
        endBtn.classList.add("arrow-inactive");
      }
      activePageBtn.innerHTML = currentPage;
      showCurrentPage(currentPage, petCardsByPages);
      leftBtn.classList.remove("arrow-inactive");
      startBtn.classList.remove("arrow-inactive");
      return currentPage;
    }
    function changePageToPrev() {
      currentPage -= 1;
      if (currentPage <= 1) {
        currentPage = 1;
        leftBtn.classList.add("arrow-inactive");
        startBtn.classList.add("arrow-inactive");
      }
      activePageBtn.innerHTML = currentPage;
      if (+activePageBtn.innerHTML > currentPage) {
        currentPage = 1;
      }
      showCurrentPage(currentPage, petCardsByPages);
      rightBtn.classList.remove("arrow-inactive");
      endBtn.classList.remove("arrow-inactive");

      return currentPage;
    }

    function changePageToFirst() {
      currentPage = 1;
      activePageBtn.innerHTML = currentPage;
      showCurrentPage(currentPage, petCardsByPages);
      leftBtn.classList.add("arrow-inactive");
      startBtn.classList.add("arrow-inactive");
      rightBtn.classList.remove("arrow-inactive");
      endBtn.classList.remove("arrow-inactive");
      return currentPage;
    }

    function changePageToLast() {
      currentPage = totalPages;
      activePageBtn.innerHTML = currentPage;
      showCurrentPage(currentPage, petCardsByPages);
      rightBtn.classList.add("arrow-inactive");
      endBtn.classList.add("arrow-inactive");
      leftBtn.classList.remove("arrow-inactive");
      startBtn.classList.remove("arrow-inactive");
      return currentPage;
    }
    rightBtn.addEventListener("click", changePageToNext);
    leftBtn.addEventListener("click", changePageToPrev);
    startBtn.addEventListener("click", changePageToFirst);
    endBtn.addEventListener("click", changePageToLast);
  }

  //create modal
  const overlayModal = document.querySelector(".overlay-modal");
  let petCards = document.querySelectorAll(".card");
  const closeModalBtns = document.querySelectorAll(".modal__button");
  const popupBtn = document.querySelectorAll(".popup-button");
  const modalsPlacement = document.querySelector(".modals");

  function generatePetModal(pet) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.setAttribute("data-name", pet.name);
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal__container");
    modal.append(modalContainer);
    modalContainer.innerHTML = `
     <div class="modal__image"><img src="./../assets/images/modal/${pet.name}.png" alt="pet"></div>
     <div class="modal__content">
        <h3 class="modal__title">${pet.name}</h3>
        <h4 class="modal__subtitle">${pet.type} - ${pet.breed}</h4>
        <h5 class="modal__desc modal__p">${pet.description}</h5>
              <ul class="modal__info-list modal__p">
              <li class="info-item"><span class="info-name"><strong>Age: </strong></span>${pet.age}</li>
              <li class="info-item"><span class="info-name">Inoculations: </span>${pet.inoculations}</li>
              <li class="info-item"><span class="info-name">Diseases: </span>${pet.diseases}</li>
              <li class="info-item"><span class="info-name">Parasites: </span>${pet.parasites}</li>
              </ul>
     </div>
  </div>
  <div class="modal__button"><button class="button popup-button"></button></div>`;
    return modal;
  }

  function createArrayWithModals(pets) {
    petModals = pets.map((pet) => generatePetModal(pet));
    return petModals;
  }
  createArrayWithModals(pets);

  petCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      let modalName;
      modalName = this.getAttribute("data-name");
      if (pagination) {
        modalName = card.querySelector(".card__title").innerHTML;
      }
      let modalElement;
      petModals.forEach((modal) => {
        if (modal.dataset.name == modalName) {
          modalElement = modal;
        }
      });
      modalsPlacement.append(modalElement);
      modalElement.classList.add("active");
      overlayModal.classList.add("active");
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    });
  });
  document.body.addEventListener("click", function (e) {
    if (e.target.classList.contains("card")) {
      e.preventDefault();
      let modalName;
      modalName = e.target.getAttribute("data-name");
      if (pagination) {
        modalName = e.target.querySelector(".card__title").innerHTML;
      }
      let modalElement;
      petModals.forEach((modal) => {
        if (modal.dataset.name == modalName) {
          modalElement = modal;
        }
      });
      modalsPlacement.append(modalElement);
      modalElement.classList.add("active");
      overlayModal.classList.add("active");
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    }
  });

  closeModalBtns.forEach(function (button) {
    button.addEventListener("click", function (e) {
      let parentModal = this.closest(".modal");
      parentModal.classList.remove("active");
      overlayModal.classList.remove("active");
      document.body.style.overflow = "visible";
      document.body.style.position = "static";
      document.body.style.width = "auto";
    });
  });
  overlayModal.addEventListener("mouseenter", function () {
    popupBtn.forEach((button) => {
      button.classList.add("button-colored");
    });
  });
  overlayModal.addEventListener("mouseleave", function () {
    popupBtn.forEach((button) => {
      button.classList.remove("button-colored");
    });
  });
  overlayModal.addEventListener("click", function () {
    document.querySelector(".modal.active").classList.remove("active");
    this.classList.remove("active");
    document.body.style.overflow = "visible";
    document.body.style.position = "static";
    document.body.style.width = "auto";
  });

  selfCheck();
});
