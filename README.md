<div align="center">

# 👾 Dev Arcade

**Three tiny games for people who spend too much time reading code.**

[![No backend](https://img.shields.io/badge/backend-none-brightgreen)](#why-its-tiny)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue)](#why-its-tiny)
[![Cost](https://img.shields.io/badge/cost-%240%20forever-brightgreen)](#why-its-tiny)

</div>

---

## The games

| | |
|---|---|
| 🐛 **Bug Hunt** | A real, genuinely-buggy code snippet appears. Click the broken line before a 12-second clock runs out. 5 rounds, speed-weighted scoring. Every bug is a real, well-known JS gotcha — off-by-one loops, `=` vs `===`, missing `await`, `var` in a closure, `.sort()` without a comparator, and five more — not a made-up puzzle. |
| 🔤 **MLdle** | Wordle, but the daily 5-letter word is real AI/ML/CS jargon (`EPOCH`, `TOKEN`, `EMBED`, `PRUNE`...). Same word for everyone each day, deterministic from the date. Full duplicate-letter handling, on-screen + physical keyboard, shareable emoji-grid result. |
| 💾 **Deprecated or Not** | A JS API name appears — is it real (however obscure or deprecated) or something we made up? One wrong answer ends the streak. Every "real" answer is checked against actual JS/MDN history; every "fake" one is a plausible-sounding trap, not a random string. |

## Why it's tiny

No backend, no build step, no framework, no npm dependencies. Every "sound effect" is a synthesized oscillator beep (Web Audio API), not an audio file. The only external things loaded are two Google Fonts and nothing else. Streaks and best scores live in `localStorage` — clear your site data and they're gone, on purpose.

## Architecture

```
index.html            Arcade hub / game-select screen
style.css             Shared retro-CRT/neon theme (scanlines, grid bg, glow)
shared.js             Synthesized SFX, localStorage helpers, day-seed, confetti
bughunt.html/.js      Game 1 (+ bughunt-data.js: the 10 real bug snippets)
mldle.html/.js        Game 2 (+ mldle-data.js: the real 5-letter word list)
deprecated.html/.js   Game 3 (+ deprecated-data.js: the real/fake trivia set)
```

Each game is a plain HTML page + one JS file — open any of them directly, no build step, no bundler.

## Running locally

Any static file server works, e.g.:

```bash
npx serve .
# or
python -m http.server 5180
```

## Deploy

Push to GitHub, import into Vercel (or any static host) as a static site — no build command needed.

## License

MIT
