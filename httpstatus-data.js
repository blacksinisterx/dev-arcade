// Every code and meaning here is real -- including the weird ones (418,
// 451, 508 all genuinely exist in the HTTP spec/RFCs). Distractor options
// are other real status meanings, not made-up ones, so a wrong guess still
// teaches something.
const STATUS_ITEMS = [
  {
    prompt: '200',
    answer: 'OK — request succeeded',
    options: ['OK — request succeeded', 'Created — a new resource was made', 'No Content — succeeded, nothing to return', 'Accepted — processing, not done yet'],
    fact: '200 OK is the plain "it worked" response -- the most common status code on the web.',
  },
  {
    prompt: '201',
    answer: 'Created — a new resource was made',
    options: ['OK — request succeeded', 'Created — a new resource was made', 'No Content — succeeded, nothing to return', 'Moved Permanently'],
    fact: '201 Created is returned after a successful POST that made something new -- often with a Location header pointing at it.',
  },
  {
    prompt: '301',
    answer: 'Moved Permanently',
    options: ['Not Modified', 'Moved Permanently', 'Temporary Redirect', 'See Other'],
    fact: '301 tells clients (and search engines) the resource has a new permanent URL -- browsers cache this redirect.',
  },
  {
    prompt: '304',
    answer: 'Not Modified — use your cached copy',
    options: ['Moved Permanently', 'Not Modified — use your cached copy', 'No Content', 'Partial Content'],
    fact: '304 is how conditional requests (If-None-Match/If-Modified-Since) skip re-downloading something that hasn\'t changed.',
  },
  {
    prompt: '401',
    answer: 'Unauthorized — you need to authenticate',
    options: ['Forbidden — you\'re not allowed, period', 'Unauthorized — you need to authenticate', 'Not Found', 'Payment Required'],
    fact: '401 technically means "not authenticated" -- despite the name, it\'s about missing/invalid credentials, not permissions.',
  },
  {
    prompt: '403',
    answer: 'Forbidden — you\'re not allowed, period',
    options: ['Unauthorized — you need to authenticate', 'Forbidden — you\'re not allowed, period', 'Method Not Allowed', 'Conflict'],
    fact: '403 means the server understood who you are and still says no -- re-authenticating won\'t help.',
  },
  {
    prompt: '404',
    answer: 'Not Found',
    options: ['Not Found', 'Gone', 'Bad Request', 'Unprocessable Entity'],
    fact: 'The most famous status code on the internet -- the resource doesn\'t exist at this URL.',
  },
  {
    prompt: '418',
    answer: 'I\'m a Teapot',
    options: ['I\'m a Teapot', 'Bad Gateway', 'Method Not Allowed', 'Length Required'],
    fact: 'Genuinely real -- RFC 2324\'s April Fools "Hyper Text Coffee Pot Control Protocol." Some real servers (like Google\'s) still implement it as an easter egg.',
  },
  {
    prompt: '429',
    answer: 'Too Many Requests — you\'re rate-limited',
    options: ['Too Many Requests — you\'re rate-limited', 'Service Unavailable', 'Request Timeout', 'Forbidden'],
    fact: '429 is the standard "slow down" response -- often paired with a Retry-After header.',
  },
  {
    prompt: '451',
    answer: 'Unavailable For Legal Reasons',
    options: ['Unavailable For Legal Reasons', 'Gone', 'Payment Required', 'Precondition Failed'],
    fact: 'Really real, and really named after Fahrenheit 451 -- returned when content is blocked for legal reasons (e.g. government-mandated takedowns).',
  },
  {
    prompt: '500',
    answer: 'Internal Server Error',
    options: ['Internal Server Error', 'Bad Gateway', 'Service Unavailable', 'Gateway Timeout'],
    fact: 'The generic "something broke on our end" catch-all -- the server hit an unhandled condition.',
  },
  {
    prompt: '502',
    answer: 'Bad Gateway',
    options: ['Internal Server Error', 'Bad Gateway', 'Service Unavailable', 'Gateway Timeout'],
    fact: '502 means a server acting as a proxy/gateway got an invalid response from the upstream server it was talking to.',
  },
  {
    prompt: '503',
    answer: 'Service Unavailable — often just overloaded',
    options: ['Bad Gateway', 'Service Unavailable — often just overloaded', 'Gateway Timeout', 'Internal Server Error'],
    fact: '503 usually means the server is temporarily overloaded or down for maintenance, not permanently broken.',
  },
  {
    prompt: '508',
    answer: 'Loop Detected',
    options: ['Loop Detected', 'Insufficient Storage', 'Not Extended', 'Variant Also Negotiates'],
    fact: 'A real WebDAV status code -- the server detected an infinite loop while processing the request (e.g. circular references).',
  },
]
