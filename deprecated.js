let deck = []
let idx = 0
let streak = 0
let answered = false

const $ = (sel) => document.querySelector(sel)
const termName = $('#term-name')
const factBox = $('#fact-box')
const verdictEl = $('#verdict')
const choiceRow = $('#choice-row')
const nextRow = $('#next-row')
const overRow = $('#over-row')

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function updateHud() {
  $('#streak-val').textContent = streak
  $('#best-val').textContent = Arcade.getStats('deprecated').best || 0
}

function startRun() {
  deck = shuffle(TRIVIA)
  idx = 0
  streak = 0
  overRow.hidden = true
  loadCard()
  updateHud()
}

function loadCard() {
  answered = false
  verdictEl.hidden = true
  factBox.hidden = true
  choiceRow.hidden = false
  nextRow.hidden = true
  termName.textContent = deck[idx].name
}

function answer(guessReal) {
  if (answered) return
  answered = true
  const item = deck[idx]
  const correct = guessReal === item.real

  choiceRow.hidden = true
  factBox.hidden = false
  factBox.textContent = item.fact
  verdictEl.hidden = false

  if (correct) {
    streak++
    Arcade.sfx.correct()
    verdictEl.textContent = `✓ CORRECT — it's ${item.real ? 'REAL' : 'FAKE'}`
    verdictEl.className = 'verdict correct-v'
    nextRow.hidden = false
    const stats = Arcade.getStats('deprecated')
    if (streak > (stats.best || 0)) Arcade.setStats('deprecated', { best: streak })
  } else {
    Arcade.sfx.wrong()
    verdictEl.textContent = `✗ WRONG — it's actually ${item.real ? 'REAL' : 'FAKE'}`
    verdictEl.className = 'verdict wrong-v'
    endRun()
  }
  updateHud()
}

function nextCard() {
  idx++
  if (idx >= deck.length) deck = shuffle(deck), idx = 0
  loadCard()
}

function endRun() {
  overRow.hidden = false
  const stats = Arcade.getStats('deprecated')
  if (streak > 0 && streak === stats.best) {
    Arcade.sfx.win()
    Arcade.confetti(30)
  }
}

$('#real-btn').addEventListener('click', () => answer(true))
$('#fake-btn').addEventListener('click', () => answer(false))
$('#next-btn').addEventListener('click', nextCard)
$('#retry-btn').addEventListener('click', startRun)

startRun()
