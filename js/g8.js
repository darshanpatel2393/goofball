(function () {
  var btn = document.getElementById('hold');
  if (!btn) return;
  var t0 = 0, raf = 0, finished = false;

  function loop() {
    var p = Math.min(1, (performance.now() - t0) / 2000);
    btn.style.setProperty('--p', (p * 360) + 'deg');
    if (p >= 1) { finish(); return; }
    raf = requestAnimationFrame(loop);
  }
  function start(e) {
    if (finished) return;
    e.preventDefault();
    t0 = performance.now();
    cancelAnimationFrame(raf);
    loop();
  }
  function stop() {
    if (finished) return;
    cancelAnimationFrame(raf);
    btn.style.setProperty('--p', '0deg');
  }

  btn.addEventListener('pointerdown', start);
  btn.addEventListener('pointerup', stop);
  btn.addEventListener('pointerleave', stop);
  btn.addEventListener('pointercancel', stop);
  btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  // hide the "add your file" hints once real media loads
  Array.prototype.forEach.call(document.querySelectorAll('audio,video'), function (m) {
    m.addEventListener('loadedmetadata', function () {
      var h = m.nextElementSibling;
      if (h && h.classList.contains('mediahint')) h.hidden = true;
    });
  });

  function finish() {
    finished = true;
    if (navigator.vibrate) navigator.vibrate(40);
    document.getElementById('game').hidden = true;
    SB.confetti(120);

    ['voice', 'letter', 'more'].forEach(function (id, n) {
      setTimeout(function () {
        SB.show(document.getElementById(id));
        if (n === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
      }, n * 700);
    });

    var lt = document.getElementById('lt'), text = lt.getAttribute('data-text'), skipped = false;
    setTimeout(function () {
      SB.type(lt, text, 32);
      lt.addEventListener('click', function () {
        if (skipped) return;
        skipped = true;
        lt._skip = true;
        lt.textContent = text;
      });
    }, 1500);
  }
})();
