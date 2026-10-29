(function () {
  var reasons = window.REASONS, wrap = document.getElementById('blooms');
  if (!reasons || !wrap) return;
  var list = document.getElementById('reasons'), count = document.getElementById('count');
  var opened = 0, finished = false;
  var flowers = ['🌷', '🪷', '🌻', '🌼', '🌸', '🌹', '🌺'];

  reasons.forEach(function (r, i) {
    var b = document.createElement('button');
    b.className = 'bloom';
    b.textContent = '💐';
    b.setAttribute('aria-label', 'Bud ' + (i + 1));
    b.addEventListener('click', function () {
      if (b.classList.contains('open')) return;
      b.classList.add('open');
      b.textContent = flowers[i % 7];
      var li = document.createElement('li');
      li.textContent = r;
      list.insertBefore(li, list.firstChild);
      opened++;
      count.textContent = opened + ' / ' + reasons.length;
      if (navigator.vibrate) navigator.vibrate(10);
      if (opened === reasons.length && !finished) { finished = true; setTimeout(SB.unlock, 800); }
    });
    wrap.appendChild(b);
  });
  count.textContent = '0 / ' + reasons.length;
})();
