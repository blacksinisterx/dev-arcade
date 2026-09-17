// Generic engine behind every "guess real-or-fake, one wrong answer ends
// the streak" game (Deprecated or Not, Fact or Fiction). One wrong answer
// ends the run; each game just supplies its own item list + labels.
function BinaryQuiz({ items, statsKey, trueLabel = 'REAL', falseLabel = 'FAKE', promptField = 'name', flagField = 'real' }) {
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
    $('#best-val').textContent = Arcade.getStats(statsKey).best || 0
  }

  function startRun() {
    deck = shuffle(items)
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
    termName.textContent = deck[idx][promptField]
    termName.animate(
      [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 280, easing: 'cubic-bezier(.2,.7,.3,1)' }
    )
  }

  function answer(guessTrue) {
    if (answered) return
    answered = true
    const item = deck[idx]
    const isTrue = item[flagField]
    const correct = guessTrue === isTrue

    choiceRow.hidden = true
    factBox.hidden = false
    factBox.textContent = item.fact
    verdictEl.hidden = false

    if (correct) {
      streak++
      Arcade.sfx.correct()
      verdictEl.textContent = `✓ CORRECT — it's ${isTrue ? trueLabel : falseLabel}`
      verdictEl.className = 'verdict correct-v'
      nextRow.hidden = false
      const stats = Arcade.getStats(statsKey)
      if (streak > (stats.best || 0)) Arcade.setStats(statsKey, { best: streak })
    } else {
      Arcade.sfx.wrong()
      verdictEl.textContent = `✗ WRONG — it's actually ${isTrue ? trueLabel : falseLabel}`
      verdictEl.className = 'verdict wrong-v'
      endRun()
    }
    updateHud()
  }

  function nextCard() {
    idx++
    if (idx >= deck.length) { deck = shuffle(deck); idx = 0 }
    loadCard()
  }

  function endRun() {
    overRow.hidden = false
    const stats = Arcade.getStats(statsKey)
    if (streak > 0 && streak === stats.best) {
      Arcade.sfx.win()
      Arcade.confetti(30)
    }
  }

  $('#real-btn').textContent = `✓ ${trueLabel}`
  $('#fake-btn').textContent = `✗ ${falseLabel}`
  $('#real-btn').addEventListener('click', () => answer(true))
  $('#fake-btn').addEventListener('click', () => answer(false))
  $('#real-btn').addEventListener('mouseenter', () => Arcade.sfx.tick())
  $('#fake-btn').addEventListener('mouseenter', () => Arcade.sfx.tick())
  $('#next-btn').addEventListener('click', nextCard)
  $('#retry-btn').addEventListener('click', startRun)

  startRun()
}
