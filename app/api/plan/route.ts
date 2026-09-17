import { NextRequest, NextResponse } from 'next/server'
import {
  buildPlanPrompt,
  clamp,
  isDifficulty,
  PLAN_SCHEMA,
  PLAN_SYSTEM_PROMPT,
  SESSIONS_DEFAULT,
  SESSIONS_MAX,
  SESSION_MINUTES_DEFAULT,
  SESSION_MINUTES_MAX,
  SESSION_MINUTES_MIN,
  SESSIONS_MIN,
  WEEKS_DEFAULT,
  WEEKS_MAX,
  WEEKS_MIN,
  WorkoutBlock,
} from '@/app/lib/workout'
import { completeJson, resolveApiKey } from '@/app/lib/openai'
import { isMockMode, mockDelay, mockPlan } from '@/app/lib/mocks'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const equipment: string[] = Array.isArray(body.equipment)
      ? body.equipment
          .filter((item: unknown): item is string => typeof item === 'string')
          .map((item: string) => item.trim())
          .filter(Boolean)
      : []

    const difficulty = isDifficulty(body.difficulty) ? body.difficulty : 'beginner'
    const sessionsPerWeek = clamp(
      body.sessionsPerWeek,
      SESSIONS_MIN,
      SESSIONS_MAX,
      SESSIONS_DEFAULT
    )
    const weeks = clamp(body.weeks, WEEKS_MIN, WEEKS_MAX, WEEKS_DEFAULT)
    const sessionMinutes = clamp(
      body.sessionMinutes,
      SESSION_MINUTES_MIN,
      SESSION_MINUTES_MAX,
      SESSION_MINUTES_DEFAULT
    )

    if (isMockMode()) {
      await mockDelay(1200)
      return NextResponse.json({
        plan: mockPlan({ equipment, difficulty, sessionsPerWeek, weeks, sessionMinutes }),
        mock: true,
      })
    }

    const apiKey = resolveApiKey(body.apiKey)
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not provided' }, { status: 400 })
    }

    const result = await completeJson<{ plan: WorkoutBlock[] }>({
      apiKey,
      maxTokens: 6000,
      schema: PLAN_SCHEMA,
      messages: [
        { role: 'system', content: PLAN_SYSTEM_PROMPT },
        {
          role: 'user',
          content: buildPlanPrompt({
            equipment,
            difficulty,
            sessionsPerWeek,
            weeks,
            sessionMinutes,
          }),
        },
      ],
    })

    if ('error' in result) return result.error

    return NextResponse.json({ plan: result.data.plan ?? [] })
  } catch (error) {
    console.error('Error generating plan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
