(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  ready(function () {
    initNavigation();
    initHeroSlider();
    initFilters();
  });

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".nav-menu");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initHeroSlider() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    var prev = slider.querySelector("[data-hero-prev]");
    var next = slider.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        play();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        play();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        play();
      });
    });

    show(0);
    play();
  }

  function initFilters() {
    var search = document.querySelector("[data-filter-search]");
    var category = document.querySelector("[data-filter-category]");
    var year = document.querySelector("[data-filter-year]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .ranking-item"));
    var noResult = document.querySelector("[data-no-result]");
    if (!cards.length || (!search && !category && !year)) {
      return;
    }

    function value(el) {
      return el ? el.value.trim().toLowerCase() : "";
    }

    function apply() {
      var q = value(search);
      var c = value(category);
      var y = value(year);
      var shown = 0;
      cards.forEach(function (card) {
        var title = (card.getAttribute("data-title") || "").toLowerCase();
        var genre = (card.getAttribute("data-genre") || "").toLowerCase();
        var region = (card.getAttribute("data-region") || "").toLowerCase();
        var cat = (card.getAttribute("data-category") || "").toLowerCase();
        var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
        var matchText = !q || title.indexOf(q) >= 0 || genre.indexOf(q) >= 0 || region.indexOf(q) >= 0 || cat.indexOf(q) >= 0;
        var matchCategory = !c || cat === c;
        var matchYear = !y || cardYear === y;
        var ok = matchText && matchCategory && matchYear;
        card.style.display = ok ? "" : "none";
        if (ok) {
          shown += 1;
        }
      });
      if (noResult) {
        noResult.classList.toggle("show", shown === 0);
      }
    }

    [search, category, year].forEach(function (el) {
      if (el) {
        el.addEventListener("input", apply);
        el.addEventListener("change", apply);
      }
    });
    apply();
  }
})();
