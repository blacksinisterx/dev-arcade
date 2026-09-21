const HOME = ['home', 'guest']
let level = 0
let cwd = [...HOME]
let history = []
let historyIdx = -1
let won = false

const output = document.getElementById('term-output')
const input = document.getElementById('term-input')
const promptEl = document.getElementById('term-prompt')

function root() { return LEVELS[level].tree }

function print(text, cls = '') {
  const line = document.createElement('div')
  if (cls) line.className = cls
  line.textContent = text
  output.appendChild(line)
  output.scrollTop = output.scrollHeight
  return text
}

function pathString(parts) { return '/' + parts.join('/') }

function resolvePath(raw) {
  let base
  if (raw.startsWith('/')) base = []
  else if (raw === '~' || raw.startsWith('~/')) { base = [...HOME]; raw = raw.slice(1).replace(/^\//, '') }
  else base = [...cwd]

  const parts = raw.split('/').filter((p) => p && p !== '.')
  for (const p of parts) {
    if (p === '..') base.pop()
    else base.push(p)
  }
  return base
}

function getNode(parts) {
  let node = root()
  for (const p of parts) {
    if (node.type !== 'dir' || !node.children[p]) return null
    node = node.children[p]
  }
  return node
}

function updatePrompt() {
  const short = pathString(cwd).replace(pathString(HOME), '~')
  promptEl.textContent = `guest@arcade:${short || '~'}$`
}

function cmdLs(args) {
  const showAll = args.includes('-a')
  const pathArg = args.find((a) => a !== '-a')
  const target = pathArg ? resolvePath(pathArg) : cwd
  const node = getNode(target)
  if (!node) return print(`ls: cannot access '${pathArg}': No such file or directory`, 'err')
  if (node.type === 'file') return print(pathArg || '')
  const names = Object.keys(node.children)
    .filter((n) => showAll || !n.startsWith('.'))
    .sort()
  if (names.length === 0) return
  print(names.map((n) => (node.children[n].type === 'dir' ? n + '/' : n)).join('  '))
}

function cmdCd(args) {
  const target = args[0] ? resolvePath(args[0]) : [...HOME]
  const node = getNode(target)
  if (!node) return print(`cd: no such file or directory: ${args[0]}`, 'err')
  if (node.type !== 'dir') return print(`cd: not a directory: ${args[0]}`, 'err')
  cwd = target
  updatePrompt()
}

function cmdCat(args) {
  if (!args[0]) return print('cat: missing file operand', 'err')
  const target = resolvePath(args[0])
  const node = getNode(target)
  if (!node) return print(`cat: ${args[0]}: No such file or directory`, 'err')
  if (node.type === 'dir') return print(`cat: ${args[0]}: Is a directory`, 'err')
  print(node.content)
  checkWin(node.content)
}

function cmdPwd() { print(pathString(cwd)) }

function cmdGrep(args) {
  const flagI = args.includes('-i')
  const rest = args.filter((a) => a !== '-i')
  const [pattern, pathArg] = rest
  if (!pattern || !pathArg) return print('usage: grep [-i] <pattern> <file>', 'err')
  const node = getNode(resolvePath(pathArg))
  if (!node || node.type !== 'file') return print(`grep: ${pathArg}: No such file`, 'err')
  const lines = node.content.split('\n')
  const re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, (c) => (c === '*' ? '.*' : '\\' + c)), flagI ? 'i' : '')
  const matches = lines.filter((l) => re.test(l))
  if (matches.length === 0) return print(`(no matches)`)
  matches.forEach((l) => print(l))
  checkWin(matches.join('\n'))
}

function cmdFind(args) {
  let nameIdx = args.indexOf('-name')
  const pattern = nameIdx !== -1 ? args[nameIdx + 1] : args[args.length - 1]
  if (!pattern) return print('usage: find . -name "<pattern>"', 'err')
  const re = new RegExp('^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$', 'i')
  const results = []
  function walk(node, parts) {
    if (node.type === 'dir') {
      for (const [name, child] of Object.entries(node.children)) {
        const p = [...parts, name]
        if (re.test(name)) results.push(pathString(p))
        walk(child, p)
      }
    }
  }
  walk(root(), [])
  if (results.length === 0) return print('(no matches)')
  results.forEach((r) => print(r))
}

function cmdHelp() {
  print('Available commands:')
  print('  ls [-a] [path]        list directory contents')
  print('  cd <path>              change directory (.. goes up, ~ goes home)')
  print('  cat <file>              print a file\'s contents')
  print('  pwd                     print working directory')
  print('  grep [-i] <pat> <file> search for a pattern inside a file')
  print('  find . -name "<pat>"   search the whole tree by filename (supports *)')
  print('  clear                   clear the screen')
}

function checkWin(text) {
  if (won) return
  if (text.includes(LEVELS[level].flag)) {
    won = true
    Arcade.sfx.win()
    Arcade.confetti(40)
    print('')
    print(`✓ FLAG CAPTURED: ${LEVELS[level].flag}`, 'hint')
    const stats = Arcade.getStats('terminal')
    if (level + 1 > (stats.best || 0)) Arcade.setStats('terminal', { best: level + 1 })
    document.getElementById('best-val').textContent = Arcade.getStats('terminal').best || 0

    if (level + 1 >= LEVELS.length) {
      print('ALL LEVELS CLEARED. Root access granted. 🏆', 'hint')
      document.getElementById('over-row').hidden = false
      input.disabled = true
    } else {
      setTimeout(() => {
        level++
        cwd = [...HOME]
        won = false
        document.getElementById('level-val').textContent = level + 1
        print('')
        print(`── LEVEL ${level + 1} ──`, 'hint')
        print(LEVELS[level].intro)
        updatePrompt()
      }, 1400)
    }
  }
}

function runCommand(raw) {
  const trimmed = raw.trim()
  if (!trimmed) return
  print(`${promptEl.textContent} ${trimmed}`, 'cmd-line')
  history.push(trimmed)
  historyIdx = history.length

  const args = trimmed.match(/"[^"]*"|\S+/g).map((a) => a.replace(/^"|"$/g, ''))
  const cmd = args.shift()

  switch (cmd) {
    case 'ls': cmdLs(args); break
    case 'cd': cmdCd(args); break
    case 'cat': cmdCat(args); break
    case 'pwd': cmdPwd(); break
    case 'grep': cmdGrep(args); break
    case 'find': cmdFind(args); break
    case 'help': cmdHelp(); break
    case 'clear': output.innerHTML = ''; break
    default: print(`command not found: ${cmd} (try 'help')`, 'err')
  }
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    runCommand(input.value)
    input.value = ''
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIdx > 0) { historyIdx--; input.value = history[historyIdx] }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIdx < history.length - 1) { historyIdx++; input.value = history[historyIdx] }
    else { historyIdx = history.length; input.value = '' }
  }
})

document.getElementById('retry-btn').addEventListener('click', () => window.location.reload())
output.addEventListener('click', () => input.focus())

document.getElementById('best-val').textContent = Arcade.getStats('terminal').best || 0
updatePrompt()
print('Type "help" to see available commands. Find the flag hidden somewhere in this filesystem.')
print('')
print(`── LEVEL 1 ──`, 'hint')
print(LEVELS[0].intro)
input.focus()
