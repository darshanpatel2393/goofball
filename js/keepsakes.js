(function () {
  var home = document.getElementById('home');
  if (!home) return;
  var $ = SB.$, $$ = SB.$$;
  var KEY = 'sonuuu_keepsakes_v2';

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  var st = load();
  st.read = st.read || {}; st.scr = st.scr || {}; st.used = st.used || {};

  var toastEl = $('#toast'), toastT = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }

  /* ---------- lock-screen clock + greeting ---------- */
  function tick() {
    var d = new Date(), h = d.getHours(), m = d.getMinutes();
    $('#clock').textContent = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $('#date').textContent = days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()];
    var hi = h < 5 ? 'Still awake,' : h < 12 ? 'Good morning,' : h < 17 ? 'Good afternoon,' : h < 21 ? 'Good evening,' : 'Good night,';
    $('#hello').innerHTML = hi + ' <em>Sonuuu</em> 💙';
  }
  tick();
  setInterval(tick, 30000);

  /* ---------- app switching ---------- */
  var panels = {}, ready = {}, init = {};
  $$('.panel').forEach(function (p) { panels[p.id.replace('p-', '')] = p; });

  function badges() {
    var unread = window.LETTERS.length - Object.keys(st.read).length;
    var fresh = window.COUPONS.length - Object.keys(st.scr).length;
    $('#bd-letters').textContent = unread > 0 ? unread : '';
    $('#bd-coupons').textContent = fresh > 0 ? fresh : '';
  }
  function showHome(on) {
    $('#lockscreen').hidden = !on;
    home.hidden = !on;
    $('#homehint').hidden = !on;
    $('#replay').hidden = !on;
  }
  function openApp(name) {
    showHome(false);
    Object.keys(panels).forEach(function (k) { panels[k].hidden = k !== name; });
    window.scrollTo(0, 0);
    if (!ready[name] && init[name]) { ready[name] = true; init[name](); }
  }
  function goHome() {
    Object.keys(panels).forEach(function (k) { panels[k].hidden = true; });
    showHome(true);
    badges();
    window.scrollTo(0, 0);
  }
  $$('.app').forEach(function (a) { a.addEventListener('click', function () { openApp(a.getAttribute('data-app')); }); });
  $$('.back').forEach(function (b) { b.addEventListener('click', goHome); });

  /* ---------- Open When: envelopes ---------- */
  var sheet = $('#sheet'), shText = $('#sh-text');
  function closeSheet() { shText._skip = true; sheet.hidden = true; }
  $('#sh-close').addEventListener('click', closeSheet);
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });

  init.letters = function () {
    var wrap = $('#envs');
    window.LETTERS.forEach(function (L, i) {
      var b = document.createElement('button');
      b.className = 'envl' + (st.read[i] ? ' read' : '');
      b.innerHTML = '<span class="body"></span><span class="lbl"></span><span class="flap"></span><span class="seal">💙</span>';
      b.querySelector('.lbl').textContent = L.e + ' Open when ' + L.t;
      b.addEventListener('click', function () {
        if (b.classList.contains('open')) return;
        b.classList.add('open');
        setTimeout(function () {
          $('#sh-title').textContent = 'Open when ' + L.t;
          sheet.hidden = false;
          SB.type(shText, L.b, 16);
          shText.onclick = function () { shText._skip = true; shText.textContent = L.b; };
          b.classList.remove('open');
          b.classList.add('read');
        }, 650);
        st.read[i] = true;
        save();
        badges();
      });
      wrap.appendChild(b);
    });
  };

  /* ---------- Coupons: scratch cards ---------- */
  function scratchify(card, i) {
    var cv = card.querySelector('canvas');
    var w = card.clientWidth, h = card.clientHeight;
    cv.width = w; cv.height = h;
    var g = cv.getContext('2d');
    var gr = g.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#c9d3e6'); gr.addColorStop(.5, '#f3f6fc'); gr.addColorStop(1, '#a7b4ca');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(10,26,63,.55)';
    g.font = '700 16px "DM Sans", sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('✨ scratch me ✨', w / 2, h / 2);
    g.globalCompositeOperation = 'destination-out';
    g.lineWidth = 30; g.lineCap = 'round'; g.lineJoin = 'round';

    var down = false, last = null, moves = 0;
    function pos(e) {
      var r = cv.getBoundingClientRect();
      return { x: (e.clientX - r.left) * w / r.width, y: (e.clientY - r.top) * h / r.height };
    }
    function stroke(a, b) { g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
    function cleared() {
      var d = g.getImageData(0, 0, w, h).data, clear = 0, total = 0;
      for (var y = 0; y < h; y += 4) for (var x = 0; x < w; x += 4) { total++; if (d[(y * w + x) * 4 + 3] < 30) clear++; }
      return clear / total;
    }
    function reveal() {
      if (card.classList.contains('revealed')) return;
      card.classList.add('revealed');
      st.scr[i] = true; save(); badges();
      SB.confetti(40);
      setTimeout(function () { if (cv.parentNode) cv.parentNode.removeChild(cv); }, 700);
    }
    cv.addEventListener('pointerdown', function (e) {
      down = true; last = pos(e);
      try { cv.setPointerCapture(e.pointerId); } catch (err) {}
      stroke(last, { x: last.x + .1, y: last.y + .1 });
    });
    cv.addEventListener('pointermove', function (e) {
      if (!down) return;
      var p = pos(e); stroke(last, p); last = p;
      if (++moves % 5 === 0 && cleared() > .45) reveal();
    });
    function up() { if (!down) return; down = false; if (cleared() > .45) reveal(); }
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
  }

  init.coupons = function () {
    var wrap = $('#coupons');
    window.COUPONS.forEach(function (c, i) {
      var d = document.createElement('div');
      d.className = 'scard' + (st.scr[i] ? ' revealed' : '') + (st.used[i] ? ' used' : '');
      d.innerHTML = '<div class="tk"><span class="ic"></span><div class="tx"><b></b><small></small></div><button class="btn">Redeem</button></div>' +
        '<span class="stamp">REDEEMED</span><canvas></canvas>';
      d.querySelector('.ic').textContent = c.e;
      d.querySelector('b').textContent = c.t;
      d.querySelector('small').textContent = c.s;
      d.querySelector('.btn').addEventListener('click', function () {
        st.used[i] = true; save();
        d.classList.add('used');
        SB.confetti(40);
      });
      wrap.appendChild(d);
      if (st.scr[i]) { var cv = d.querySelector('canvas'); cv.parentNode.removeChild(cv); }
      else scratchify(d, i);
    });
  };

  /* ---------- Prize wheel ---------- */
  init.wheel = function () {
    var wheel = $('#wheel'), list = window.WHEEL, n = list.length, seg = 360 / n;
    var cols = ['#ff8fb1', '#7cc4ff', '#ffd166', '#8fe3c0'], parts = [];
    list.forEach(function (p, i) {
      parts.push(cols[i % cols.length] + ' ' + (i * seg) + 'deg ' + ((i + 1) * seg) + 'deg');
      var s = document.createElement('span');
      s.textContent = p.e;
      s.style.setProperty('--a', (i * seg + seg / 2) + 'deg');
      wheel.appendChild(s);
    });
    wheel.style.background = 'conic-gradient(' + parts.join(',') + ')';

    var rot = 0, spinning = false, btn = $('#spin'), out = $('#prize');
    btn.addEventListener('click', function () {
      if (spinning) return;
      spinning = true; btn.disabled = true; out.innerHTML = '&nbsp;';
      rot += 1440 + Math.floor(Math.random() * 360);
      wheel.style.transform = 'rotate(' + rot + 'deg)';
      setTimeout(function () {
        var ang = (360 - (rot % 360)) % 360;
        var pz = list[Math.floor(ang / seg) % n];
        out.textContent = pz.e + '  ' + pz.t;
        SB.confetti(50);
        spinning = false; btn.disabled = false; btn.textContent = 'Spin again';
      }, 4400);
    });
  };

  /* ---------- Magic Momo ---------- */
  init.momo = function () {
    var m = $('#momo'), a = $('#answer'), last = -1, busy = false;
    m.addEventListener('click', function () {
      if (busy) return;
      busy = true;
      m.classList.remove('shake'); void m.offsetWidth; m.classList.add('shake');
      a.textContent = '...';
      setTimeout(function () {
        var k;
        do { k = Math.floor(Math.random() * window.MOMO.length); } while (k === last && window.MOMO.length > 1);
        last = k;
        a.textContent = window.MOMO[k];
        busy = false;
      }, 900);
    });
  };

  /* ---------- Garden ---------- */
  init.garden = function () {
    var g = $('#garden'), msg = $('#gmsg'), n = 0;
    var fl = ['🌷', '🌺', '🪷', '🌸', '🌻', '🦋'];
    g.addEventListener('click', function (e) {
      var r = g.getBoundingClientRect();
      var s = document.createElement('span');
      s.className = 'fl';
      s.textContent = fl[Math.floor(Math.random() * fl.length)];
      s.style.left = (e.clientX - r.left) + 'px';
      s.style.top = (e.clientY - r.top) + 'px';
      s.style.fontSize = (1.8 + Math.random() * 1.3) + 'rem';
      g.appendChild(s);
      n++;
      if (n > 60) { var old = g.querySelector('.fl'); if (old) g.removeChild(old); }
      if (n === 12) msg.textContent = 'You grew a whole garden 🌷';
    });
    $('#gclear').addEventListener('click', function () {
      $$('.fl', g).forEach(function (x) { g.removeChild(x); });
      n = 0; msg.innerHTML = '&nbsp;';
    });
  };

  /* ---------- Time capsule ---------- */
  init.capsule = function () {
    var cd = $('#capcd'), note = $('#capnote'), lock = $('#padlock'), hint = $('#caphint');
    var CAP = new Date('2027-11-03T00:00:00+05:30');
    function opened() {
      cd.hidden = true;
      lock.textContent = '🔓';
      hint.textContent = 'It is time. This one is for you:';
      note.hidden = false;
      SB.type(note.querySelector('.msg'), window.CAPSULE_NOTE, 22);
    }
    var early = SB.preview && location.search.indexOf('capsule') > -1;
    if (early || new Date() >= CAP) { opened(); return; }
    SB.countdown(cd, opened, CAP);
    lock.addEventListener('click', function () {
      lock.classList.remove('shake'); void lock.offsetWidth; lock.classList.add('shake');
      toast('Not yet, Sonuuu! Come back on 3 November 2027 💙');
    });
  };

  badges();
})();
