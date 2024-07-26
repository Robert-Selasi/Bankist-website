"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const navLinksContainer = document.querySelector(".nav__links");
const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const imgs = document.querySelectorAll("img[data-src]");

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btnOpenModal) =>
  btnOpenModal.addEventListener("click", openModal)
);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

////////////////////////
///////Implimenting scrolling to section-1 using the learn more button

btnScrollTo.addEventListener("click", function () {
  section1.scrollIntoView({ behavior: "smooth" });
});

// implement smooth nav links scroll
navLinksContainer.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    !e.target.classList.contains("nav__link") ||
    e.target.getAttribute("href") === "#"
  )
    return;
  const sectionID = e.target.getAttribute("href");
  document.querySelector(sectionID).scrollIntoView({ behavior: "smooth" });
});

// implementing nav link fade on hover
const fade = function (e) {
  const linkEl = e.target;
  const nav = linkEl.closest("nav");
  const navLinks = nav.querySelectorAll(".nav__link");
  const logo = nav.querySelector("img");
  if (!linkEl.classList.contains("nav__link")) return;
  navLinks.forEach((el) => {
    el.style.opacity = this;
  });
  logo.style.opacity = this;
  linkEl.style.opacity = "1";
};
navLinksContainer.addEventListener("mouseover", fade.bind(0.5));
navLinksContainer.addEventListener("mouseout", fade.bind(1));

// sticky navigation
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) nav.classList.remove("sticky");
  else nav.classList.add("sticky");
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// implementing tabbed component
const btnsTabContainer = document.querySelector(".operations__tab-container");
const btnsTab = document.querySelectorAll(".operations__tab");
const operationsContent = document.querySelectorAll(".operations__content");
btnsTabContainer.addEventListener("click", function (e) {
  e.preventDefault();
  const btnTarget = e.target;
  const tab = btnTarget.dataset.tab;
  const operationContent = document.querySelector(
    `.operations__content--${tab}`
  );
  btnsTab.forEach((btn) => {
    btn.classList.remove("operations__tab--active");
  });
  btnTarget.classList.add("operations__tab--active");

  operationsContent.forEach((operation) => {
    operation.classList.remove("operations__content--active");
  });
  operationContent.classList.add("operations__content--active");
});

// image reveal animation

const revealImg = function (entries, observer) {
  const [entry] = entries;
  const imgTarget = entry.target;
  imgTarget.src = imgTarget.dataset.src;
  imgTarget.addEventListener("load", function () {
    if (entry.isIntersecting) {
      imgTarget.classList.remove("lazy-img");
      observer.unobserve(imgTarget);
    }
  });
};
const imgObserver = new IntersectionObserver(revealImg, {
  root: null,
  threshold: 0.5,
  rootMargin: "200px",
});

imgs.forEach((img) => {
  imgObserver.observe(img);
});

// implementing slider
// const slider = document.querySelector(".slider");
// slider.style.transform = "scale(0.4) translateX(-800px)";
// slider.style.overflow = "visible";
const silder = function () {
  const btnNext = document.querySelector(".slider__btn--right");
  const btnPrev = document.querySelector(".slider__btn--left");
  const slides = document.querySelectorAll(".slide");
  let currSlide = 0;
  const maxSlide = slides.length;
  const dotsContainer = document.querySelector(".dots");

  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `
      <button class="dots__dot" data-slide="${i}"></button>
    `
      );
    });
  };
  createDots();
  const dots = document.querySelectorAll(".dots__dot");

  const slideTo = function (slideNum) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - slideNum) * 100}%)`;
    });
  };

  // creating and implementing dots

  const activateDot = function (slideNum) {
    dots.forEach((dot) => {
      dots.forEach((dot) => dot.classList.remove("dots__dot--active"));
    });
    slideTo(slideNum);
    document
      .querySelector(`.dots__dot[data-slide="${slideNum}"]`)
      .classList.add("dots__dot--active");
  };
  const init = function () {
    activateDot(0);
    slideTo(0);
  };
  init();

  dotsContainer.addEventListener("click", function (e) {
    const btnTarget = e.target;
    if (!btnTarget.classList.contains("dots__dot")) return;
    const slideNum = btnTarget.dataset.slide;
    activateDot(slideNum);
  });

  const nextSlide = function () {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    slideTo(currSlide);
    activateDot(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }
    slideTo(currSlide);
    activateDot(currSlide);
  };

  btnNext.addEventListener("click", nextSlide);
  btnPrev.addEventListener("click", prevSlide);

  // implementing keyboard events for slider
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });
};
silder();

// section scroll animation
const sections = document.querySelectorAll(".section");

const sectionScroll = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(sectionScroll, {
  root: null,
  threshold: 0.1,
});

sections.forEach((sec) => {
  sec.classList.add("section--hidden");
  sectionObserver.observe(sec);
});
