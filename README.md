# Sonuuu's Birthday Quest 💙

10 surprises, then a keepsakes page. She opens `index.html`, taps Begin, and plays one little game per page. Each page has its own name and a glowing star trail that shows how far she has come. Every win unlocks a message and a button to the next page.

| # | Page name | What she does | You add |
|---|---|---|---|
| 1 | The First Spark | connects the dots | gift photo `s1.jpg` + message |
| 2 | Piece of My Heart | fills in a heart | gift photo `s2.jpg` + message |
| 3 | A Splash of Sonuuu | paints with 5 colours | gift photo `s3.jpg` + message |
| 4 | Catch a Wish | catches a star 7 times | gift photo `s4.jpg` + message |
| 5 | Made Just For You | finds the sweet spot 3 times | your baked gift photo `s5.jpg` + message |
| 6 | Us, Frame by Frame | taps each blurry photo to develop it | photos `us1`-`us8.jpg`, 8 captions, message |
| 7 | Twelve Little Flowers | blooms 12 flowers, each a reason | your 12 reasons |
| 8 | In My Own Words | holds the heart | `media/voice.mp3`, `media/video.mp4`, the letter |
| 9 | Make a Wish | blows out the candles (mic or tap) | message |
| 10 | Sonuuu, Everywhere | lights up a dark wall with her finger | photos `wall1`-`wall23.jpg`, message |
| ✦ | Keepsakes (Sonuuu OS) | open-when letters, scratch coupons, prize wheel, magic momo, garden, time capsule | letters, coupons, wheel prizes, capsule note |

## 1. Photos and media

Put files in `images/` and `media/` with these exact names (jpg), then refresh. Missing images show a "📷 Add ..." placeholder, so nothing breaks.

- `images/sonia.jpg` (her round photo on every page, plus home)
- `images/s1.jpg` ... `s5.jpg` (the 5 gifts)
- `images/us1.jpg` ... `us8.jpg` (you and her, in the order of the captions)
- `images/wall1.jpg` ... `wall23.jpg` (23 photos of her; the 24th tile is a heart)
- `images/video-poster.jpg` (optional video cover)
- `media/voice.mp3`, `media/video.mp4`

Tip: square-ish photos (faces in the middle) look best on the wall and in the polaroids.

## 2. Edit the words

Open the file in any text editor (Notepad is fine) and change the text:
- Messages: `data-text="..."` on the `class="msg"` paragraph (`&#10;` = new line)
- Photo captions (page 6): the `MEMORIES` list at the bottom of `surprise6.html`
- The 12 reasons (page 7): the `REASONS` list at the bottom of `surprise7.html`
- Letter (page 8): `data-text` on `id="lt"` in `surprise8.html`
- Keepsakes: the lists at the top of `keepsakes.html` (`LETTERS`, `COUPONS`, `WHEEL`, `MOMO`, `CAPSULE_NOTE`). Keep exactly 8 entries in `WHEEL`.

## 3. Put it online (free, about 2 minutes)

Go to https://app.netlify.com/drop and drag the whole `sonia-birthday` folder in. You get a link like `https://something.netlify.app`. Send her that link on 3 Nov.

## Testing

- Everything stays locked until 3 Nov 2026, 00:00 IST. To test early, open `https://YOUR-LINK/index.html?preview` once (it stays on for that browser tab).
- To read the time-capsule note early: `keepsakes.html?preview&capsule`.
- The coupons she scratched and redeemed are remembered on her phone only. To reset them while testing, clear the site data in the browser.
- To change the unlock date, edit `UNLOCK` at the top of `js/app.js`. The capsule date (3 Nov 2027) is at the top of the capsule section in `js/keepsakes.js`.
- The mic blow on page 9 needs the site to be on https (Netlify is). If the mic is blocked she can use the Tap button.
