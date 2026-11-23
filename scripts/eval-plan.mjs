// Runs the real flow once on public/example-equipment.jpg and checks the plan the model writes.
// It spends OpenAI credits (one vision call and one plan call), so it needs --yes, and a dev
// server on :3000 started with MOCK_OPENAI=false.
import { readFileSync } from 'node:fs'
import { MOCK_EQUIPMENT } from '../app/lib/mocks.ts'

const BASE = process.env.EVAL_URL || 'http://localhost:3000'
const SETTINGS = { difficulty: 'intermediate', sessionsPerWeek: 3, weeks: 8, sessionMinutes: 45 }

if (!process.argv.includes('--yes')) {
  console.error('eval:plan makes two real OpenAI calls. Run it again with --yes to spend them.')
  process.exit(1)
}

const post = async (path, init) => {
  const res = await fetch(BASE + path, { method: 'POST', ...init })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${path} ${res.status}: ${body.error ?? 'no error message'}`)
  return body
}

const form = new FormData()
const photo = readFileSync('public/example-equipment.jpg')
form.append('image', new Blob([photo], { type: 'image/jpeg' }), 'example-equipment.jpg')
const { equipment } = await post('/api/equipment', { body: form })

if (JSON.stringify(equipment) === JSON.stringify(MOCK_EQUIPMENT)) {
  console.error(
    'The server answered with the mock data. Restart it with MOCK_OPENAI=false pnpm dev.'
  )
  process.exit(1)
}
console.log(`Equipment (${equipment.length}): ${equipment.join(', ')}\n`)

const { plan } = await post('/api/plan', {
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ equipment, ...SETTINGS }),
})

const problems = []
const owned = equipment.join(' ').toLowerCase()
const BODYWEIGHT = /bodyweight|none|floor|wall|chair|towel/i

if (plan.length < 2 || plan.length > 3)
  problems.push(`${plan.length} blocks, the prompt asks for 2-3`)
for (const block of plan) {
  if (!/week \d+/i.test(block.title)) problems.push(`"${block.title}" has no week range`)
  if (block.sessions.length !== SETTINGS.sessionsPerWeek) {
    problems.push(
      `"${block.title}" has ${block.sessions.length} sessions, asked for ${SETTINGS.sessionsPerWeek}`
    )
  }
  for (const session of block.sessions) {
    for (const ex of session.exercizes) {
      for (const field of ['name', 'sets', 'reps', 'rest']) {
        if (!String(ex[field] ?? '').trim())
          problems.push(`"${ex.name}" in "${session.title}" has no ${field}`)
      }
      const gear = ex.name.match(/\(([^)]+)\)/)?.[1]
      if (
        gear &&
        !BODYWEIGHT.test(gear) &&
        !gear
          .toLowerCase()
          .split(/\W+/)
          .some((w) => w.length > 2 && owned.includes(w))
      ) {
        problems.push(`"${ex.name}" uses "${gear}", which is not on the equipment list`)
      }
    }
  }
}

const titles = plan.flatMap((block) => block.sessions.map((s) => s.title))
console.log(`Settings: ${JSON.stringify(SETTINGS)}`)
console.log(`Blocks: ${plan.map((b) => b.title).join(' / ')}`)
console.log(`Session titles: ${[...new Set(titles)].join(' / ')}\n`)

if (problems.length) {
  console.error(`eval:plan: ${problems.length} problem(s)\n${problems.join('\n')}`)
  process.exit(1)
}
console.log('eval:plan: the plan matches the settings and uses only the listed equipment')
