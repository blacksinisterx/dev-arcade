// Small shared toolkit every game page pulls in: real synthesized SFX (no
// audio files), localStorage streak/best-score helpers, and a lightweight
// confetti burst for wins. Nothing here talks to a network.

const Arcade = (() => {
  let ctx = null
  function audioCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
    return ctx
  }

  function isMuted() {
    try { return localStorage.getItem('arcade:muted') === '1' } catch { return false }
  }
  function setMuted(val) {
    try { localStorage.setItem('arcade:muted', val ? '1' : '0') } catch { /* storage can be unavailable */ }
    document.querySelectorAll('.mute-btn').forEach((b) => { b.textContent = val ? '🔇' : '🔊' })
  }

  // Real oscillator-based blips -- an 8-bit "arcade" sound is just a short
  // square/sine wave with a fast decay envelope, not a sample file.
  function beep({ freq = 440, duration = 0.08, type = 'square', volume = 0.06 } = {}) {
    if (isMuted()) return
    try {
      const c = audioCtx()
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, c.currentTime)
      gain.gain.setValueAtTime(volume, c.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration)
      osc.connect(gain).connect(c.destination)
      osc.start()
      osc.stop(c.currentTime + duration)
    } catch { /* audio can fail before a user gesture -- fine to skip */ }
  }

  const sfx = {
    click: () => beep({ freq: 320, duration: 0.05 }),
    correct: () => { beep({ freq: 523, duration: 0.09 }); setTimeout(() => beep({ freq: 784, duration: 0.12 }), 90) },
    wrong: () => beep({ freq: 120, duration: 0.22, type: 'sawtooth', volume: 0.08 }),
    win: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep({ freq: f, duration: 0.14 }), i * 90)),
    tick: () => beep({ freq: 880, duration: 0.03, volume: 0.03 }),
  }

  function getStats(key) {
    try { return JSON.parse(localStorage.getItem(`arcade:${key}`)) || {} } catch { return {} }
  }
  function setStats(key, val) {
    try { localStorage.setItem(`arcade:${key}`, JSON.stringify(val)) } catch { /* storage can be unavailable */ }
  }

  // Deterministic day-seed so every player sees the same daily puzzle,
  // same idea as real Wordle -- not random per visit.
  function dayIndex(listLength) {
    const d = new Date()
    const seed = Number(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`)
    return seed % listLength
  }
  function todayKey() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  function confetti(count = 60) {
    const colors = ['#00f0ff', '#ff2e97', '#39ff88', '#ffd23f']
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      const size = 5 + Math.random() * 5
      Object.assign(el.style, {
        position: 'fixed',
        left: `${Math.random() * 100}vw`,
        top: '-10px',
        width: `${size}px`,
        height: `${size}px`,
        background: colors[i % colors.length],
        zIndex: 1000,
        pointerEvents: 'none',
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        transform: `rotate(${Math.random() * 360}deg)`,
      })
      document.body.appendChild(el)
      const fall = el.animate(
        [
          { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
          { transform: `translateY(${90 + Math.random() * 10}vh) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 },
        ],
        { duration: 1800 + Math.random() * 1200, easing: 'cubic-bezier(.3,.6,.5,1)' }
      )
      fall.onfinish = () => el.remove()
    }
  }

  // Injects a mute toggle into the topbar on every page -- one shared
  // control instead of copy-pasted markup/handlers per game.
  function mountMuteButton() {
    const bar = document.querySelector('.topbar')
    if (!bar || bar.querySelector('.mute-btn')) return
    const rightSide = bar.lastElementChild
    const wrap = document.createElement('div')
    wrap.className = 'topbar-right'
    const btn = document.createElement('button')
    btn.className = 'mute-btn'
    btn.type = 'button'
    btn.title = 'Toggle sound'
    btn.textContent = isMuted() ? '🔇' : '🔊'
    btn.addEventListener('click', () => setMuted(!isMuted()))
    bar.replaceChild(wrap, rightSide)
    wrap.append(btn, rightSide)
  }

  // A quick CRT "power on" flicker on first paint -- three fast opacity
  // pulses then settle, purely cosmetic, respects reduced-motion.
  function bootFlicker() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.body.animate(
      [
        { filter: 'brightness(0.3)', opacity: 0.4 },
        { filter: 'brightness(1.4)', opacity: 1 },
        { filter: 'brightness(0.5)', opacity: 0.7 },
        { filter: 'brightness(1)', opacity: 1 },
      ],
      { duration: 380, easing: 'steps(4, end)' }
    )
  }

  function staggerIn(selector, delayStep = 60) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.opacity = '0'
      el.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 380, delay: i * delayStep, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' }
      )
    })
  }

  mountMuteButton()
  bootFlicker()

  return { sfx, getStats, setStats, dayIndex, todayKey, confetti, staggerIn, isMuted, setMuted }
})()
