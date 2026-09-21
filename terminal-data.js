// Each level is a real (virtual) filesystem tree. dir nodes have
// `children` (name -> node); file nodes have `content`. Every level's win
// condition is an exact string match against that level's real flag
// content -- decoy files exist on purpose and must NOT match.

function dir(children) { return { type: 'dir', children } }
function file(content) { return { type: 'file', content } }

const LEVELS = [
  // Level 1 -- plain ls/cd/cat
  {
    intro: 'A real virtual filesystem. Find the flag using ls, cd, and cat.',
    flagPath: '/home/guest/secret/flag.txt',
    flag: 'FLAG{welcome_to_the_shell}',
    tree: dir({
      home: dir({
        guest: dir({
          'notes.txt': file('Nothing interesting here.'),
          'todo.txt': file('1. Learn the shell\n2. Find the flag\n3. Profit'),
          secret: dir({
            'flag.txt': file('FLAG{welcome_to_the_shell}'),
          }),
        }),
      }),
    }),
  },

  // Level 2 -- needs `ls -a` to see a dotfile, plus a decoy flag to ignore
  {
    intro: 'Nothing in this folder directly. Check the archives and the decoys -- and remember, ls hides dotfiles unless you ask it not to.',
    flagPath: '/home/guest/archives/.env',
    flag: 'FLAG{dotfiles_are_not_hidden_from_ls_dash_a}',
    tree: dir({
      home: dir({
        guest: dir({
          'readme.txt': file('Nothing in this folder directly. Check the archives and the decoys.'),
          decoys: dir({
            'flag.txt': file('FLAG{nice_try_but_no}'),
          }),
          archives: dir({
            'old_notes.txt': file('Just some old notes, nothing special.'),
            '.env': file('FLAG{dotfiles_are_not_hidden_from_ls_dash_a}'),
          }),
        }),
      }),
    }),
  },

  // Level 3 -- needs grep inside a big log file
  {
    intro: 'The flag is buried inside a log file. Reading the whole thing by eye would take forever -- there\'s a command for exactly this.',
    flagPath: '/home/guest/logs/server.log',
    flag: 'FLAG{grep_is_your_friend}',
    tree: dir({
      home: dir({
        guest: dir({
          'readme.txt': file('The flag is buried somewhere inside a log file. Reading the whole thing by eye would take forever -- there\'s a command for exactly this.'),
          logs: dir({
            'access.log': file('127.0.0.1 - - [12/Jan] "GET /" 200\n127.0.0.1 - - [12/Jan] "GET /favicon.ico" 404\n127.0.0.1 - - [12/Jan] "GET /api/users" 200'),
            'server.log': file(
              [
                '[INFO] Server starting on port 3000',
                '[INFO] Connected to database',
                '[WARN] Slow query detected: 812ms',
                '[INFO] Cache warmed, 4021 keys loaded',
                '[DEBUG] FLAG{grep_is_your_friend}',
                '[INFO] Handling request GET /health',
                '[ERROR] Failed to connect to redis, retrying...',
                '[INFO] Redis reconnected',
                '[INFO] Server shutting down gracefully',
              ].join('\n')
            ),
          }),
        }),
      }),
    }),
  },

  // Level 4 -- deep nesting, needs `find` rather than manually cd-ing everywhere
  {
    intro: 'Somewhere under projects/ there\'s a hidden flag file. Manually cd-ing into every folder will take forever -- find . -name "..." searches the whole tree at once.',
    flagPath: '/home/guest/projects/app/src/utils/.secret_flag',
    flag: 'FLAG{find_dash_name_wins}',
    tree: dir({
      home: dir({
        guest: dir({
          'readme.txt': file('Somewhere under projects/ there\'s a hidden flag file. Manually cd-ing into every folder will take forever -- find . -name "..." searches the whole tree at once.'),
          projects: dir({
            old: dir({
              backup: dir({
                'junk.txt': file('Nothing here.'),
                'archive.tar.gz': file('(binary data)'),
              }),
              'notes.txt': file('This project is deprecated.'),
            }),
            app: dir({
              src: dir({
                components: dir({
                  'Button.js': file('export default function Button() {}'),
                  'Header.js': file('export default function Header() {}'),
                }),
                utils: dir({
                  'format.js': file('export function format(x) { return x; }'),
                  '.secret_flag': file('FLAG{find_dash_name_wins}'),
                }),
              }),
              'package.json': file('{ "name": "app" }'),
            }),
          }),
        }),
      }),
    }),
  },
]
