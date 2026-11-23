// Fails when CLAUDE.md, README.md or a code comment has drifted from the code: a model name that
// is not MODEL, a component or lib file missing from the CLAUDE.md file tree, or a package script
// CLAUDE.md does not list.
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const read = (file) => readFileSync(file, 'utf8')
const claude = read('CLAUDE.md')
const problems = []

const model = read('app/lib/openai.ts').match(/export const MODEL = '([^']+)'/)?.[1]
if (!model) problems.push('app/lib/openai.ts: no MODEL constant found')

for (const file of ['CLAUDE.md', 'README.md', 'app/lib/mocks.ts']) {
  for (const [name] of read(file).matchAll(/gpt-[\w.-]*\w/g)) {
    if (name !== model) problems.push(`${file}: names ${name}, but MODEL is ${model}`)
  }
}

const tree = claude.slice(claude.indexOf('```\napp/'))
for (const dir of ['app/components', 'app/lib']) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name.startsWith('index.')) continue
    const name = path.parse(entry.name).name
    if (!tree.includes(name))
      problems.push(`CLAUDE.md: the file tree is missing ${dir}/${entry.name}`)
  }
}

for (const script of Object.keys(JSON.parse(read('package.json')).scripts)) {
  if (!claude.includes(`pnpm ${script}`))
    problems.push(`CLAUDE.md: does not list \`pnpm ${script}\``)
}

if (problems.length) {
  console.error(`check-docs: ${problems.length} problem(s)\n${problems.join('\n')}`)
  process.exit(1)
}
console.log('check-docs: CLAUDE.md, README.md and mocks.ts match the code')
