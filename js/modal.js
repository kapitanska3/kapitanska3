(function () {
  'use strict';

  const modal    = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('modal-close');
  const triggers = document.querySelectorAll('.js-open-modal');

  if (!modal) return;

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
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
