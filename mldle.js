const WORD_LEN = 5
const MAX_GUESSES = 6

const target = ML_WORDS[Arcade.dayIndex(ML_WORDS.length)]
const todayKey = Arcade.todayKey()

let current = ''
let guesses = []
let results = [] // array of per-guess evaluation arrays
let gameOver = false

const boardEl = document.getElementById('board')
const kbEl = document.getElementById('kb')
const resultPanel = document.getElementById('result-panel')

function loadState() {
  const saved = Arcade.getStats('mldle-today')
  if (saved.date === todayKey) {
    guesses = saved.guesses || []
    results = guesses.map((g) => evaluateGuess(g, target))
    gameOver = saved.status !== 'playing'
  } else {
    guesses = []
    results = []
    gameOver = false
  }
}

function saveState(status) {
  Arcade.setStats('mldle-today', { date: todayKey, guesses, status })
}

function evaluateGuess(guess, targetWord) {
  const result = Array(WORD_LEN).fill('absent')
  const targetArr = targetWord.split('')
  const guessArr = guess.split('')
  const used = Array(WORD_LEN).fill(false)
  for (let i = 0; i < WORD_LEN; i++) {
    if (guessArr[i] === targetArr[i]) { result[i] = 'correct'; used[i] = true }
  }
  for (let i = 0; i < WORD_LEN; i++) {
    if (result[i] === 'correct') continue
    const idx = targetArr.findIndex((c, j) => c === guessArr[i] && !used[j])
    if (idx !== -1) { result[i] = 'present'; used[idx] = true }
  }
  return result
}

function buildBoard() {
  boardEl.innerHTML = ''
  for (let r = 0; r < MAX_GUESSES; r++) {
    const row = document.createElement('div')
    row.className = 'board-row'
    row.id = `row-${r}`
    for (let c = 0; c < WORD_LEN; c++) {
      const cell = document.createElement('div')
      cell.className = 'cell'
      cell.id = `cell-${r}-${c}`
      row.appendChild(cell)
    }
    boardEl.appendChild(row)
  }
}

const KB_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]

function buildKeyboard() {
  kbEl.innerHTML = ''
  KB_ROWS.forEach((row) => {
    const rowEl = document.createElement('div')
    rowEl.className = 'kb-row'
    row.forEach((k) => {
      const btn = document.createElement('button')
      btn.className = 'key' + (k === 'ENTER' || k === '⌫' ? ' wide' : '')
      btn.textContent = k
      btn.dataset.key = k
      btn.addEventListener('click', () => handleKey(k === 'ENTER' ? 'Enter' : k === '⌫' ? 'Backspace' : k))
      rowEl.appendChild(btn)
    })
    kbEl.appendChild(rowEl)
  })
}

function renderRow(rowIdx, word, result) {
  for (let c = 0; c < WORD_LEN; c++) {
    const cell = document.getElementById(`cell-${rowIdx}-${c}`)
    const hadLetter = !!cell.textContent
    cell.textContent = word[c] || ''
    cell.classList.toggle('filled', !!word[c])
    if (!hadLetter && word[c] && !result) {
      cell.classList.remove('pop')
      void cell.offsetWidth
      cell.classList.add('pop')
    }
    if (result) {
      setTimeout(() => {
        cell.classList.add('flip', result[c])
      }, c * 80)
    }
  }
}

function renderKeyboardState() {
  const best = {}
  results.forEach((res, i) => {
    guesses[i].split('').forEach((letter, j) => {
      const rank = { absent: 0, present: 1, correct: 2 }
      if (!best[letter] || rank[res[j]] > rank[best[letter]]) best[letter] = res[j]
    })
  })
  document.querySelectorAll('.key').forEach((btn) => {
    const k = btn.dataset.key
    btn.classList.remove('correct', 'present', 'absent')
    if (best[k]) btn.classList.add(best[k])
  })
}

function renderAll() {
  guesses.forEach((g, i) => renderRow(i, g, results[i]))
  if (!gameOver) renderRow(guesses.length, current, null)
  renderKeyboardState()
  if (gameOver) showResult()
}

function showResult() {
  const won = guesses[guesses.length - 1] === target
  resultPanel.hidden = false
  document.getElementById('result-title').textContent = won ? '✓ SOLVED' : `✗ IT WAS "${target}"`
  document.getElementById('result-title').style.color = won ? 'var(--green)' : 'var(--magenta)'

  const emojiMap = { correct: '🟩', present: '🟨', absent: '⬛' }
  const grid = results.map((r) => r.map((x) => emojiMap[x]).join('')).join('\n')
  document.getElementById('share-grid').textContent = grid
}

function handleKey(key) {
  if (gameOver) return
  if (key === 'Enter') {
    submitGuess()
  } else if (key === 'Backspace') {
    current = current.slice(0, -1)
    renderRow(guesses.length, current, null)
  } else if (/^[A-Za-z]$/.test(key) && current.length < WORD_LEN) {
    current += key.toUpperCase()
    renderRow(guesses.length, current, null)
    Arcade.sfx.tick()
  }
}

function submitGuess() {
  if (current.length !== WORD_LEN) {
    const row = document.getElementById(`row-${guesses.length}`)
    row.classList.add('shake')
    setTimeout(() => row.classList.remove('shake'), 300)
    return
  }
  const result = evaluateGuess(current, target)
  guesses.push(current)
  results.push(result)
  renderRow(guesses.length - 1, current, result)
  Arcade.sfx.click()

  const won = current === target
  const outOfGuesses = guesses.length >= MAX_GUESSES
  current = ''

  if (won || outOfGuesses) {
    gameOver = true
    saveState(won ? 'won' : 'lost')
    updateStreak(won)
    setTimeout(() => {
      renderKeyboardState()
      showResult()
      if (won) { Arcade.sfx.win(); Arcade.confetti() } else { Arcade.sfx.wrong() }
    }, 500)
  } else {
    saveState('playing')
    setTimeout(renderKeyboardState, 500)
  }
}

function updateStreak(won) {
  const stats = Arcade.getStats('mldle')
  if (!won) {
    Arcade.setStats('mldle', { streak: 0, lastResultDate: todayKey })
    return
  }
  if (stats.lastResultDate === todayKey) return // already counted today (e.g. after a reload)
  const yesterday = new Date(Date.now() - 86400000)
  const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
  const newStreak = stats.lastResultDate === yKey ? (stats.streak || 0) + 1 : 1
  Arcade.setStats('mldle', { streak: newStreak, lastResultDate: todayKey })
}

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  handleKey(e.key)
})

document.getElementById('copy-btn').addEventListener('click', () => {
  const grid = document.getElementById('share-grid').textContent
  const won = guesses[guesses.length - 1] === target
  const text = `MLdle ${todayKey} ${won ? guesses.length : 'X'}/${MAX_GUESSES}\n${grid}`
  navigator.clipboard?.writeText(text)
  const btn = document.getElementById('copy-btn')
  const original = btn.textContent
  btn.textContent = '✓ COPIED'
  setTimeout(() => { btn.textContent = original }, 1500)
})

buildBoard()
buildKeyboard()
loadState()
renderAll()
