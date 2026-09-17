const ROUND_MS = 12000
const ROUNDS_PER_RUN = 5

let deck = []
let roundIdx = 0
let score = 0
let timerId = null
let roundStart = 0
let answered = false

const $ = (sel) => document.querySelector(sel)
const introEl = $('#intro')
const playEl = $('#play')
const doneEl = $('#done')
const codePanel = $('#code-panel')
const timerFill = $('#timer-fill')
const explainEl = $('#explain')
const nextBtn = $('#next-btn')

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function updateBestDisplay() {
  const stats = Arcade.getStats('bughunt')
  $('#best-score').textContent = stats.best || 0
}
updateBestDisplay()

$('#start-btn').addEventListener('click', startRun)
$('#retry-btn').addEventListener('click', startRun)
nextBtn.addEventListener('click', nextRound)

function startRun() {
  deck = shuffle(BUGS).slice(0, ROUNDS_PER_RUN)
  roundIdx = 0
  score = 0
  introEl.hidden = true
  doneEl.hidden = true
  playEl.hidden = false
  loadRound()
}

function loadRound() {
  answered = false
  explainEl.hidden = true
  nextBtn.hidden = true
  $('#round-num').textContent = roundIdx + 1
  $('#score-val').textContent = score

  const puzzle = deck[roundIdx]
  codePanel.innerHTML = ''
  puzzle.code.forEach((line, i) => {
    const row = document.createElement('div')
    row.className = 'code-line'
    row.dataset.line = i
    row.innerHTML = `<span class="ln">${i + 1}</span><pre>${escapeHtml(line)}</pre>`
    row.addEventListener('click', () => handleGuess(i))
    codePanel.appendChild(row)
  })

  roundStart = performance.now()
  timerFill.style.transition = 'none'
  timerFill.style.width = '100%'
  requestAnimationFrame(() => {
    timerFill.style.transition = `width ${ROUND_MS}ms linear`
    timerFill.style.width = '0%'
  })
  timerId = setTimeout(() => handleGuess(-1), ROUND_MS)
}

function escapeHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
}

function handleGuess(lineIdx) {
  if (answered) return
  answered = true
  clearTimeout(timerId)
  timerFill.style.transition = 'none'

  const puzzle = deck[roundIdx]
  const rows = codePanel.querySelectorAll('.code-line')
  const correct = lineIdx === puzzle.bugLine
  const elapsed = performance.now() - roundStart

  rows[puzzle.bugLine].classList.add('correct')
  if (!correct && lineIdx >= 0) rows[lineIdx].classList.add('wrong')

  if (correct) {
    const points = Math.max(20, Math.round(100 - (elapsed / ROUND_MS) * 80))
    score += points
    Arcade.sfx.correct()
    explainEl.textContent = `✓ +${points} pts (${(elapsed / 1000).toFixed(1)}s) — ${puzzle.explain}`
  } else {
    Arcade.sfx.wrong()
    explainEl.textContent = lineIdx === -1 ? `⏱ Out of time — ${puzzle.explain}` : `✗ Not quite — ${puzzle.explain}`
  }
  explainEl.hidden = false
  $('#score-val').textContent = score
  nextBtn.hidden = false
  nextBtn.textContent = roundIdx + 1 >= ROUNDS_PER_RUN ? 'SEE RESULTS →' : 'NEXT ROUND →'
}

function nextRound() {
  roundIdx++
  if (roundIdx >= ROUNDS_PER_RUN) {
    finishRun()
  } else {
    loadRound()
  }
}

function finishRun() {
  playEl.hidden = true
  doneEl.hidden = false
  $('#final-score').textContent = score

  const stats = Arcade.getStats('bughunt')
  const isNewBest = score > (stats.best || 0)
  if (isNewBest) {
    Arcade.setStats('bughunt', { best: score })
    $('#final-note').textContent = '🏆 New best score!'
    Arcade.sfx.win()
    Arcade.confetti()
  } else {
    $('#final-note').textContent = `Best: ${stats.best}`
  }
  updateBestDisplay()
}
