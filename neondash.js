const canvas = document.getElementById('stage')
const ctx = canvas.getContext('2d')
const wrap = document.querySelector('.stage-wrap')
const overlay = document.getElementById('overlay')
const overlayTitle = document.getElementById('overlay-title')
const overlayNote = document.getElementById('overlay-note')
const startBtn = document.getElementById('start-btn')
const liveScoreEl = document.getElementById('live-score')

let W = 0, H = 0, dpr = 1
let player = { x: 0, y: 0, r: 9, vx: 0 }
let trail = []
let obstacles = []
let particles = []
let running = false
let startTime = 0
let lastSpawn = 0
let lastFrame = 0
let score = 0
let rafId = null
const keys = { left: false, right: false }

function resize() {
  dpr = Math.min(2, window.devicePixelRatio || 1)
  const rect = wrap.getBoundingClientRect()
  W = rect.width
  H = rect.height
  canvas.width = W * dpr
  canvas.height = H * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  player.y = H - 44
  if (!running) player.x = W / 2
}
window.addEventListener('resize', resize)

function updateBest() {
  document.getElementById('best-val').textContent = Arcade.getStats('neondash').best || 0
}
updateBest()

function reset() {
  resize()
  player.x = W / 2
  player.vx = 0
  trail = []
  obstacles = []
  particles = []
  score = 0
  lastSpawn = 0
  startTime = performance.now()
  lastFrame = startTime
}

function spawnObstacle() {
  const w = 16 + Math.random() * 18
  const difficultyMs = performance.now() - startTime
  const speed = 90 + Math.min(260, difficultyMs / 90) + Math.random() * 40
  obstacles.push({ x: Math.random() * (W - w), y: -20, w, h: w * 0.8, speed })
}

function burst(x, y, color) {
  for (let i = 0; i < 24; i++) {
    const angle = (Math.PI * 2 * i) / 24
    const speed = 1.2 + Math.random() * 2.2
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color,
    })
  }
}

function circleRectHit(cx, cy, r, rect) {
  const nearX = Math.max(rect.x, Math.min(cx, rect.x + rect.w))
  const nearY = Math.max(rect.y, Math.min(cy, rect.y + rect.h))
  const dx = cx - nearX
  const dy = cy - nearY
  return dx * dx + dy * dy < r * r
}

function loop(t) {
  const dt = Math.min(40, t - lastFrame)
  lastFrame = t
  if (!running) return

  ctx.clearRect(0, 0, W, H)

  // background grid pulse
  ctx.fillStyle = '#030405'
  ctx.fillRect(0, 0, W, H)

  // player movement
  const speed = 0.38 * dt
  if (keys.left) player.vx = -speed
  else if (keys.right) player.vx = speed
  else player.vx *= 0.8
  player.x = Math.max(player.r, Math.min(W - player.r, player.x + player.vx))

  // trail
  trail.push({ x: player.x, y: player.y, life: 1 })
  if (trail.length > 16) trail.shift()
  trail.forEach((p, i) => {
    p.life -= 0.06
    const a = Math.max(0, (i / trail.length) * 0.5)
    ctx.beginPath()
    ctx.fillStyle = `rgba(255,46,151,${a})`
    ctx.arc(p.x, p.y, player.r * (i / trail.length), 0, Math.PI * 2)
    ctx.fill()
  })

  // player glow
  ctx.save()
  ctx.shadowColor = '#ff2e97'
  ctx.shadowBlur = 18
  ctx.fillStyle = '#ff2e97'
  ctx.beginPath()
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // spawn
  lastSpawn += dt
  const spawnRate = Math.max(280, 850 - (t - startTime) / 12)
  if (lastSpawn > spawnRate) {
    lastSpawn = 0
    spawnObstacle()
  }

  // obstacles
  let hit = false
  obstacles.forEach((o) => {
    o.y += (o.speed * dt) / 1000
    ctx.save()
    ctx.shadowColor = '#00f0ff'
    ctx.shadowBlur = 10
    ctx.fillStyle = '#00f0ff'
    ctx.fillRect(o.x, o.y, o.w, o.h)
    ctx.restore()
    if (circleRectHit(player.x, player.y, player.r * 0.85, o)) hit = true
  })
  obstacles = obstacles.filter((o) => o.y < H + 30)

  // particles
  particles.forEach((p) => {
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.05
    p.life -= 0.025
    ctx.globalAlpha = Math.max(0, p.life)
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  })
  particles = particles.filter((p) => p.life > 0)

  score = Math.floor((t - startTime) / 100)
  liveScoreEl.textContent = score

  if (hit) {
    gameOver()
    return
  }
  rafId = requestAnimationFrame(loop)
}

function gameOver() {
  running = false
  Arcade.sfx.wrong()
  Arcade.shake(wrap, 10)
  burst(player.x, player.y, '#ff2e97')
  const explode = () => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#030405'
    ctx.fillRect(0, 0, W, H)
    let alive = false
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= 0.02
      if (p.life > 0) {
        alive = true
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); ctx.fill()
        ctx.globalAlpha = 1
      }
    })
    particles = particles.filter((p) => p.life > 0)
    if (alive) requestAnimationFrame(explode)
  }
  explode()

  const stats = Arcade.getStats('neondash')
  const isBest = score > (stats.best || 0)
  if (isBest) {
    Arcade.setStats('neondash', { best: score })
    Arcade.sfx.win()
    Arcade.confetti(40)
  }
  updateBest()

  overlayTitle.textContent = 'GLITCHED OUT'
  overlayTitle.style.color = 'var(--magenta)'
  overlayNote.textContent = isBest ? `New best: ${score} 🏆` : `Score: ${score} — best: ${stats.best}`
  startBtn.textContent = '↻ TRY AGAIN'
  overlay.hidden = false
  liveScoreEl.hidden = true
}

function startRun() {
  reset()
  running = true
  overlay.hidden = true
  liveScoreEl.hidden = false
  lastFrame = performance.now()
  rafId = requestAnimationFrame(loop)
}

// keyboard
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true
})
window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false
})

// pointer drag
let dragging = false
canvas.addEventListener('pointerdown', (e) => { dragging = true; movePlayerToPointer(e) })
window.addEventListener('pointermove', (e) => { if (dragging) movePlayerToPointer(e) })
window.addEventListener('pointerup', () => { dragging = false })
function movePlayerToPointer(e) {
  if (!running) return
  const rect = canvas.getBoundingClientRect()
  player.x = Math.max(player.r, Math.min(W - player.r, e.clientX - rect.left))
}

startBtn.addEventListener('click', startRun)
resize()
