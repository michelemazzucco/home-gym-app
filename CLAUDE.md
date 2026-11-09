# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 application that reads a photo of home gym equipment and writes a personalized
workout plan around it. The user works through three steps on a single page:

1. Pick the plan characteristics (level, sessions per week, plan duration) and upload a photo.
2. Review the equipment the model found in the photo. Untick what the model got wrong and add
   what it missed. Only hand-added items can be removed.
3. Read the plan on a ruled-paper sheet, then copy it.

The OpenAI API key comes from the `OPENAI_API_KEY` environment variable. The app never asks the
user for one.

## Development Commands

- `pnpm dev` - Start the development server on http://localhost:3000
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint with `--fix`
- `pnpm format` - Run Prettier

`pnpm-lock.yaml` is the live lockfile.

### Mock mode

Set `MOCK_OPENAI=true` in `.env.local` to run the whole flow without spending OpenAI credits.
Both API routes then return canned data from `app/lib/mocks.ts` after a short delay, so the
loading states are still visible. The canned data is a real OpenAI run on
`public/example-equipment.jpg`, the photo behind the "Try it" toast on step 1. The mock plan is
fixed, so the settings and the confirmed equipment do not change it. The server logs a warning on
start so a mocked run is never mistaken for a real one.

## Architecture

### Core structure

- **Next.js 15 App Router**, one page at `/` plus two API routes.
- **Wizard state**: `app/context/AppContext.tsx` holds the step, the photo and the settings. The
  confirmed equipment and the generated plan live in `localStorage` and are read
  through `useSyncExternalStore` (`app/lib/planStorage.ts`), so a reload lands the user back on
  their plan. The server cannot see `localStorage`, so `page.tsx` renders the wizard only once
  `useHydrated()` is true. Without that gate a reload shows step 1 and then jumps to step 3.
  `planStorage` also checks the shape of the stored payload and drops a corrupt one.
- **Styling**: Tailwind v4. All design tokens are declared in the `@theme` block of
  `app/globals.css`. There are no CSS Modules and no `tailwind.config` file.
- **UI primitives**: shadcn/ui (Radix under the hood) in `app/components/ui/`. Icons are
  `lucide-react`. Toasts are `sonner`.

### The two API routes

The equipment step needs the equipment list before any plan exists, so the work is split:

- `POST /api/equipment` - `multipart/form-data` with `image`. One vision call at `detail: 'low'`.
  Returns `{ equipment: string[] }`.
- `POST /api/plan` - JSON with `equipment`, `difficulty`, `sessionsPerWeek`, `weeks` and
  `sessionMinutes`. No image, so it is cheaper and faster than the vision call. Returns
  `{ plan: WorkoutBlock[] }`, or a 502 when the model returns an empty plan.

Both go through `completeJson` in `app/lib/openai.ts`, which owns the fetch, the structured-output
request and the error mapping. Error messages from OpenAI are passed through to the client and
shown in a toast - do not swallow them.

On the client, both calls go through `postForJson` in `page.tsx`. It has a 90s timeout and turns
a network failure into a readable message. Failures show a toast with a "Try again" action that
runs the same call again.

### Shared model

`app/lib/workout.ts` is the single source of truth for the types, the JSON schemas, the prompts
and the min/max limits (`SESSIONS_MIN/MAX`, `WEEKS_MIN/MAX`, `SESSION_MINUTES_MIN/MAX`). Both routes
and the UI read from it. It also holds the equipment caps (`EQUIPMENT_MAX_ITEMS`,
`EQUIPMENT_NAME_MAX`) and `normalizeEquipment`, which both routes use to trim, dedupe without
regard to case and cap the list. `formatDuration` renders session minutes as a plain duration
("30 min", "1 h 30 min") for the picker. `describeExercize` adds "set"/"rep" units only to bare
numbers and ranges, because the model writes timed work as "30s" or "5min". `planToMarkdown`
builds the clipboard text from the data, not from the DOM.

Note the spelling `exercizes` / `Exercize`. It is baked into the JSON schema, the model output and
the stored payload. Renaming it means bumping the storage key in `app/lib/planStorage.ts`.

### File organization

```
app/
├── layout.tsx              # Fonts, providers, Toaster
├── page.tsx                # The 3-step wizard shell and both API calls
├── globals.css             # Tailwind import, @theme tokens, .paper-sheet
├── utils.ts                # Clipboard helpers
├── context/AppContext.tsx  # Wizard state
├── lib/
│   ├── workout.ts          # Types, schemas, prompts, limits, markdown
│   ├── openai.ts           # Shared OpenAI call and error mapping
│   ├── planStorage.ts      # localStorage external store
│   ├── mocks.ts            # Canned data for MOCK_OPENAI=true
│   ├── useObjectUrl.ts     # Object URL for the uploaded photo
│   └── utils.ts            # cn()
├── components/
│   ├── ui/                 # shadcn primitives
│   ├── SiteHeader, StepIndicator, StepHeading
│   ├── StepSettings, StepEquipment, StepPlanSummary
│   ├── PhotoDropzone, PhotoPreview, UploadHint, PaperSheet, EquipmentBadges
│   ├── NumberField         # Number input with steppers; clamps on blur, not per keystroke
│   └── InfoDialog, NewPlanDialog
└── api/
    ├── equipment/route.ts
    └── plan/route.ts
```

## Key implementation details

### Images

Compression happens **on the client**, in `PhotoDropzone`: a canvas resizes to a 2048px maximum
dimension and steps the JPEG quality down until the file is under 4MB, which keeps the request
below Vercel's 4.5MB body limit. There is no server-side image processing and Sharp is not a
dependency. The route base64-encodes whatever it receives.

Accepted types: JPEG, PNG, GIF, WebP.

### The paper sheet

`.paper-sheet` in `app/globals.css` is three stacked gradients: the orange margin rule, a white
mask for the top gutter, and the repeating ruled lines. The `1.75rem` baseline grid is
load-bearing - `.paper-sheet *` inherits that line height and `PaperSheet` nudges its headings by
fractions of a rem so the text sits on the rules. The hex values there are hardcoded on purpose;
Safari will not resolve CSS variables inside those gradients.

### Object URLs

`useObjectUrl` revokes the previous URL when the file changes but never on unmount. React re-runs
effect cleanups in development, and revoking there kills a URL the component is still rendering.

### Model

`gpt-5-mini` (`MODEL` in `app/lib/openai.ts`) with vision, called through the chat-completions
API with `reasoning_effort: 'minimal'`, `response_format: json_schema` and `strict: true`.
Reasoning tokens count against `max_completion_tokens`.

## Conventions

- User feedback goes through `toast()` from `sonner`.
- File type validation is client-side; the limits in `app/lib/workout.ts` are re-clamped server-side.
- The app is dark-only. Colors come from the `@theme` tokens, never from raw hex in components.
- `accent` (`#d9660e`) is the brand orange for text, rules, marks and the done step dots.
  Button fills use `action` / `action-hover`, which are darker so white labels pass 4.5:1. Hover
  goes darker, never lighter. Do not put white text on `accent`.
- Focus is `focus-visible:ring-2 ring-ring` at full opacity. Do not leave the browser default
  outline on custom controls.
- Touch-only differences use Tailwind's `pointer-coarse:` variant, not user-agent sniffing. A
  branch on the device inside render causes a hydration mismatch.
- Each step change moves focus to the new step heading (`StepHeading` takes a `ref`).
