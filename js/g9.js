(function () {
  var flames = Array.prototype.slice.call(document.querySelectorAll('.flame'));
  if (!flames.length) return;
  var fb = document.getElementById('fb'), micBtn = document.getElementById('mic'), tapBtn = document.getElementById('tap');
  var out = 0, finished = false, stream = null, ctx = null, raf = 0, tapTimer = null;

  function snuff() {
    if (finished) return;
    var f = flames[out];
    if (!f) return;
    f.classList.add('out');
    out++;
    if (navigator.vibrate) navigator.vibrate(12);
    if (out >= flames.length) win();
  }

  function stopMic() {
    cancelAnimationFrame(raf);
    if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
    if (ctx && ctx.close) ctx.close();
    stream = null; ctx = null;
  }

  function win() {
    finished = true;
    clearInterval(tapTimer);
    stopMic();
    fb.textContent = 'Make a wish... 🌠';
    setTimeout(function () {
      document.getElementById('game').hidden = true;
      SB.unlock();
      SB.confetti(180);
    }, 1400);
  }

  // tap: the candles go out one by one
  tapBtn.addEventListener('click', function () {
    if (finished || tapTimer) return;
    fb.textContent = 'Whoooosh 💨';
    tapTimer = setInterval(snuff, 350);
  });

  // mic: a steady blow puts the candles out, one after another
  micBtn.addEventListener('click', function () {
    if (finished || stream) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !AC) {
      fb.textContent = 'The mic is not available here. Use Tap to blow instead 💙';
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
      stream = s;
      ctx = new AC();
      var src = ctx.createMediaStreamSource(s), an = ctx.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      var buf = new Uint8Array(an.fftSize), loud = 0, last = 0;
      fb.textContent = 'Now blow, Sonuuu! 🌬️';
      (function tick(t) {
        an.getByteTimeDomainData(buf);
        var sum = 0;
        for (var i = 0; i < buf.length; i++) { var v = (buf[i] - 128) / 128; sum += v * v; }
        var rms = Math.sqrt(sum / buf.length);
        loud = rms > 0.12 ? loud + 1 : 0;
        if (loud > 3 && t - last > 350) { snuff(); last = t; }
        if (!finished) raf = requestAnimationFrame(tick);
      })(0);
    }).catch(function () {
      fb.textContent = 'No mic, no problem. Use Tap to blow 💙';
    });
  });
})();
