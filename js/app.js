(function () {
  'use strict';
  // Gift pages open at midnight (IST) on 3 Nov 2026. Add ?preview to any URL to bypass while testing.
  var UNLOCK = new Date('2026-11-03T00:00:00+05:30');

  var qs = new URLSearchParams(location.search);
  if (qs.has('preview')) { try { sessionStorage.setItem('sb_preview', '1'); } catch (e) {} }
  var preview = false;
  try { preview = sessionStorage.getItem('sb_preview') === '1'; } catch (e) {}

  var SB = window.SB = { preview: preview, UNLOCK: UNLOCK };
  SB.$ = function (s, r) { return (r || document).querySelector(s); };
  SB.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function addAvatar() {
    var a = document.createElement('div');
    a.className = 'avatar';
    a.innerHTML = '<span>S</span><img src="images/sonia.jpg" alt="Sonuuu">';
    var img = a.querySelector('img');
    img.onerror = function () { img.remove(); };
    document.body.appendChild(a);
  }

  // a little constellation: filled stars = pages done, glowing star = where she is now
  function addTrail() {
    var n = parseInt(document.body.getAttribute('data-gift'), 10);
    var tag = SB.$('.tag');
    if (!n || n > 10 || !tag) return;
    var t = document.createElement('div');
    t.className = 'trail';
    t.setAttribute('aria-hidden', 'true');
    for (var i = 1; i <= 10; i++) {
      var d = document.createElement('i');
      d.className = i < n ? 'done' : i === n ? 'now' : '';
      t.appendChild(d);
    }
    tag.parentNode.insertBefore(t, tag.nextSibling);
  }

  function addFloaters() {
    var items = ['🌷', '🪷', '💙', '✨', '🌷', '🦋'];
    var wrap = document.createElement('div');
    wrap.className = 'floaters';
    for (var i = 0; i < 14; i++) {
      var s = document.createElement('span');
      s.textContent = items[i % items.length];
      s.style.left = (Math.random() * 100) + '%';
      s.style.fontSize = (14 + Math.random() * 22) + 'px';
      s.style.animationDuration = (14 + Math.random() * 14) + 's';
      s.style.animationDelay = (-Math.random() * 24) + 's';
      wrap.appendChild(s);
    }
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  // <div class="photo" data-src="images/x.jpg"> shows the image, or a friendly placeholder if the file is missing
  SB.initPhotos = function (root) {
    SB.$$('.photo[data-src]', root).forEach(function (f) {
      if (f.getAttribute('data-ready')) return;
      f.setAttribute('data-ready', '1');
      var src = f.getAttribute('data-src');
      var ph = document.createElement('div');
      ph.className = 'ph';
      ph.innerHTML = '<b>📷</b><small>Add ' + src + '</small>';
      f.appendChild(ph);
      var img = new Image();
      img.onload = function () { ph.remove(); f.insertBefore(img, f.firstChild); };
      img.alt = f.getAttribute('data-label') || '';
      img.src = src;
    });
  };

  SB.countdown = function (el, onDone, target) {
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tick() {
      var d = (target || UNLOCK) - new Date();
      if (d <= 0) { if (onDone) onDone(); return false; }
      var s = Math.floor(d / 1000);
      var days = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
      el.innerHTML = [[days, 'days'], [pad(h), 'hrs'], [pad(m), 'min'], [pad(sec), 'sec']]
        .map(function (x) { return '<div><b>' + x[0] + '</b><small>' + x[1] + '</small></div>'; }).join('');
      return true;
    }
    if (tick() === false) return;
    var t = setInterval(function () { if (tick() === false) clearInterval(t); }, 1000);
  };

  SB.type = function (el, text, speed, done) {
    var i = 0;
    el.textContent = '';
    el._skip = false;
    (function step() {
      if (el._skip) { el.textContent = text; return; }
      if (i <= text.length) { el.textContent = text.slice(0, i++); setTimeout(step, speed || 28); }
      else if (done) done();
    })();
  };

  SB.show = function (el) {
    if (!el) return;
    el.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('show'); }); });
  };

  SB.confetti = function (n) {
    var c = document.createElement('canvas');
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:100';
    document.body.appendChild(c);
    var ctx = c.getContext('2d');
    c.width = innerWidth; c.height = innerHeight;
    var colors = ['#7cc4ff', '#ff8fb1', '#ffd166', '#ffffff', '#1f4fd8', '#8fe3c0'];
    var ps = [];
    for (var i = 0; i < (n || 100); i++) {
      ps.push({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, r: 4 + Math.random() * 6,
        vx: -1.5 + Math.random() * 3, vy: 2 + Math.random() * 4, a: Math.random() * 6, va: -.2 + Math.random() * .4,
        c: colors[i % colors.length] });
    }
    var start = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, c.width, c.height);
      ps.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
      });
      if (t - start < 3500) requestAnimationFrame(frame); else c.remove();
    })(start);
  };

  // Called by each mini game when it is won: reveals the gift, photo and message
  SB.unlock = function () {
    var g = SB.$('#gift');
    if (!g) return;
    SB.show(g);
    setTimeout(function () { g.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 250);
    SB.confetti(120);
    var m = SB.$('#msg');
    if (m && m.getAttribute('data-text')) {
      var full = m.getAttribute('data-text');
      SB.type(m, full, 24);
      m.addEventListener('click', function () { m._skip = true; m.textContent = full; });
    }
  };

  function gate() {
    if (!document.body.hasAttribute('data-gift')) return;
    if (preview || new Date() >= UNLOCK) return;
    var main = SB.$('main');
    var box = document.createElement('main');
    box.className = 'wrap center';
    box.innerHTML = '<section class="card"><div class="big">🔒</div><h1>Not yet, Sonuuu!</h1>' +
      '<p>This gift opens on your birthday. Good things come to those who wait 💙</p><div id="lockcd" class="countdown"></div></section>';
    main.parentNode.insertBefore(box, main);
    main.style.display = 'none';
    SB.countdown(SB.$('#lockcd'), function () { location.reload(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    addFloaters();
    addAvatar();
    addTrail();
    SB.initPhotos();
    gate();
  });
})();
