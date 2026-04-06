/**
 * gallery.js
 * PhotoSwipe 5 + thumbnail strip na dole lightboxa.
 */

(function () {
  'use strict';

  if (typeof PhotoSwipeLightbox === 'undefined') {
    console.error('PhotoSwipeLightbox not found. Check script load order.');
    return;
  }

  // Zbierz wszystkie slajdy z galerii (widoczne + ukryte)
  const galleryEl = document.getElementById('gallery');
  const slideLinks = Array.from(galleryEl.querySelectorAll('a[data-pswp-width]'));

  const lightbox = new PhotoSwipeLightbox({
    gallery:    '#gallery',
    children:   'a[data-pswp-width]',
    pswpModule: PhotoSwipe,

    imageClickAction: 'next',
    tapAction:        'next',
    doubleTapAction:  false,

    // Zostawia miejsce na pasek miniaturek na dole
    padding: { top: 20, bottom: 96, left: 20, right: 20 },

    showHideAnimationType: 'fade',
  });

  // ── Thumbnail strip ────────────────────────────────────────────────────────
  // lightbox automatycznie przekazuje swoje listenery do pswp (patrz źródło lightbox).
  // uiRegister odpala się przed isRegistered=true, więc registerElement tylko
  // kolejkuje element – zostanie zbudowany przez ui.init() tuż potem.
  // onInit(el, pswp) dostaje gotowy element DOM + instancję PhotoSwipe.

  lightbox.on('uiRegister', function () {
    lightbox.pswp.ui.registerElement({
      name:     'thumbs-strip',
      order:    9,
      isButton: false,
      appendTo: 'root',
      onInit:   function (el, pswp) {

        el.className = 'pswp__thumbs-strip';

        const inner = document.createElement('div');
        inner.className = 'pswp__thumbs-inner';
        el.appendChild(inner);

        // Buduj miniaturki dla każdego slajdu
        slideLinks.forEach(function (link, index) {
          const thumb = document.createElement('button');
          thumb.className = 'pswp__thumb';
          thumb.type = 'button';
          thumb.setAttribute('aria-label', 'Zdjęcie ' + (index + 1));

          const img = document.createElement('img');
          const srcImg = link.querySelector('img');
          img.src = srcImg ? srcImg.src : link.href;
          img.loading = 'lazy';
          img.draggable = false;

          thumb.appendChild(img);
          inner.appendChild(thumb);

          thumb.addEventListener('click', function () {
            pswp.goTo(index);
          });
        });

        // Aktualizuj podświetlenie aktywnej miniaturki
        function updateActive() {
          const thumbs = inner.querySelectorAll('.pswp__thumb');
          thumbs.forEach(function (t, i) {
            t.classList.toggle('pswp__thumb--active', i === pswp.currIndex);
          });

          // Wyśrodkuj aktywną miniaturkę w pasku
          const activeThumb = thumbs[pswp.currIndex];
          if (activeThumb) {
            const target = activeThumb.offsetLeft - el.offsetWidth / 2 + activeThumb.offsetWidth / 2;
            el.scrollTo({ left: target, behavior: 'smooth' });
          }
        }

        pswp.on('change', updateActive);
        pswp.on('afterInit', updateActive);
      },
    });
  });

  lightbox.init();

  // Dostępność klawiatury dla linków galerii
  galleryEl.querySelectorAll('a[data-pswp-width]').forEach(function (link) {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
    link.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });
})();
