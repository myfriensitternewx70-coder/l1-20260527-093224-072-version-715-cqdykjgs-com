document.addEventListener('DOMContentLoaded', function () {
  bindMobileMenu();
  bindHeroCarousel();
  bindFilters();
  bindImageErrors();
  bindPlayers();
});

function bindMobileMenu() {
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener('click', function () {
    menu.classList.toggle('is-open');
  });
}

function bindHeroCarousel() {
  var hero = document.querySelector('[data-hero]');

  if (!hero) {
    return;
  }

  var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
  var prev = hero.querySelector('[data-hero-prev]');
  var next = hero.querySelector('[data-hero-next]');
  var index = 0;
  var timer = null;

  function show(target) {
    index = (target + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === index);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === index);
    });
  }

  function start() {
    stop();
    timer = window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      show(Number(dot.getAttribute('data-hero-dot')) || 0);
      start();
    });
  });

  if (prev) {
    prev.addEventListener('click', function () {
      show(index - 1);
      start();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      show(index + 1);
      start();
    });
  }

  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);
  start();
}

function bindFilters() {
  var grid = document.querySelector('[data-filter-grid]');

  if (!grid) {
    return;
  }

  var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
  var input = document.querySelector('[data-filter-input]');
  var selects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-select]'));
  var count = document.querySelector('[data-filter-count]');
  var empty = document.querySelector('[data-no-results]');
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';

  if (input && initialQuery) {
    input.value = initialQuery;
  }

  function valueOf(name) {
    var select = document.querySelector('[data-filter-select="' + name + '"]');
    return select ? select.value.trim().toLowerCase() : '';
  }

  function apply() {
    var keyword = input ? input.value.trim().toLowerCase() : '';
    var type = valueOf('type');
    var year = valueOf('year');
    var region = valueOf('region');
    var category = valueOf('category');
    var visible = 0;

    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      var cardType = (card.getAttribute('data-type') || '').toLowerCase();
      var cardYear = (card.getAttribute('data-year') || '').toLowerCase();
      var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
      var cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
      var matched = true;

      if (keyword && text.indexOf(keyword) === -1) {
        matched = false;
      }

      if (type && cardType !== type) {
        matched = false;
      }

      if (year && cardYear !== year) {
        matched = false;
      }

      if (region && cardRegion !== region) {
        matched = false;
      }

      if (category && cardCategory !== category) {
        matched = false;
      }

      card.classList.toggle('is-hidden', !matched);

      if (matched) {
        visible += 1;
      }
    });

    if (count) {
      count.textContent = visible + ' 部影片';
    }

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  if (input) {
    input.addEventListener('input', apply);
  }

  selects.forEach(function (select) {
    select.addEventListener('change', apply);
  });

  apply();
}

function bindImageErrors() {
  var images = Array.prototype.slice.call(document.querySelectorAll('img'));

  images.forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('image-missing');
    }, { once: true });
  });
}

function bindPlayers() {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var playButton = player.querySelector('[data-play]');
    var prepared = false;
    var hls = null;

    if (!video) {
      return;
    }

    function prepare() {
      var source = video.getAttribute('data-src');

      if (prepared || !source) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        while (video.firstChild) {
          video.removeChild(video.firstChild);
        }

        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }

      prepared = true;
    }

    function play() {
      prepare();
      player.classList.add('is-playing');

      var promise = video.play();

      if (promise && promise.catch) {
        promise.catch(function () {
          player.classList.remove('is-playing');
        });
      }
    }

    if (playButton) {
      playButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        play();
      });
    }

    player.addEventListener('click', function (event) {
      if (event.target === video && !video.paused) {
        return;
      }

      if (event.target.closest('button')) {
        return;
      }

      play();
    });

    video.addEventListener('play', function () {
      player.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (!video.ended) {
        player.classList.remove('is-playing');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
}
