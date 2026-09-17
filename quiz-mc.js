// Generic engine behind every "pick the right answer from a few options,
// one wrong answer ends the streak" game (Big-O Bout, HTTP Status
// Showdown, Flag Frenzy). Each item supplies its own options + fact so the
// engine never has to guess at fair distractors.
function MCQuiz({ items, statsKey, promptField = 'prompt', promptIsCode = false, promptIsHtml = false }) {
  let deck = []
  let idx = 0
  let streak = 0
  let answered = false

  const $ = (sel) => document.querySelector(sel)
  const promptEl = $('#term-name')
  const factBox = $('#fact-box')
  const verdictEl = $('#verdict')
  const optionsRow = $('#options-row')
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
    nextRow.hidden = true
    const item = deck[idx]

    if (promptIsCode) {
      promptEl.innerHTML = `<pre style="text-align:left; white-space:pre-wrap; font-size:14px; margin:0;">${escapeHtml(item[promptField])}</pre>`
    } else if (promptIsHtml) {
      promptEl.innerHTML = item[promptField]
    } else {
      promptEl.textContent = item[promptField]
    }
    promptEl.animate(
      [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 280, easing: 'cubic-bezier(.2,.7,.3,1)' }
    )

    optionsRow.innerHTML = ''
    optionsRow.hidden = false
    shuffle(item.options).forEach((opt) => {
      const btn = document.createElement('button')
      btn.className = 'btn btn-cyan opt-btn'
      btn.textContent = opt
      btn.addEventListener('mouseenter', () => Arcade.sfx.tick())
      btn.addEventListener('click', () => answer(opt, btn))
      optionsRow.appendChild(btn)
    })
  }

  function escapeHtml(s) {
    return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
  }

  function answer(chosen, btnEl) {
    if (answered) return
    answered = true
    const item = deck[idx]
    const correct = chosen === item.answer

    optionsRow.querySelectorAll('.opt-btn').forEach((b) => {
      b.disabled = true
      if (b.textContent === item.answer) b.classList.add('opt-correct')
    })
    if (!correct) btnEl.classList.add('opt-wrong')

    factBox.hidden = false
    factBox.textContent = item.fact
    verdictEl.hidden = false

    if (correct) {
      streak++
      Arcade.sfx.correct()
      verdictEl.textContent = `✓ CORRECT`
      verdictEl.className = 'verdict correct-v'
      nextRow.hidden = false
      const stats = Arcade.getStats(statsKey)
      if (streak > (stats.best || 0)) Arcade.setStats(statsKey, { best: streak })
    } else {
      Arcade.sfx.wrong()
      verdictEl.textContent = `✗ WRONG — it's "${item.answer}"`
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

  $('#next-btn').addEventListener('click', nextCard)
  $('#retry-btn').addEventListener('click', startRun)

  startRun()
}
