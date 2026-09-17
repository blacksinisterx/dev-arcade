// Every "real" item here genuinely exists (or existed) in JS -- checked
// against MDN/spec history, not guessed. "Fake" items are plausible-sounding
// but do not exist as real JS APIs.
const TRIVIA = [
  { name: 'document.all', real: true, fact: 'Real. Non-standard, deprecated, but every major browser still supports it for legacy compat -- it returns a collection of all elements.' },
  { name: 'Array.prototype.flattenDeep()', real: false, fact: 'Fake. The real method is Array.prototype.flat(Infinity) -- there is no flattenDeep on the native prototype.' },
  { name: 'escape() / unescape()', real: true, fact: 'Real global functions, deprecated since ES3 in favor of encodeURIComponent/decodeURIComponent -- they mishandle non-Latin characters.' },
  { name: 'arguments.callee', real: true, fact: 'Real. Referenced the currently executing function from inside itself -- forbidden in strict mode because it breaks optimizations.' },
  { name: 'String.prototype.reverse()', real: false, fact: 'Fake. Strings have no native .reverse() -- you have to go through Array.from(str).reverse().join(\'\').' },
  { name: 'String.prototype.italics()', real: true, fact: 'Real. One of several HTML-wrapper methods (bold(), link(), fontcolor()...) added in the early Netscape era, still standardized as legacy/Annex B.' },
  { name: 'Object.observe()', real: true, fact: 'Real. A real Stage 2 proposal for observing object mutations, shipped in Chrome for a while, then withdrawn in favor of Proxies.' },
  { name: 'Array.prototype.compact()', real: false, fact: 'Fake. No native method removes falsy values -- that\'s array.filter(Boolean), written by hand.' },
  { name: 'Date.prototype.getYear()', real: true, fact: 'Real, and infamous -- it returns the year minus 1900 (so 2026 comes back as 126). getFullYear() is the sane version.' },
  { name: 'Object.deepFreeze()', real: false, fact: 'Fake. Object.freeze() only freezes one level deep -- there is no built-in deep version; you write the recursion yourself.' },
  { name: 'with statement', real: true, fact: 'Real. `with (obj) { ... }` injects an object\'s properties into scope -- banned in strict mode because it makes static analysis impossible.' },
  { name: 'Array.prototype.contains()', real: false, fact: 'Fake (sort of a trap). It was actually proposed and even shipped briefly, then renamed to includes() before release to avoid breaking MooTools sites.' },
  { name: 'Function.prototype.toSource()', real: true, fact: 'Real, but Firefox/SpiderMonkey-only -- returns the source code of a function as a string. Never standardized.' },
  { name: 'Number.prototype.clamp()', real: false, fact: 'Fake. No native clamp -- Math.min(Math.max(n, lo), hi) is the idiom.' },
  { name: 'document.write()', real: true, fact: 'Real, and still works -- but browsers now actively warn against it and block it on slow connections because it can nuke the whole page mid-parse.' },
]
