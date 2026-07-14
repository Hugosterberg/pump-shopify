(function () {
  function clamp(value, min) {
    var next = parseInt(value, 10);
    if (isNaN(next)) next = min;
    return Math.max(min, next);
  }

  function step(input, delta) {
    var min = parseInt(input.min, 10);
    if (isNaN(min)) min = 1;
    input.value = String(clamp(parseInt(input.value, 10) + delta, min));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  document.addEventListener('click', function (event) {
    var minus = event.target.closest('[data-pp-qty-minus]');
    var plus = event.target.closest('[data-pp-qty-plus]');
    if (!minus && !plus) return;

    var root = event.target.closest('[data-pp-qty]');
    if (!root) return;

    var input = root.querySelector('.pp-qty__input');
    if (!input) return;

    event.preventDefault();
    step(input, minus ? -1 : 1);
  });

  document.addEventListener('change', function (event) {
    var input = event.target.closest('.pp-qty__input');
    if (!input) return;

    var min = parseInt(input.min, 10);
    if (isNaN(min)) min = 1;
    input.value = String(clamp(input.value, min));
  });
})();
