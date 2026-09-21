// Real musical notes (C major arpeggio: C4, E4, G4, C5) -- not arbitrary
// frequencies, so the sequence actually sounds musical as it plays.
const NOTES = [261.63, 329.63, 392.0, 523.25]

let sequence = []
let round = 0
let playerIdx = 0
let locked = true

const $ = (sel) => document.querySelector(sel)
const pads = [...document.querySelectorAll('.pad')]
const statusText = $('#status-text')
const introEl = $('#intro')
const playEl = $('#play')
const doneEl = $('#done')

function updateHud() {
  $('#round-val').textContent = round
  $('#best-val').textContent = Arcade.getStats('echo').best || 0
}
updateHud()

function litPad(i, duration = 320) {
  pads[i].classList.add('lit')
  Arcade.tone(NOTES[i], duration / 1000)
  setTimeout(() => pads[i].classList.remove('lit'), duration)
}

async function playSequence() {
  locked = true
  pads.forEach((p) => (p.disabled = true))
  statusText.textContent = 'Watch closely…'
  await sleep(500)

  const gap = Math.max(260, 520 - round * 18)
  for (const i of sequence) {
    litPad(i, gap * 0.7)
    await sleep(gap)
  }

  statusText.textContent = 'Your turn'
  playerIdx = 0
  locked = false
  pads.forEach((p) => (p.disabled = false))
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function nextRound() {
  round++
  sequence.push(Math.floor(Math.random() * 4))
  updateHud()
  playSequence()
}

function handlePad(i) {
  if (locked) return
  litPad(i, 200)

  if (sequence[playerIdx] !== i) {
    locked = true
    Arcade.sfx.wrong()
    statusText.textContent = 'Wrong note!'
    endRun()
    return
  }

  playerIdx++
  if (playerIdx === sequence.length) {
    locked = true
    statusText.textContent = 'Nice — next round…'
    setTimeout(nextRound, 700)
  }
}

function startRun() {
  sequence = []
  round = 0
  introEl.hidden = true
  doneEl.hidden = true
  playEl.hidden = false
  nextRound()
}

function endRun() {
  setTimeout(() => {
    playEl.hidden = true
    doneEl.hidden = false
    $('#final-round').textContent = round - 1

    const stats = Arcade.getStats('echo')
    const finalScore = round - 1
    if (finalScore > (stats.best || 0)) {
      Arcade.setStats('echo', { best: finalScore })
      $('#final-note').textContent = '🏆 New best!'
      Arcade.sfx.win()
      Arcade.confetti()
    } else {
      $('#final-note').textContent = `Best: ${stats.best}`
    }
    updateHud()
  }, 600)
}

pads.forEach((pad, i) => pad.addEventListener('click', () => handlePad(i)))
$('#start-btn').addEventListener('click', startRun)
$('#retry-btn').addEventListener('click', startRun)
