// Real flag images from flagcdn.com (a free, public flag-image CDN), not
// Unicode flag emoji -- regional-indicator emoji rely on OS/font support
// that plenty of platforms (Windows especially) don't fully have, and fall
// back to showing the raw two-letter code instead of an actual flag.
const COUNTRIES = {
  Japan: 'jp', Brazil: 'br', 'South Korea': 'kr', India: 'in', Canada: 'ca',
  Australia: 'au', Germany: 'de', France: 'fr', Italy: 'it', Spain: 'es',
  Mexico: 'mx', 'South Africa': 'za', Egypt: 'eg', Singapore: 'sg',
  'New Zealand': 'nz', Sweden: 'se', Switzerland: 'ch', Netherlands: 'nl',
  Pakistan: 'pk', Turkey: 'tr', 'Saudi Arabia': 'sa', Argentina: 'ar',
  Greece: 'gr', Norway: 'no', Portugal: 'pt',
}

const FUN_FACTS = {
  Japan: 'The red circle represents the sun -- Japan\'s own name means "origin of the sun."',
  Brazil: 'The stars on the flag map the night sky over Rio on November 15, 1889 -- the day the republic was declared.',
  'South Korea': 'The center symbol (taegeuk) represents balance -- the same yin-yang concept, with trigrams from the I Ching in the corners.',
  India: 'The wheel in the center is the Ashoka Chakra, a 24-spoke wheel representing the eternal wheel of law.',
  Canada: 'The maple leaf has 11 points -- purely a design choice for how it looks at a distance, not a symbolic count.',
  Australia: 'The Southern Cross constellation is on the flag because it\'s only visible from the southern hemisphere.',
  Germany: 'Black-red-gold dates back to the Napoleonic Wars-era volunteer corps uniforms.',
  France: 'The tricolor combines the Paris city colors (red/blue) with the royal white, symbolizing unity after the revolution.',
  Italy: 'Modeled directly on the French tricolor, adopted by Napoleon\'s Cisalpine Republic in 1797.',
  Spain: 'One of the oldest national flags still in use, dating to 1785.',
  Mexico: 'The eagle eating a serpent on a cactus depicts the Aztec legend of where Tenochtitlan (now Mexico City) was founded.',
  'South Africa': 'One of the few flags with six colors and no religious or political symbol -- designed in 1994 to represent unity after apartheid.',
  Egypt: 'The golden eagle in the center is the Eagle of Saladin, a pan-Arab symbol.',
  Singapore: 'The crescent represents a young nation on the rise; the five stars stand for democracy, peace, progress, justice, and equality.',
  'New Zealand': 'The Southern Cross stars are red with white borders, distinguishing it from Australia\'s at a glance.',
  Sweden: 'The blue-and-yellow Scandinavian cross design likely inspired Norway, Denmark, Finland, and Iceland\'s flags.',
  Switzerland: 'One of only two square national flags in the world (the other is Vatican City).',
  Netherlands: 'One of the oldest tricolors in the world, dating to the 16th century -- originally orange-white-blue.',
  Pakistan: 'The white stripe represents religious minorities; the crescent and star symbolize progress and light.',
  Turkey: 'The crescent and star design has roots going back to the Ottoman Empire.',
  'Saudi Arabia': 'The flag bears the Shahada (Islamic declaration of faith) -- it\'s never flown at half-mast because of this.',
  Argentina: 'The "Sun of May" in the center commemorates a May 1810 event tied to independence from Spain.',
  Greece: 'The nine stripes are said to represent the nine syllables of "Eleftheria i Thanatos" -- "Freedom or Death."',
  Norway: 'Combines the Danish flag\'s colors with the Swedish-style cross, reflecting its union history with both.',
  Portugal: 'The armillary sphere and shield reference Portugal\'s Age of Discoveries maritime history.',
}

function shuffleArr(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildFlagItems() {
  const names = Object.keys(COUNTRIES)
  return names.map((country) => {
    const distractors = shuffleArr(names.filter((c) => c !== country)).slice(0, 3)
    const code = COUNTRIES[country]
    return {
      prompt: `<img src="https://flagcdn.com/w320/${code}.png" alt="flag" style="width:200px; max-width:80%; border-radius:6px; border:1px solid rgba(255,255,255,0.15);" />`,
      answer: country,
      options: [country, ...distractors],
      fact: FUN_FACTS[country],
    }
  })
}

const FLAG_ITEMS = buildFlagItems()
