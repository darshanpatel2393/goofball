(function () {
  var cv = document.getElementById('paint');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var color = '#1f4fd8', down = false, last = null, won = false;
  var len = {}, usedCount = 0;
  var count = document.getElementById('count');

  function setup() {
    var r = cv.getBoundingClientRect();
    cv.width = Math.max(1, Math.round(r.width));
    cv.height = Math.max(1, Math.round(r.height));
    ctx.fillStyle = '#fff6ea';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }
  // the page may be gated at load time, so (re)size on first touch
  var sized = false;
  function ensure() { if (!sized) { setup(); sized = true; } }
  setup(); sized = cv.width > 1;

  function pos(e) {
    var r = cv.getBoundingClientRect();
    return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height };
  }

  function seg(a, b) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 16;
    ctx.globalAlpha = .92;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    var d = Math.hypot(b.x - a.x, b.y - a.y);
    len[color] = (len[color] || 0) + d;
    if (len[color] > 140 && !len[color + 'u']) {
      len[color + 'u'] = true;
      usedCount++;
      var pot = document.querySelector('.pot[data-c="' + color + '"]');
      if (pot) pot.classList.add('used');
      count.textContent = usedCount + ' / 5 colours used';
      if (usedCount >= 5 && !won) { won = true; setTimeout(SB.unlock, 700); }
    }
  }

  cv.addEventListener('pointerdown', function (e) {
    ensure();
    e.preventDefault();
    down = true;
    last = pos(e);
    seg(last, { x: last.x + .1, y: last.y + .1 });
  });
  cv.addEventListener('pointermove', function (e) {
    if (!down) return;
    var p = pos(e);
    seg(last, p);
    last = p;
  });
  window.addEventListener('pointerup', function () { down = false; });
  window.addEventListener('pointercancel', function () { down = false; });

  Array.prototype.forEach.call(document.querySelectorAll('.pot'), function (b) {
    b.addEventListener('click', function () {
      color = b.getAttribute('data-c');
      Array.prototype.forEach.call(document.querySelectorAll('.pot'), function (x) { x.classList.remove('sel'); });
      b.classList.add('sel');
    });
  });
})();
