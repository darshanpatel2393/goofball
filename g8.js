/* g8.js · Surprise 8: hold the heart -> YouTube video (new tab) -> voice note (optional) -> letter -> next page
   Save as js/g8.js. Self-contained: it only needs the markup in surprise8.html. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var game = $('game'), hold = $('hold');
  var videoCard = $('video'), vid = $('vid'), vidNote = $('vidnote'), skip = $('skip');
  var voiceCard = $('voice'), letterCard = $('letter'), more = $('more'), lt = $('lt');

  /* ---------- 1. YouTube link -> clean watch URL + video id ---------- */
  function parseYouTube(raw) {
    raw = (raw || '').trim();
    if (!raw || /PASTE_YOUR/i.test(raw)) return null;
    var m = raw.match(/youtu\.be\/([\w-]{11})/i) ||
            raw.match(/[?&]v=([\w-]{11})/i) ||
            raw.match(/youtube\.com\/(?:shorts|embed|live|v)\/([\w-]{11})/i);
    if (!m) return null;
    return { id: m[1], url: 'https://www.youtube.com/watch?v=' + m[1] };
  }

  var yt = parseYouTube(window.VIDEO_URL);

  if (yt) {
    vid.href = yt.url;
    /* thumbnail from YouTube itself, so nothing heavy is hosted on your site */
    var img = new Image();
    img.alt = '';
    img.onload = function () {
      /* YouTube returns a tiny 120px grey image when a thumbnail is missing */
      if (img.naturalWidth > 200) vid.insertBefore(img, vid.firstChild);
    };
    img.src = 'https://img.youtube.com/vi/' + yt.id + '/hqdefault.jpg';
  } else {
    vid.classList.add('off');
    vid.removeAttribute('href');
    vidNote.textContent = 'The video link has not been added yet.';
    vidNote.hidden = false;
    skip.hidden = false;
  }

  /* ---------- 2. Reveal helpers ---------- */
  function show(el) {
    if (!el || !el.hidden) return;
    el.hidden = false;
    if (!reduce) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      });
    }
  }

  function scrollTo(el) {
    try { el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); } catch (e) {}
  }

  /* ---------- 3. Voice note: only show if the file really loads ---------- */
  function checkVoice() {
    var audio = voiceCard.querySelector('audio');
    if (!audio) return;
    var probe = new Audio();
    probe.preload = 'metadata';
    probe.onloadedmetadata = function () { show(voiceCard); };
    probe.onerror = function () { voiceCard.hidden = true; };
    probe.src = audio.getAttribute('src');
  }

  /* ---------- 4. Letter typewriter (tap to finish instantly) ---------- */
  var typed = false;
  function typeLetter() {
    if (typed) return;
    typed = true;
    var text = lt.getAttribute('data-text') || '';
    lt.style.whiteSpace = 'pre-wrap';
    if (reduce) { lt.textContent = text; return; }

    var chars = Array.from(text), i = 0, timer;
    function finish() {
      clearInterval(timer);
      lt.textContent = text;
      lt.removeEventListener('click', finish);
    }
    lt.addEventListener('click', finish);
    timer = setInterval(function () {
      i += 1;
      lt.textContent = chars.slice(0, i).join('');
      if (i >= chars.length) finish();
    }, 28);
  }

  var opened = false;
  function openRest() {
    if (opened) return;
    opened = true;
    checkVoice();
    show(letterCard);
    typeLetter();
    show(more);
    setTimeout(function () { scrollTo(letterCard); }, 150);
  }

  /* Opening the video in a new tab unlocks the rest; she sees it when she comes back */
  vid.addEventListener('click', function () {
    if (!yt) return;
    setTimeout(openRest, 400);
  });
  skip.addEventListener('click', openRest);

  /* ---------- 5. Press and hold the heart ---------- */
  var HOLD_MS = 2200;
  var R = 46, C = 2 * Math.PI * R;
  var ns = 'http://www.w3.org/2000/svg';

  hold.style.position = 'relative';
  var svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;inset:-6px;width:calc(100% + 12px);height:calc(100% + 12px);transform:rotate(-90deg);pointer-events:none;overflow:visible';
  var ring = document.createElementNS(ns, 'circle');
  ring.setAttribute('cx', '50'); ring.setAttribute('cy', '50'); ring.setAttribute('r', String(R));
  ring.setAttribute('fill', 'none');
  ring.setAttribute('stroke', '#7cc4ff');
  ring.setAttribute('stroke-width', '5');
  ring.setAttribute('stroke-linecap', 'round');
  ring.setAttribute('stroke-dasharray', String(C));
  ring.setAttribute('stroke-dashoffset', String(C));
  svg.appendChild(ring);
  hold.appendChild(svg);

  var raf = 0, start = 0, done = false, holding = false;

  function setProgress(p) {
    ring.setAttribute('stroke-dashoffset', String(C * (1 - p)));
    hold.style.setProperty('--p', String(Math.round(p * 100)));
    hold.style.transform = 'scale(' + (1 + p * 0.12) + ')';
  }

  function tick(now) {
    if (!holding || done) return;
    var p = Math.min(1, (now - start) / HOLD_MS);
    setProgress(p);
    if (p >= 1) { complete(); return; }
    raf = requestAnimationFrame(tick);
  }

  function begin(e) {
    if (done) return;
    if (e && e.cancelable) e.preventDefault();
    holding = true;
    start = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  }

  function release() {
    if (done) return;
    holding = false;
    cancelAnimationFrame(raf);
    /* drain back smoothly */
    var from = parseFloat(hold.style.getPropertyValue('--p') || '0') / 100;
    var t0 = performance.now();
    (function back(now) {
      if (holding || done) return;
      var k = Math.min(1, (now - t0) / 350);
      setProgress(from * (1 - k));
      if (k < 1) requestAnimationFrame(back);
    })(t0);
  }

  function complete() {
    done = true;
    holding = false;
    setProgress(1);
    if (navigator.vibrate) { try { navigator.vibrate([30, 40, 60]); } catch (e) {} }
    hold.disabled = true;
    setTimeout(function () {
      game.hidden = true;
      show(videoCard);
      scrollTo(videoCard);
    }, 450);
  }

  hold.addEventListener('pointerdown', begin);
  hold.addEventListener('pointerup', release);
  hold.addEventListener('pointerleave', release);
  hold.addEventListener('pointercancel', release);
  hold.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  /* keyboard: hold Space or Enter */
  hold.addEventListener('keydown', function (e) {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) begin(e);
  });
  hold.addEventListener('keyup', function (e) {
    if (e.key === ' ' || e.key === 'Enter') release();
  });
})();
