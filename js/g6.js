(function () {
  var caps = window.MEMORIES, box = document.getElementById('polas');
  if (!caps || !box) return;
  var nudge = document.getElementById('nudge');
  var developed = 0, finished = false;
  var tilts = [-3, 2.5, 2, -2.5, -2, 3, 2.5, -3];

  caps.forEach(function (cap, i) {
    var p = document.createElement('div');
    p.className = 'pola';
    p.setAttribute('role', 'button');
    p.setAttribute('tabindex', '0');
    p.setAttribute('aria-label', 'Develop photo ' + (i + 1));
    p.style.setProperty('--r', tilts[i % tilts.length] + 'deg');
    p.innerHTML =
      '<span class="tape"></span>' +
      '<div class="snapbox">' +
        '<div class="photo sq" data-src="images/us' + (i + 1) + '.jpg"></div>' +
        '<span class="veil">✨</span><span class="flash"></span>' +
      '</div>' +
      '<span class="cap">tap to develop</span>';
    box.appendChild(p);

    function develop() {
      if (p.classList.contains('dev')) return;
      p.classList.add('snap');
      setTimeout(function () { p.classList.add('dev'); }, 120);
      p.querySelector('.cap').textContent = cap;
      p.setAttribute('aria-label', cap);
      if (navigator.vibrate) navigator.vibrate(15);
      developed++;
      if (developed >= caps.length && !finished) {
        finished = true;
        nudge.textContent = 'Every memory is back 💙';
        setTimeout(SB.unlock, 2600);
      }
    }
    p.addEventListener('click', develop);
    p.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); develop(); }
    });
  });
  SB.initPhotos(box);
})();
