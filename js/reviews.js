/**
 * reviews.js
 * Renderuje karty opinii z inline JSON z paginacją.
 */

(function () {
  'use strict';

  const PER_PAGE = 6;

  const AVATAR_COLORS = [
    'bg-rose-500', 'bg-pink-500', 'bg-violet-500', 'bg-fuchsia-500',
    'bg-sky-500', 'bg-emerald-600', 'bg-teal-500', 'bg-amber-500',
    'bg-blue-600', 'bg-orange-500', 'bg-yellow-500', 'bg-red-500',
    'bg-indigo-500', 'bg-green-600', 'bg-cyan-600', 'bg-lime-600',
  ];

  const LABEL_STYLES = {
    'Wyjątkowy':    'text-blue-700 bg-blue-50',
    'Znakomity':    'text-indigo-700 bg-indigo-50',
    'Bardzo dobry': 'text-gray-700 bg-gray-100',
    'Dobry':        'text-gray-700 bg-gray-100',
    'Przyjemny':    'text-gray-700 bg-gray-100',
  };

  function labelStyle(label) {
    return LABEL_STYLES[label] || 'text-gray-700 bg-gray-100';
  }

  function avatarColor(index) {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
  }

  function formatScore(score) {
    if (Number.isInteger(score)) return String(score);
    return String(score).replace('.', ',');
  }

  function buildCard(review, index) {
    const initial  = review.name.charAt(0).toUpperCase();
    const color    = avatarColor(index);
    const style    = labelStyle(review.label);
    const scoreStr = formatScore(review.score);

    return `
      <div class="review-card bg-gray-50 border border-gray-100 rounded-lg p-4">
        <div class="review-card__meta flex items-center justify-between mb-2">
          <span class="review-card__label text-xs font-semibold ${style} px-2 py-0.5 rounded">${review.label}</span>
          <span class="review-card__score text-sm font-bold text-gray-800">${scoreStr}</span>
        </div>
        <p class="review-card__text text-sm text-gray-700 italic mb-3">„${review.text}"</p>
        <div class="review-card__author flex items-center gap-2">
          <div class="review-card__avatar w-7 h-7 ${color} rounded-full flex items-center justify-center text-white font-bold text-xs">${initial}</div>
          <div>
            <p class="text-xs font-semibold text-gray-700">${review.name}</p>
            <p class="text-xs text-gray-400">${review.country} ${review.flag} · ${review.date}</p>
          </div>
        </div>
      </div>
    `.trim();
  }

  function buildPagination(current, total, onPageChange) {
    const nav = document.createElement('nav');
    nav.className = 'reviews-pagination';
    nav.setAttribute('aria-label', 'Strony opinii');

    // Przycisk Poprzednia
    const prev = document.createElement('button');
    prev.className = 'reviews-pagination__btn' + (current === 1 ? ' reviews-pagination__btn--disabled' : '');
    prev.disabled = current === 1;
    prev.setAttribute('aria-label', 'Poprzednia strona');
    prev.innerHTML = '&#8592;';
    prev.addEventListener('click', function () { onPageChange(current - 1); });
    nav.appendChild(prev);

    // Numery stron
    for (var i = 1; i <= total; i++) {
      const btn = document.createElement('button');
      btn.className = 'reviews-pagination__btn' + (i === current ? ' reviews-pagination__btn--active' : '');
      btn.textContent = i;
      btn.setAttribute('aria-label', 'Strona ' + i);
      if (i === current) btn.setAttribute('aria-current', 'page');
      (function (page) {
        btn.addEventListener('click', function () { onPageChange(page); });
      }(i));
      nav.appendChild(btn);
    }

    // Przycisk Następna
    const next = document.createElement('button');
    next.className = 'reviews-pagination__btn' + (current === total ? ' reviews-pagination__btn--disabled' : '');
    next.disabled = current === total;
    next.setAttribute('aria-label', 'Następna strona');
    next.innerHTML = '&#8594;';
    next.addEventListener('click', function () { onPageChange(current + 1); });
    nav.appendChild(next);

    return nav;
  }

  function render(reviews) {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    const totalPages = Math.ceil(reviews.length / PER_PAGE);
    let currentPage = 1;

    // Kontener na paginację (wstawiamy po gridzie)
    let paginationContainer = document.getElementById('reviews-pagination');
    if (!paginationContainer) {
      paginationContainer = document.createElement('div');
      paginationContainer.id = 'reviews-pagination';
      grid.parentNode.insertBefore(paginationContainer, grid.nextSibling);
    }

    function renderPage(page) {
      currentPage = page;
      const start = (page - 1) * PER_PAGE;
      const slice = reviews.slice(start, start + PER_PAGE);

      grid.innerHTML = slice.map(function (r, i) {
        return buildCard(r, start + i);
      }).join('\n');

      // Paginacja widoczna tylko gdy więcej niż 1 strona
      paginationContainer.innerHTML = '';
      if (totalPages > 1) {
        paginationContainer.appendChild(
          buildPagination(currentPage, totalPages, function (p) {
            renderPage(p);
            // Scroll do nagłówka sekcji opinii
            var section = document.querySelector('.reviews');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          })
        );
      }
    }

    renderPage(1);
  }

  const MONTHS = {
    'styczeń': 1, 'lutego': 2, 'luty': 2, 'marzec': 3, 'kwiecień': 4,
    'maj': 5, 'czerwiec': 6, 'lipiec': 7, 'sierpień': 8,
    'wrzesień': 9, 'październik': 10, 'listopad': 11, 'grudzień': 12,
  };

  function parseDate(dateStr) {
    const parts = dateStr.trim().toLowerCase().split(/\s+/);
    const month = MONTHS[parts[0]] || 0;
    const year  = parseInt(parts[1], 10) || 0;
    return year * 100 + month;
  }

  function sortByDateDesc(reviews) {
    return reviews.slice().sort(function (a, b) {
      return parseDate(b.date) - parseDate(a.date);
    });
  }

  // Inline JSON z <script id="reviews-data">
  var inlineEl = document.getElementById('reviews-data');
  if (inlineEl) {
    try {
      render(sortByDateDesc(JSON.parse(inlineEl.textContent)));
    } catch (e) {
      console.error('Błąd parsowania reviews-data:', e);
    }
    return;
  }

  // Fallback: fetch (wymaga serwera HTTP)
  fetch('data/reviews.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) { render(sortByDateDesc(data)); })
    .catch(function (err) {
      console.error('Nie można wczytać opinii:', err);
    });
})();
