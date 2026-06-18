(function () {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  const backTop = document.querySelector('[data-back-top]');

  function updateChrome() {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }
    if (backTop) {
      backTop.classList.toggle('is-visible', window.scrollY > 500);
    }
  }

  window.addEventListener('scroll', updateChrome, { passive: true });
  updateChrome();

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
  }

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let activeSlide = 0;
  let heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  }

  function startHero() {
    if (slides.length <= 1) {
      return;
    }
    heroTimer = window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      window.clearInterval(heroTimer);
      showSlide(Number(dot.dataset.heroDot || 0));
      startHero();
    });
  });
  startHero();

  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
  const searchInput = document.querySelector('[data-search-input]');
  const yearSelect = document.querySelector('[data-filter-year]');
  const typeSelect = document.querySelector('[data-filter-type]');
  const categorySelect = document.querySelector('[data-filter-category]');
  const resultCount = document.querySelector('[data-result-count]');

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function matchYear(cardYear, filterYear) {
    if (!filterYear) {
      return true;
    }
    const year = Number(cardYear || 0);
    if (filterYear === '2019') {
      return year <= 2019;
    }
    return String(cardYear) === filterYear;
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }
    const keyword = normalize(searchInput ? searchInput.value : '');
    const year = yearSelect ? yearSelect.value : '';
    const type = normalize(typeSelect ? typeSelect.value : '');
    const category = normalize(categorySelect ? categorySelect.value : '');
    let visible = 0;

    cards.forEach(function (card) {
      const haystack = normalize([
        card.dataset.title,
        card.dataset.tags,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.category
      ].join(' '));
      const matchesKeyword = !keyword || haystack.includes(keyword);
      const matchesYear = matchYear(card.dataset.year, year);
      const matchesType = !type || normalize(card.dataset.type).includes(type);
      const matchesCategory = !category || normalize(card.dataset.category) === category;
      const show = matchesKeyword && matchesYear && matchesType && matchesCategory;
      card.classList.toggle('is-filtered-out', !show);
      if (show) {
        visible += 1;
      }
    });

    if (resultCount) {
      resultCount.textContent = '当前显示 ' + visible + ' / ' + cards.length + ' 部';
    }
  }

  [searchInput, yearSelect, typeSelect, categorySelect].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });
  applyFilters();
})();
