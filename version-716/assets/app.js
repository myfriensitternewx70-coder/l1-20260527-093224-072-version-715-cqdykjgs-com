(function () {
  var body = document.body;
  var menuButton = document.querySelector('.menu-toggle');

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      body.classList.toggle('mobile-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dots button'));
    var index = 0;

    function showSlide(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(parseInt(dot.getAttribute('data-target'), 10) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }
  }

  var filterInput = document.querySelector('.page-filter');
  var yearSelect = document.querySelector('.year-filter');
  var cardList = document.querySelector('[data-card-list]');

  function filterCards() {
    if (!cardList) {
      return;
    }
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var year = yearSelect ? yearSelect.value : '';
    var cards = Array.prototype.slice.call(cardList.querySelectorAll('.movie-card'));

    cards.forEach(function (card) {
      var text = [
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year')
      ].join(' ').toLowerCase();
      var matchKeyword = !keyword || text.indexOf(keyword) >= 0;
      var matchYear = !year || card.getAttribute('data-year') === year;
      card.classList.toggle('is-hidden', !(matchKeyword && matchYear));
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', filterCards);
  }
  if (yearSelect) {
    yearSelect.addEventListener('change', filterCards);
  }

  var player = document.querySelector('.player-card[data-video]');
  if (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('.video-cover-button');
    var source = player.getAttribute('data-video');
    var started = false;

    function startPlayer() {
      if (!video || !source) {
        return;
      }

      if (!started) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
        started = true;
      }

      player.classList.add('playing');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', startPlayer);
    }
    video.addEventListener('click', function () {
      if (!started) {
        startPlayer();
      }
    });
    video.addEventListener('play', function () {
      player.classList.add('playing');
    });
  }
})();
