(function () {
  'use strict';

  const modal    = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('modal-close');
  const triggers = document.querySelectorAll('.js-open-modal');

  if (!modal) return;

  function openModal() {
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollbarWidth + 'px';
    var headerInner = document.querySelector('.property-header__inner');
    if (headerInner) headerInner.style.paddingRight = scrollbarWidth + 16 + 'px';
    modal.hidden = false;
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    var headerInner = document.querySelector('.property-header__inner');
    if (headerInner) headerInner.style.paddingRight = '';
  }

  // Otwieranie przez przyciski CTA
  triggers.forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  // Zamykanie przyciskiem X
  closeBtn.addEventListener('click', closeModal);

  // Zamykanie przez kliknięcie backdropu
  modal.querySelector('.modal__backdrop').addEventListener('click', closeModal);

  // Zamykanie klawiszem Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
