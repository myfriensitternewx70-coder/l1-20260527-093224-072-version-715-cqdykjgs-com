import { MOVIES } from './movie-index.js';

const params = new URLSearchParams(window.location.search);
const query = (params.get('q') || '').trim();
const input = document.querySelector('#search-page-input');
const title = document.querySelector('#search-title');
const count = document.querySelector('#search-count');
const results = document.querySelector('#search-results');

if (input) {
  input.value = query;
}

const normalize = (value) => String(value || '').toLowerCase();

const createCard = (movie) => {
  const tags = movie.tags.slice(0, 2).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');

  return `
    <article class="movie-card">
      <a href="${movie.href}" class="movie-card-link">
        <div class="poster-wrap">
          <img src="${movie.cover}" alt="${escapeHtml(movie.title)}" loading="lazy">
          <span class="year-badge">${escapeHtml(movie.year)}</span>
        </div>
        <div class="movie-card-body">
          <div class="movie-tags">
            <span>${escapeHtml(movie.category)}</span>
            ${tags}
          </div>
          <h3>${escapeHtml(movie.title)}</h3>
          <p>${escapeHtml(movie.oneLine)}</p>
          <div class="movie-meta">
            <span>${escapeHtml(movie.region)}</span>
            <span>${escapeHtml(movie.type)}</span>
          </div>
        </div>
      </a>
    </article>`;
};

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

if (!query) {
  if (title) {
    title.textContent = '搜索结果';
  }

  if (count) {
    count.textContent = '请输入关键词开始搜索。';
  }
} else {
  const keywords = normalize(query).split(/\s+/).filter(Boolean);
  const matched = MOVIES.filter((movie) => {
    const haystack = normalize([
      movie.title,
      movie.year,
      movie.region,
      movie.type,
      movie.genre,
      movie.category,
      movie.oneLine,
      movie.tags.join(' ')
    ].join(' '));

    return keywords.every((keyword) => haystack.includes(keyword));
  });

  if (title) {
    title.textContent = `“${query}” 的搜索结果`;
  }

  if (count) {
    count.textContent = `找到 ${matched.length} 部相关作品。`;
  }

  if (results) {
    results.innerHTML = matched.slice(0, 240).map(createCard).join('');
  }
}
