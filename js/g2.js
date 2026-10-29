(function () {
  var grid = document.getElementById('grid');
  if (!grid) return;
  // B = royal blue, S = sky blue, P = tulip pink. A heart, so the gift stays a surprise.
  var map = [
    '..BBB..PPP..',
    '.BBSSBPPPPP.',
    '.BBBBBPPPPP.',
    '...BBBPPP...',
    '.....BP.....'
  ];
  var total = 0, filled = 0, down = false;
  var bar = document.getElementById('bar'), count = document.getElementById('count');

  map.forEach(function (row) {
    row.split('').forEach(function (ch) {
      var c = document.createElement('div');
      if (ch === '.') { c.className = 'cell gap'; }
      else { c.className = 'cell ' + ch; total++; }
      grid.appendChild(c);
    });
  });

  function fillAt(x, y) {
    var e = document.elementFromPoint(x, y);
    if (!e || !e.classList.contains('cell') || e.classList.contains('gap') || e.classList.contains('on')) return;
    e.classList.add('on');
    filled++;
    bar.style.width = (filled / total * 100) + '%';
    count.textContent = filled + ' / ' + total + ' tiles';
    if (navigator.vibrate) navigator.vibrate(8);
    if (filled === total) setTimeout(SB.unlock, 600);
  }

  grid.addEventListener('pointerdown', function (e) { down = true; fillAt(e.clientX, e.clientY); });
  grid.addEventListener('pointermove', function (e) { if (down) fillAt(e.clientX, e.clientY); });
  window.addEventListener('pointerup', function () { down = false; });
  window.addEventListener('pointercancel', function () { down = false; });
})();
