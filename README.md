<div align="center">

# 👾 Dev Arcade

**Seven tiny learning games — tech and non-tech.**

[![No backend](https://img.shields.io/badge/backend-none-brightgreen)](#why-its-tiny)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue)](#why-its-tiny)
[![Cost](https://img.shields.io/badge/cost-%240%20forever-brightgreen)](#why-its-tiny)

</div>

---

## The games

### 🧠 Tech

| | |
|---|---|
| 🐛 **Bug Hunt** | A real, genuinely-buggy code snippet appears. Click the broken line before a 12-second clock runs out. 5 rounds, speed-weighted scoring. All 10 bugs are real, well-known JS gotchas — off-by-one loops, `=` vs `===`, missing `await`, `var` in a closure, `.sort()` without a comparator, and more — not made-up puzzles. |
| 🔤 **MLdle** | Wordle, but the daily 5-letter word is real AI/ML/CS jargon (`EPOCH`, `TOKEN`, `EMBED`, `PRUNE`...). Same word for everyone each day. Full duplicate-letter evaluation, shareable emoji-grid result. |
| 💾 **Deprecated or Not** | A JS API name appears — real (however obscure) or made up? One wrong answer ends the streak. Every "real" one is checked against actual JS/MDN history. |
| ⏱️ **Big-O Bout** | A real code snippet appears — pick its actual time complexity (O(1) through O(2ⁿ)). One wrong answer ends the streak. |
| 🌐 **HTTP Status Showdown** | A status code appears (yes, including 418 and 451, both genuinely real) — pick what it actually means. Wrong-answer options are other real status meanings, so a miss still teaches something. |

### 🌍 General

| | |
|---|---|
| 🚩 **Flag Frenzy** | A real flag image appears (via flagcdn.com — not Unicode flag emoji, which don't render as actual flags on every platform). Name the country. Comes with a real, checkable fun fact either way. |
| 🔬 **Fact or Fiction** | A science claim appears — real, or a popular myth? Every "myth" here is a genuinely, commonly-believed one that's actually been debunked (goldfish memory, the 10%-of-your-brain myth, lightning striking twice...), not a random-sounding lie. |

## Why it's tiny

No backend, no build step, no framework, no npm dependencies. Every "sound effect" is a synthesized oscillator beep (Web Audio API), not an audio file. The only external things loaded are two Google Fonts, one small flag-image CDN for Flag Frenzy, and nothing else. Streaks and best scores live in `localStorage` — clear your site data and they're gone, on purpose.

## Architecture

```
index.html              Arcade hub / game-select screen, grouped Tech / General
style.css                Shared retro-CRT/neon theme (scanlines, grid bg, glow)
shared.js                Synthesized SFX + mute toggle, localStorage helpers, day-seed, confetti

quiz-binary.js           Shared engine: real-or-fake, streak-based (Deprecated or Not, Fact or Fiction)
quiz-mc.js               Shared engine: multiple-choice, streak-based (Big-O Bout, HTTP Status, Flag Frenzy)

bughunt.html/.js         Game 1 (+ bughunt-data.js: 10 real bug snippets)
mldle.html/.js           Game 2 (+ mldle-data.js: real 5-letter AI/ML word list) -- bespoke, real Wordle mechanics
deprecated.html/.js      Game 3 (+ deprecated-data.js) -- thin config over quiz-binary.js
bigobout.html            Game 4 (+ bigobout-data.js) -- thin config over quiz-mc.js
httpstatus.html          Game 5 (+ httpstatus-data.js) -- thin config over quiz-mc.js
flagfrenzy.html          Game 6 (+ flagfrenzy-data.js) -- thin config over quiz-mc.js
factfiction.html         Game 7 (+ factfiction-data.js) -- thin config over quiz-binary.js
```

Each game is a plain HTML page + a small data file — most just wire their content into one of the two shared quiz engines instead of re-implementing streak/scoring/reveal logic from scratch. Bug Hunt and MLdle have genuinely different mechanics (a timed click-target and real Wordle rules), so they stay bespoke.

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
