(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalizeText(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  function bindMobileMenu() {
    var button = document.querySelector(".mobile-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  function bindHeaderSearch() {
    document.querySelectorAll(".site-search-form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input");
        var q = input ? input.value.trim() : "";
        if (q) {
          window.location.href = "search.html?q=" + encodeURIComponent(q);
        }
      });
    });
  }

  function filterCards(value) {
    var query = normalizeText(value);
    document.querySelectorAll(".movie-card").forEach(function (card) {
      var haystack = normalizeText(card.getAttribute("data-title") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-year") + " " + card.getAttribute("data-region") + " " + card.getAttribute("data-type"));
      card.style.display = !query || haystack.indexOf(query) !== -1 ? "" : "none";
    });
    document.querySelectorAll(".rank-item").forEach(function (item) {
      var haystack = normalizeText(item.getAttribute("data-title") + " " + item.getAttribute("data-tags") + " " + item.getAttribute("data-year") + " " + item.getAttribute("data-region") + " " + item.getAttribute("data-type"));
      item.style.display = !query || haystack.indexOf(query) !== -1 ? "" : "none";
    });
  }

  function bindPageFilter() {
    var input = document.querySelector("#pageFilter");
    if (!input) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    if (q) {
      input.value = q;
      filterCards(q);
    }
    input.addEventListener("input", function () {
      filterCards(input.value);
    });
  }

  function bindHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
    show(0);
  }

  window.initPlayer = function (streamUrl) {
    var video = document.querySelector("#moviePlayer");
    var layer = document.querySelector(".play-layer");
    if (!video || !streamUrl) {
      return;
    }
    var loaded = false;
    var hlsInstance = null;
    function attach() {
      if (loaded) {
        return;
      }
      loaded = true;
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else {
        video.src = streamUrl;
      }
    }
    function start() {
      attach();
      if (layer) {
        layer.classList.add("hidden");
      }
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }
    if (layer) {
      layer.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener("play", function () {
      if (layer) {
        layer.classList.add("hidden");
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };

  ready(function () {
    bindMobileMenu();
    bindHeaderSearch();
    bindPageFilter();
    bindHero();
  });
})();
