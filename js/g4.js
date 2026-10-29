(function () {
  var sky = document.getElementById('sky'), s = document.getElementById('catchme');
  if (!sky || !s) return;
  var count = document.getElementById('count');
  var need = 7, caught = 0, timer = null, done = false;

  function move() {
    var w = Math.max(0, sky.clientWidth - 70), h = Math.max(0, sky.clientHeight - 70);
    s.style.transitionDuration = Math.max(.25, .75 - caught * .07) + 's';
    s.style.left = (Math.random() * w) + 'px';
    s.style.top = (Math.random() * h) + 'px';
  }
  function loop() {
    if (done) return;
    move();
    timer = setTimeout(loop, Math.max(450, 1300 - caught * 120));
  }

  s.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    if (done) return;
    caught++;
    count.textContent = caught + ' / ' + need + ' caught';
    if (navigator.vibrate) navigator.vibrate(15);
    if (caught >= need) {
      done = true;
      clearTimeout(timer);
      s.style.display = 'none';
      SB.confetti(60);
      setTimeout(SB.unlock, 500);
    } else {
      clearTimeout(timer);
      loop();
    }
  });

  loop();
})();
