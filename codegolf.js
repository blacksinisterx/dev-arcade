// Player code runs in a real Web Worker, not eval'd on the main thread --
// a hard timeout + worker.terminate() means an accidental infinite loop
// (very possible in a code-golf game) can't freeze the page.
const WORKER_SRC = `
self.onmessage = function (e) {
  const { code, tests } = e.data
  try {
    const fn = new Function('return (' + code + ')')()
    const results = tests.map((t) => {
      try {
        const actual = fn(...t.args)
        return { pass: actual === t.expected, actual }
      } catch (err) {
        return { pass: false, actual: undefined, error: err.message }
      }
    })
    self.postMessage({ ok: true, results })
  } catch (err) {
    self.postMessage({ ok: false, error: err.message })
  }
}
`

function runInWorker(code, tests, timeoutMs = 1500) {
  return new Promise((resolve) => {
    let done = false
    const blob = new Blob([WORKER_SRC], { type: 'application/javascript' })
    const worker = new Worker(URL.createObjectURL(blob))
    const finish = (result) => {
      if (done) return
      done = true
      clearTimeout(timer)
      worker.terminate()
      resolve(result)
    }
    const timer = setTimeout(() => finish({ ok: false, error: 'Timed out -- possible infinite loop.' }), timeoutMs)
    worker.onmessage = (e) => finish(e.data)
    worker.onerror = (e) => finish({ ok: false, error: e.message })
    worker.postMessage({ code, tests })
  })
}

let idx = 0
let totalChars = 0

const $ = (sel) => document.querySelector(sel)
const titleEl = $('#challenge-title')
const descEl = $('#challenge-desc')
const testListEl = $('#test-list')
const inputEl = $('#golf-input')
const charCountEl = $('#char-count')
const parCountEl = $('#par-count')
const runBtn = $('#run-btn')
const nextBtn = $('#next-btn')
const resultBox = $('#result-box')
const overRow = $('#over-row')

function fmt(v) { return JSON.stringify(v) }

function updateBestTotal() {
  const stats = Arcade.getStats('codegolf')
  $('#best-total').textContent = stats.bestTotal != null ? stats.bestTotal : '—'
}
updateBestTotal()

function loadChallenge() {
  const c = GOLF_CHALLENGES[idx]
  $('#challenge-num').textContent = idx + 1
  titleEl.textContent = c.title
  descEl.textContent = c.desc
  parCountEl.textContent = c.par
  testListEl.innerHTML = c.tests
    .map((t) => `<div class="test-row" data-i="${c.tests.indexOf(t)}"><span class="mark">?</span> f(${t.args.map(fmt).join(', ')}) → ${fmt(t.expected)}</div>`)
    .join('')
  inputEl.value = ''
  charCountEl.textContent = '0'
  resultBox.hidden = true
  nextBtn.hidden = true
  runBtn.hidden = false
  inputEl.focus()
}

inputEl.addEventListener('input', () => { charCountEl.textContent = inputEl.value.length })

async function runChallenge() {
  const code = inputEl.value.trim()
  if (!code) return
  runBtn.disabled = true
  runBtn.textContent = 'RUNNING…'

  const c = GOLF_CHALLENGES[idx]
  const res = await runInWorker(code, c.tests)

  runBtn.disabled = false
  runBtn.textContent = '▶ RUN'
  resultBox.hidden = false

  if (!res.ok) {
    Arcade.sfx.wrong()
    resultBox.innerHTML = `<span style="color:var(--magenta)">✗ ${res.error}</span>`
    testListEl.querySelectorAll('.test-row').forEach((row) => { row.className = 'test-row'; row.querySelector('.mark').textContent = '?' })
    return
  }

  let allPass = true
  res.results.forEach((r, i) => {
    const row = testListEl.querySelector(`[data-i="${i}"]`)
    row.className = 'test-row ' + (r.pass ? 'pass' : 'fail')
    row.querySelector('.mark').textContent = r.pass ? '✓' : '✗'
    if (!r.pass) allPass = false
  })

  if (allPass) {
    Arcade.sfx.correct()
    const len = code.length
    totalChars += len
    const rating = len <= c.par ? '🥇 UNDER PAR' : len <= c.par * 1.5 ? '✓ SOLVED' : '✓ SOLVED (verbose)'
    resultBox.innerHTML = `<p class="rating" style="color:${len <= c.par ? 'var(--green)' : 'var(--cyan)'}">${rating}</p>${len} characters (par ${c.par})`
    runBtn.hidden = true
    if (idx + 1 >= GOLF_CHALLENGES.length) {
      finishRun()
    } else {
      nextBtn.hidden = false
    }
  } else {
    Arcade.sfx.wrong()
    resultBox.innerHTML += `<div style="margin-top:8px; color:var(--text-dim)">Some tests failed -- keep tweaking, no penalty for retrying.</div>`
  }
}

function finishRun() {
  overRow.hidden = false
  const stats = Arcade.getStats('codegolf')
  const isBest = stats.bestTotal == null || totalChars < stats.bestTotal
  if (isBest) {
    Arcade.setStats('codegolf', { bestTotal: totalChars })
    Arcade.sfx.win()
    Arcade.confetti(40)
    resultBox.innerHTML += `<div style="margin-top:10px; color:var(--yellow)">🏆 New best total: ${totalChars} chars across all 5!</div>`
  }
  updateBestTotal()
}

function startRun() {
  idx = 0
  totalChars = 0
  overRow.hidden = true
  loadChallenge()
}

runBtn.addEventListener('click', runChallenge)
inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') runChallenge() })
nextBtn.addEventListener('click', () => { idx++; loadChallenge() })
$('#retry-btn').addEventListener('click', startRun)

loadChallenge()
