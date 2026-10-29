(function () {
  var meter = document.getElementById('meter');
  if (!meter) return;
  var zone = document.getElementById('zone'), needle = document.getElementById('needle');
  var count = document.getElementById('count'), fb = document.getElementById('fb'), stopBtn = document.getElementById('stop');
  var need = 3, ok = 0, w = .28, speed = 1.3, center = .5, t0 = performance.now(), done = false;
  var oops = ['So close! Again 💙', 'Almost! Try once more', 'Patience, Sonuuu 😄'];

  function newZone() {
    center = .2 + Math.random() * .6;
    zone.style.left = ((center - w / 2) * 100) + '%';
    zone.style.width = (w * 100) + '%';
  }
  function pos(t) { return (Math.sin((t - t0) / 1000 * speed * Math.PI) + 1) / 2; }
  function frame(t) {
    if (done) return;
    needle.style.left = (pos(t) * 100) + '%';
    requestAnimationFrame(frame);
  }

  function press(e) {
    if (e) e.preventDefault();
    if (done) return;
    var p = pos(performance.now());
    if (Math.abs(p - center) <= w / 2) {
      ok++;
      count.textContent = ok + ' / ' + need;
      fb.textContent = 'Perfect! ✨';
      if (ok >= need) { done = true; setTimeout(SB.unlock, 500); return; }
      w = Math.max(.15, w - .05);
      speed += .4;
      newZone();
    } else {
      fb.textContent = oops[Math.floor(Math.random() * oops.length)];
    }
  }

  stopBtn.addEventListener('pointerdown', press);
  stopBtn.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') press(e); });
  newZone();
  requestAnimationFrame(frame);
})();
