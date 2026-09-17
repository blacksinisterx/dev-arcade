// Real, exactly-5-letter AI/ML/CS terms only -- hand-picked and checked,
// no padding just to hit a word count. (filter() left in as a cheap safety
// net in case a future edit adds something the wrong length.)
const ML_WORDS = [
  'EPOCH', 'TOKEN', 'AGENT', 'MODEL', 'LAYER', 'TRAIN', 'GRAPH', 'PIXEL',
  'VOCAB', 'PRIOR', 'NOISE', 'STACK', 'QUERY', 'INDEX', 'BATCH', 'EMBED',
  'LOGIT', 'PROXY', 'SCALE', 'SPLIT', 'DEPTH', 'DECAY', 'RESET', 'SHAPE',
  'CROSS', 'BOOST', 'PRUNE', 'FUSED', 'CACHE', 'SIGMA', 'PATCH', 'LABEL',
].filter((w) => w.length === 5)
