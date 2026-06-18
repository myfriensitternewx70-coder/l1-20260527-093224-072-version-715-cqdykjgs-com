(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMobileMenu() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function initSearchForms() {
    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input) {
          return;
        }
        var query = input.value.trim();
        if (!query) {
          event.preventDefault();
          window.location.href = "./search.html";
        }
      });
    });
  }

  function getCardText(card) {
    return [
      card.getAttribute("data-title") || "",
      card.getAttribute("data-genre") || "",
      card.getAttribute("data-year") || "",
      card.getAttribute("data-region") || "",
      card.getAttribute("data-type") || "",
      card.getAttribute("data-category") || "",
      card.textContent || ""
    ].join(" ").toLowerCase();
  }

  function initFilters() {
    var bar = document.querySelector("[data-filter-bar]");
    var grid = document.querySelector("[data-card-grid]");
    if (!bar || !grid) {
      return;
    }
    var input = bar.querySelector("[data-local-search]");
    var yearFilter = bar.querySelector("[data-year-filter]");
    var typeFilter = bar.querySelector("[data-type-filter]");
    var cards = Array.prototype.slice.call(grid.children);
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    if (input && query) {
      input.value = query;
    }
    function apply() {
      var term = input ? input.value.trim().toLowerCase() : "";
      var year = yearFilter ? yearFilter.value : "";
      var type = typeFilter ? typeFilter.value : "";
      cards.forEach(function (card) {
        var text = getCardText(card);
        var cardYear = card.getAttribute("data-year") || "";
        var cardType = card.getAttribute("data-type") || "";
        var matchedTerm = !term || text.indexOf(term) !== -1;
        var matchedYear = !year || cardYear === year;
        var matchedType = !type || cardType === type;
        card.classList.toggle("is-hidden", !(matchedTerm && matchedYear && matchedType));
      });
    }
    [input, yearFilter, typeFilter].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
    apply();
  }

  function initHeroSlider() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }
    function start() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });
    slider.addEventListener("mouseenter", function () {
      clearInterval(timer);
    });
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  onReady(function () {
    initMobileMenu();
    initSearchForms();
    initFilters();
    initHeroSlider();
  });
})();
