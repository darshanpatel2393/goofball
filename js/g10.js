(function () {
  var wall = document.getElementById('wall');
  if (!wall) return;
  var beam = document.getElementById('beam'), lightsBtn = document.getElementById('lights');
  var title = document.getElementById('wtitle'), hint = document.getElementById('whint');
  var lb = document.getElementById('lb'), lbBox = document.getElementById('lbphoto'), lbX = document.getElementById('lbx');
  var N = 23;                       // photos: images/wall1.jpg ... wall23.jpg
  var tiles = [], found = 0, lit = false;
  var praise = ['That smile 💙', 'Pure sunshine ☀️', 'Main character energy ✨', 'Art in motion 🎨', 'My favourite person 🌷', 'Brighter than any light 💡'];

  for (var i = 1; i <= N + 1; i++) {
    var t = document.createElement('div');
    t.className = 'tile';
    if (i <= N) {
      t.innerHTML = '<div class="photo" data-src="images/wall' + i + '.jpg"></div>';
    } else {
      t.className += ' heart';
      t.innerHTML = '<span>💙</span>';
    }
    wall.appendChild(t);
    if (i <= N) tiles.push({ el: t, src: 'images/wall' + i + '.jpg', found: false });
  }
  SB.initPhotos(wall);

  function lightUp(t) {
    if (t.found) return;
    t.found = true;
    t.el.classList.add('found');
    found++;
    if (navigator.vibrate) navigator.vibrate(8);
    if (found >= N) allLit();
  }

  function onMove(e) {
    if (lit) return;
    var r = wall.getBoundingClientRect();
    var x = e.clientX - r.left, y = e.clientY - r.top;
    beam.style.opacity = '1';
    beam.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    var reach = Math.max(34, r.width / 4 * 0.7);
    tiles.forEach(function (t) {
      if (t.found) return;
      var b = t.el.getBoundingClientRect();
      var cx = b.left + b.width / 2 - r.left, cy = b.top + b.height / 2 - r.top;
      if (Math.hypot(cx - x, cy - y) <= reach) lightUp(t);
    });
  }
  wall.addEventListener('pointerdown', onMove);
  wall.addEventListener('pointermove', onMove);
  wall.addEventListener('pointerleave', function () { beam.style.opacity = '0'; });

  function allLit() {
    if (lit) return;
    lit = true;
    tiles.forEach(function (t) { t.found = true; t.el.classList.add('found'); });
    wall.classList.add('lit');
    beam.style.opacity = '0';
    lightsBtn.hidden = true;
    title.textContent = 'There she is. 💙';
    hint.textContent = 'Tap any photo to look closer.';
    SB.confetti(150);
    setTimeout(SB.unlock, 900);
  }

  // fallback if she cannot find the last few photos
  setTimeout(function () { if (!lit) lightsBtn.hidden = false; }, 12000);
  lightsBtn.addEventListener('click', allLit);

  // zoom into a photo once the lights are on
  wall.addEventListener('click', function (e) {
    if (!lit) return;
    var el = e.target.closest ? e.target.closest('.tile') : null;
    if (!el || el.classList.contains('heart')) return;
    var idx = Array.prototype.indexOf.call(wall.querySelectorAll('.tile'), el);
    lbBox.innerHTML = '';
    var ph = document.createElement('div');
    ph.className = 'photo';
    ph.setAttribute('data-src', 'images/wall' + (idx + 1) + '.jpg');
    lbBox.appendChild(ph);
    SB.initPhotos(lbBox);
    document.getElementById('lbcap').textContent = praise[idx % praise.length];
    lb.hidden = false;
  });
  function closeLb() { lb.hidden = true; }
  lbX.addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
})();
