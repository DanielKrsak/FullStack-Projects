"use strict";

// ELEMENT SELECTION

const btnModal = document.querySelectorAll(".btn__show--modal");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".btn__close--modal");
const section1 = document.getElementById("section-1");
const header = document.querySelector(".header");
const navBar = document.querySelector(".navigation");
const navBarHeight = document.querySelector(".navigation").clientHeight;
const navLinks = document.querySelector(".nav__links");
const sectionImages = document.querySelectorAll(".image");
const allSections = document.querySelectorAll(".section");
const operationsButtonContainer = document.querySelector(
  ".operations__button--container"
);
const operationButtons = document.querySelectorAll(".operations__button");
const operationsContents = document.querySelectorAll(".operations__content");
const allSlides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dots = document.querySelectorAll(".dots__dot");
const dotsContainer = document.querySelector(".dots");

let currentSlide = 0;

// FUNCTIONALITY

// OPEN MODAL
btnModal.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
  })
);

// LEARN MORE BUTTON
document
  .querySelector(".header__button")
  .addEventListener("click", function (e) {
    e.preventDefault();
    section1.scrollIntoView({ behavior: "smooth" });
  });

// CLOSE MODAL

closeModal.addEventListener("click", function () {
  overlay.classList.add("hidden");
  modal.classList.add("hidden");
});

// SCROLL TO SECTION

navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  const id = e.target.getAttribute("href")?.slice(1);
  if (!id) return;
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
});

// NAVBAR OPACITY EFFECTS

const changeNavBar = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".navigation").querySelectorAll(".nav__link");
    const logo = link.closest(".navigation").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

navBar.addEventListener("mouseover", changeNavBar.bind(0.5));
navBar.addEventListener("mouseout", changeNavBar.bind(1));

// OPERATIONS ARTICLES
operationsButtonContainer.addEventListener("click", function (e) {
  operationButtons.forEach((btn) => {
    btn.classList.remove("operations__button--active");
  });

  operationsContents.forEach((content) => {
    content.classList.remove("operations__content--active");
  });

  const selectedTab = e.target.closest(".operations__button");
  if (!selectedTab) return;

  selectedTab.classList.add("operations__button--active");
  const tabNumber = selectedTab.getAttribute("data-tab");

  document
    .querySelector(`.operations__content-${tabNumber}`)
    .classList.add("operations__content--active");
});

// STICKY NAV

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    navBar.classList.add("nav__sticky");
  } else navBar.classList.remove("nav__sticky");
};

const navOptions = {
  root: null,
  threshold: 0,
  rootMargin: -navBarHeight + "px",
};

const headerObserver = new IntersectionObserver(stickyNav, navOptions);

headerObserver.observe(header);

// LAZY LOADING IMAGES

const lazyLoadingFunction = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    const dataset = entry.target.getAttribute("data-src");
    entry.target.src = dataset;
    entry.target.classList.add("image__full");
  }
};

const lazyLoadingOptions = {
  root: null,
  threshold: 0,
  rootMargin: -navBarHeight + "px",
};

const lazyLoadingObserver = new IntersectionObserver(
  lazyLoadingFunction,
  lazyLoadingOptions
);

sectionImages.forEach((img) => {
  lazyLoadingObserver.observe(img);
});

// // SECTIONS ANIMATION

const sectionObserverFunc = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove("section__hidden");
  }
};

const sectionObserverOptions = {
  root: null,
  threshold: 0,
};

const sectionsObserver = new IntersectionObserver(
  sectionObserverFunc,
  sectionObserverOptions
);

allSections.forEach((sec) => {
  sectionsObserver.observe(sec);
});

// // SLIDER

allSlides.forEach(
  (slide, i) => (slide.style.transform = `translateX(${i * 100}%)`)
);

const changeDots = function (value) {
  dots.forEach((dot, i) => {
    if (value === i) dot.classList.add("dots__dot--active");
    else dot.classList.remove("dots__dot--active");
  });
};

const goToSlide = function (value) {
  allSlides.forEach(
    (slide, i) => (slide.style.transform = `translateX(${(i - value) * 100}%)`)
  );
};

const goLeft = function () {
  currentSlide--;
  if (currentSlide === -1) currentSlide = 2;
  goToSlide(currentSlide);
  changeDots(currentSlide);
};

const goRight = function () {
  currentSlide++;
  if (currentSlide === 3) currentSlide = 0;
  goToSlide(currentSlide);
  changeDots(currentSlide);
};

btnLeft.addEventListener("click", goLeft);

btnRight.addEventListener("click", goRight);

document.addEventListener("keydown", function (e) {
  // e.preventDefault();
  if (e.key === "ArrowLeft") goLeft();
  if (e.key === "ArrowRight") goRight();
});

dotsContainer.addEventListener("click", function (e) {
  const selectedDot = e.target.getAttribute("data-dot");
  console.log(selectedDot);
  goToSlide(selectedDot);
  changeDots(Number(selectedDot));
});
