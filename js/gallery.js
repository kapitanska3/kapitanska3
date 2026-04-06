(function () {
  'use strict';

  if (typeof PhotoSwipeLightbox === 'undefined') {
    console.error('PhotoSwipeLightbox not found. Check script load order.');
    return;
  }

  function addThumbStrip(lightbox, getLinks) {
    lightbox.on('uiRegister', function () {
      lightbox.pswp.ui.registerElement({
        name:     'thumbs-strip',
        order:    9,
        isButton: false,
        appendTo: 'root',
        onInit:   function (el, pswp) {
          el.className = 'pswp__thumbs-strip';

          var inner = document.createElement('div');
          inner.className = 'pswp__thumbs-inner';
          el.appendChild(inner);

          var links = getLinks();
          links.forEach(function (link, index) {
            var thumb = document.createElement('button');
            thumb.className = 'pswp__thumb';
            thumb.type = 'button';
            thumb.setAttribute('aria-label', 'Zdjęcie ' + (index + 1));

            var img = document.createElement('img');
            var srcImg = link.querySelector('img');
            img.src = srcImg ? srcImg.src : link.href;
            img.loading = 'lazy';
            img.draggable = false;

            thumb.appendChild(img);
            inner.appendChild(thumb);

            thumb.addEventListener('click', function () { pswp.goTo(index); });
          });

          function updateActive() {
            var thumbs = inner.querySelectorAll('.pswp__thumb');
            thumbs.forEach(function (t, i) {
              t.classList.toggle('pswp__thumb--active', i === pswp.currIndex);
            });
            var activeThumb = thumbs[pswp.currIndex];
            if (activeThumb) {
              var target = activeThumb.offsetLeft - el.offsetWidth / 2 + activeThumb.offsetWidth / 2;
              el.scrollTo({ left: target, behavior: 'smooth' });
            }
          }

          pswp.on('change', updateActive);
          pswp.on('afterInit', updateActive);
        },
      });
    });
  }

  // ── Galeria główna ────────────────────────────────────────────────────────
  var galleryEl = document.getElementById('gallery');

  var lightbox = new PhotoSwipeLightbox({
    gallery:    '#gallery',
    children:   'a[data-pswp-width]',
    pswpModule: PhotoSwipe,

    imageClickAction: 'next',
    tapAction:        'next',
    doubleTapAction:  false,

    padding: { top: 20, bottom: 96, left: 20, right: 20 },
    showHideAnimationType: 'fade',
  });

  addThumbStrip(lightbox, function () {
    return Array.from(galleryEl.querySelectorAll('a[data-pswp-width]'));
  });

  lightbox.init();

  // ── Room lightboxes ────────────────────────────────────────────────────────
  ['room-1', 'room-2', 'room-3', 'room-4', 'room-5'].forEach(function (id) {
    var roomEl = document.getElementById(id);
    if (!roomEl) return;

    var roomLightbox = new PhotoSwipeLightbox({
      gallery:    '#' + id,
      children:   'a[data-pswp-width]',
      pswpModule: PhotoSwipe,

      imageClickAction: 'next',
      tapAction:        'next',
      doubleTapAction:  false,

      padding: { top: 20, bottom: 96, left: 20, right: 20 },
      showHideAnimationType: 'fade',
    });

    addThumbStrip(roomLightbox, function () {
      return Array.from(roomEl.querySelectorAll('a[data-pswp-width]'));
    });

    roomLightbox.init();
  });

  // Dostępność klawiatury dla linków galerii
  galleryEl.querySelectorAll('a[href]').forEach(function (link) {
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
