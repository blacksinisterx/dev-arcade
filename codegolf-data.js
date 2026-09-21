// Every "par" below is the real character count of a genuine, tested
// reference solution (listed in the comment) -- not a guessed number.
const GOLF_CHALLENGES = [
  {
    title: 'Is it even?',
    desc: 'Write a function that returns true if a number is even.',
    tests: [
      { args: [2], expected: true },
      { args: [3], expected: false },
      { args: [0], expected: true },
      { args: [-4], expected: true },
      { args: [-7], expected: false },
    ],
    par: 9, // n=>n%2==0
  },
  {
    title: 'Reverse a string',
    desc: 'Write a function that reverses a string.',
    tests: [
      { args: ['abc'], expected: 'cba' },
      { args: [''], expected: '' },
      { args: ['a'], expected: 'a' },
      { args: ['hello'], expected: 'olleh' },
    ],
    par: 28, // s=>[...s].reverse().join('')
  },
  {
    title: 'Sum an array',
    desc: 'Write a function that returns the sum of an array of numbers.',
    tests: [
      { args: [[1, 2, 3]], expected: 6 },
      { args: [[]], expected: 0 },
      { args: [[5]], expected: 5 },
      { args: [[-1, 1]], expected: 0 },
    ],
    par: 25, // a=>a.reduce((x,y)=>x+y,0)
  },
  {
    title: 'Max of an array',
    desc: 'Write a function that returns the largest number in an array.',
    tests: [
      { args: [[1, 5, 3]], expected: 5 },
      { args: [[-1, -5]], expected: -1 },
      { args: [[7]], expected: 7 },
    ],
    par: 17, // a=>Math.max(...a)
  },
  {
    title: 'Palindrome check',
    desc: 'Write a function that returns true if a string is a palindrome. Case-sensitive.',
    tests: [
      { args: ['racecar'], expected: true },
      { args: ['hello'], expected: false },
      { args: ['a'], expected: true },
      { args: [''], expected: true },
      { args: ['ab'], expected: false },
    ],
    par: 31, // s=>s==[...s].reverse().join('')
  },
]
