(function () {
  var svg = document.getElementById('stitch');
  if (!svg) return;
  var NS = 'http://www.w3.org/2000/svg';
  // 12 distinct dots. The path closes by returning to dot 3 (index 2), so that dot is tapped twice.
  var pts = [[150,285],[150,235],[150,180],[115,165],[105,120],[122,85],[138,110],[150,80],[162,110],[178,85],[195,120],[185,165]];
  var CLOSE_AT = 2;                 // dot to tap again to close the tulip
  var total = pts.length + 1;       // 13 taps in all

  function el(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function str(list) { return list.map(function (p) { return p.join(','); }).join(' '); }

  var petals = el('polygon', { points: str(pts.slice(CLOSE_AT)), fill: '#ff8fb1', opacity: '0', style: 'transition:opacity 1s' });
  var thread = el('polyline', { fill: 'none', stroke: '#7cc4ff', 'stroke-width': '4',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': '8 6' });
  svg.appendChild(petals);
  svg.appendChild(thread);

  var step = 0;                     // taps made so far
  var dots = [];
  var counter = document.getElementById('count');

  // which dot is the next one to tap
  function target() { return step < pts.length ? step : CLOSE_AT; }

  function mark() {
    var t = step < total ? target() : -1;
    dots.forEach(function (d, i) {
      var done = i < Math.min(step, pts.length) && i !== t;
      d.setAttribute('class', 'dot' + (i === t ? ' next' : done ? ' done' : ''));
    });
  }

  function tap(i) {
    if (step >= total || i !== target()) return;
    var path = pts.slice(0, Math.min(step + 1, pts.length));
    if (step >= pts.length) path = path.concat([pts[CLOSE_AT]]);
    thread.setAttribute('points', str(path));
    step++;
    counter.textContent = Math.min(step, pts.length) + ' / ' + pts.length + ' dots';
    mark();
    if (step === total) {
      thread.removeAttribute('stroke-dasharray');
      petals.setAttribute('opacity', '.85');
      setTimeout(SB.unlock, 900);
    }
  }

  pts.forEach(function (p, i) {
    var c = el('circle', { cx: p[0], cy: p[1], r: 10, 'class': 'dot' });
    c.addEventListener('pointerdown', function (e) { e.preventDefault(); tap(i); });
    dots.push(c);
    svg.appendChild(c);
  });
  mark();

  // exposed for testing
  window.__stitch = { tap: tap, total: total, pts: pts };
})();
