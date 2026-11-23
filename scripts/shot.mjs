// Walks the three steps at phone and desktop width and saves a screenshot of each to .shots/.
// Both API routes are answered from app/lib/mocks.ts inside the browser, so a run never spends
// OpenAI credits, even against a dev server started without MOCK_OPENAI.
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'
import { MOCK_EQUIPMENT, MOCK_PLAN } from '../app/lib/mocks.ts'

const BASE = process.env.SHOT_URL || 'http://localhost:3000'
const OUT = '.shots'
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'desktop', width: 1280, height: 900 },
]

const isUp = () =>
  fetch(BASE)
    .then((res) => res.ok)
    .catch(() => false)

let server
if (!(await isUp())) {
  console.log(`Nothing on ${BASE}, starting next dev with MOCK_OPENAI=true`)
  server = spawn('pnpm', ['exec', 'next', 'dev', '-p', '3000'], {
    env: { ...process.env, MOCK_OPENAI: 'true' },
    stdio: 'ignore',
    detached: true,
  })
  for (let i = 0; i < 60 && !(await isUp()); i++) await new Promise((r) => setTimeout(r, 1000))
  if (!(await isUp())) {
    console.error('The dev server did not come up within 60s')
    process.kill(-server.pid)
    process.exit(1)
  }
}

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const errors = []
const shots = []

try {
  for (const { name, ...viewport } of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      hasTouch: viewport.hasTouch,
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    page.on('console', (msg) => msg.type() === 'error' && errors.push(`${name}: ${msg.text()}`))
    page.on('pageerror', (err) => errors.push(`${name}: ${err.message}`))
    await page.route('**/api/equipment', (route) =>
      route.fulfill({ json: { equipment: MOCK_EQUIPMENT } })
    )
    await page.route('**/api/plan', (route) => route.fulfill({ json: { plan: MOCK_PLAN } }))

    // Full-page shots pin fixed elements (the mobile action bar) mid-page, so each step also
    // gets a shot of the screen as the user sees it.
    const shoot = async (step) => {
      await page.waitForTimeout(300)
      for (const fullPage of [false, true]) {
        const path = `${OUT}/${name}-${step}${fullPage ? '-full' : ''}.png`
        await page.screenshot({ path, fullPage })
        shots.push(path)
      }
    }

    await page.goto(BASE, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Find my equipment' }).waitFor()
    await shoot('1-settings')

    await page.locator('input[type=file]').setInputFiles('public/example-equipment.jpg')
    const find = page.getByRole('button', { name: 'Find my equipment' })
    await find.and(page.locator(':enabled')).waitFor()
    await shoot('1-photo')
    await find.click()

    await page.getByRole('button', { name: 'Write my plan' }).waitFor()
    await shoot('2-equipment')
    await page.getByRole('button', { name: 'Write my plan' }).click()

    await page.locator('.paper-sheet').first().waitFor()
    await shoot('3-plan')
    await context.close()
  }
} catch (err) {
  errors.push(`run: ${err.message.split('\n')[0]}`)
} finally {
  await browser.close()
  if (server) process.kill(-server.pid)
}

console.log(shots.join('\n'))
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n${errors.join('\n')}`)
  process.exit(1)
}
