// Real code, real complexity classes -- every answer double-checked
// against how the algorithm actually behaves, not just "looks like."
const BIGO_OPTIONS = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)']

const BIGO_ITEMS = [
  {
    prompt: 'function getFirst(arr) {\n  return arr[0];\n}',
    answer: 'O(1)',
    options: BIGO_OPTIONS,
    fact: 'Array index access is a direct memory lookup -- constant time no matter how big the array is.',
  },
  {
    prompt: 'let lo = 0, hi = n - 1;\nwhile (lo <= hi) {\n  const mid = (lo + hi) >> 1;\n  if (arr[mid] === target) return mid;\n  arr[mid] < target ? lo = mid + 1 : hi = mid - 1;\n}',
    answer: 'O(log n)',
    options: BIGO_OPTIONS,
    fact: 'Binary search: each step throws away half the remaining search space, so it takes log₂(n) steps.',
  },
  {
    prompt: 'for (let i = 0; i < n; i++) {\n  sum += arr[i];\n}',
    answer: 'O(n)',
    options: BIGO_OPTIONS,
    fact: 'One pass, one operation per element -- linear time.',
  },
  {
    prompt: 'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = arr.length / 2;\n  return merge(\n    mergeSort(arr.slice(0, mid)),\n    mergeSort(arr.slice(mid))\n  );\n}',
    answer: 'O(n log n)',
    options: BIGO_OPTIONS,
    fact: 'Merge sort splits log n times, and each of those levels does O(n) work to merge -- n × log n overall.',
  },
  {
    prompt: 'for (let i = 0; i < n; i++) {\n  for (let j = 0; j < n; j++) {\n    compare(arr[i], arr[j]);\n  }\n}',
    answer: 'O(n²)',
    options: BIGO_OPTIONS,
    fact: 'A full nested loop over the same n items -- n work, done n times, is n².',
  },
  {
    prompt: 'function fib(n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}',
    answer: 'O(2ⁿ)',
    options: BIGO_OPTIONS,
    fact: 'No memoization -- every call branches into two more calls, so the call tree doubles in size at each depth.',
  },
  {
    prompt: 'function hasDuplicate(arr) {\n  const seen = new Set();\n  for (const x of arr) {\n    if (seen.has(x)) return true;\n    seen.add(x);\n  }\n  return false;\n}',
    answer: 'O(n)',
    options: BIGO_OPTIONS,
    fact: 'One pass through the array; Set.has()/add() are O(1) on average, so the loop stays linear overall.',
  },
  {
    prompt: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    if (map.has(target - nums[i])) return [map.get(target - nums[i]), i];\n    map.set(nums[i], i);\n  }\n}',
    answer: 'O(n)',
    options: BIGO_OPTIONS,
    fact: 'One pass with O(1) average Map lookups per element -- the classic hash-map two-sum trick.',
  },
  {
    prompt: 'for (let i = 0; i < n; i++) {\n  for (let j = 0; j < n - i - 1; j++) {\n    if (arr[j] > arr[j + 1]) swap(arr, j, j + 1);\n  }\n}',
    answer: 'O(n²)',
    options: BIGO_OPTIONS,
    fact: 'Bubble sort -- the inner loop shrinks each pass, but it\'s still ~n²/2 comparisons, which is still O(n²).',
  },
]
