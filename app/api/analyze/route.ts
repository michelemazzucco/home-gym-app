import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const difficulty = formData.get('difficulty') as string
    const sessionsPerWeekRaw = formData.get('sessionsPerWeek') as string | null
    const weeksRaw = formData.get('weeks') as string | null

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not provided' }, { status: 400 })
    }

    // Convert image to buffer for base64 encoding
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // Determine image type for data URL
    const imageType = image.type || 'image/jpeg'

    const workoutPerWeek = (() => {
      const n = Number(sessionsPerWeekRaw)
      if (!Number.isFinite(n)) return 3
      return Math.max(1, Math.min(14, Math.floor(n)))
    })()
    const weeks = (() => {
      const n = Number(weeksRaw)
      if (!Number.isFinite(n)) return 12
      return Math.max(1, Math.min(52, Math.floor(n)))
    })()

    const systemPrompt = `You are an experienced personal trainer specializing in home fitness programming. Apply these principles when designing every plan:

PROGRESSIVE OVERLOAD
Increase stimulus each week by adding reps, sets, or reducing rest — never increase all three at once. For beginners, add reps first. For intermediate/advanced, alternate between volume and intensity weeks.

EXERCISE ORDERING
Always sequence: compound multi-joint movements first (e.g. squat, hinge, push, pull), isolation or accessory work last. Higher neurological demand = earlier in the session.

SET AND REP SCHEMES BY DIFFICULTY
- Beginner: 2-3 sets, 10-15 reps, full-body each session, long rest (90s). Focus on movement quality and consistency.
- Intermediate: 3-4 sets, varied rep ranges — strength work at 5-8 reps, hypertrophy at 8-12, endurance at 15+. Rest 60-90s. Introduce push/pull/legs structure if frequency allows.
- Advanced: 4-5 sets, periodized rep ranges across blocks, shorter rest (45-60s for hypertrophy), supersets allowed. Include intensity techniques like drop sets or tempo work in later blocks.

BLOCK PERIODIZATION
Each block should have a distinct focus that builds on the previous:
- First block: foundation — master movement patterns, build work capacity, moderate volume.
- Middle block(s): development — increase load or volume, introduce more complex variations.
- Final block: peak or consolidation — higher intensity, lower volume, or test improvements.

DELOAD
For programs 8 weeks or longer, reduce volume by ~40% in the last week of each block (deload). Note this in the session title (e.g. "Deload — Light Week").

REST PERIODS
Strength focus: 2-3 min. Hypertrophy focus: 60-90s. Endurance/conditioning: 30-45s. Scale down for beginners who need more recovery.

SESSION STRUCTURE (30 min)
Each session should implicitly follow: 3-4 min movement prep → 20-22 min main work → 3-4 min cooldown/flexibility. Reflect this in exercise selection and volume, not as explicit sections.

EQUIPMENT CREATIVITY
If equipment is limited, use tempo (slow eccentric), isometric holds, unilateral variations, and bodyweight progressions to increase difficulty without adding load.`

    const userPrompt = `Create a full-body home workout program for someone who wants to get in shape.

Program details:
- Duration: ${weeks} weeks, ${workoutPerWeek} sessions per week
- Difficulty: ${difficulty}
- Each session: 30 minutes

Equipment: Use only what is visible in the image. If no equipment is present, use bodyweight exercises or improvised objects (e.g. chair, water bottle).

The program must be:
- Progressive across weeks
- Balanced between strength and flexibility
- Appropriate for the ${difficulty} level

Blocks: Divide the program into 2-3 roughly equal blocks (e.g. a ${weeks}-week plan → ${Math.ceil(weeks / 3)}-week blocks). Each block title must include the week range and a focus theme, e.g. "Week 1-4: Foundation".`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${imageType};base64,${base64Image}`,
                  detail: 'low',
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'workout_plan',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                equipment: {
                  type: 'array',
                  items: { type: 'string' },
                },
                plan: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      sessions: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            title: { type: 'string' },
                            exercizes: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  name: { type: 'string' },
                                  sets: { type: 'string' },
                                  reps: { type: 'string' },
                                  rest: { type: 'string' },
                                },
                                required: ['name', 'sets', 'reps', 'rest'],
                                additionalProperties: false,
                              },
                            },
                          },
                          required: ['title', 'exercizes'],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ['title', 'sessions'],
                    additionalProperties: false,
                  },
                },
              },
              required: ['equipment', 'plan'],
              additionalProperties: false,
            },
          },
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', response.status, errorData)

      try {
        const parsedError = JSON.parse(errorData)
        const errorMessage = parsedError?.error?.message || errorData
        return NextResponse.json(
          {
            error: `OpenAI API error (${response.status}): ${errorMessage}`,
          },
          { status: 500 }
        )
      } catch {
        return NextResponse.json(
          {
            error: `OpenAI API error (${response.status}): ${errorData}`,
          },
          { status: 500 }
        )
      }
    }

    const data = await response.json()

    const message = data.choices[0]?.message

    if (message?.refusal) {
      console.error('OpenAI refused the request:', message.refusal)
      return NextResponse.json({ error: 'Request refused by model' }, { status: 422 })
    }

    const content = message?.content

    if (!content) {
      console.error('No content in OpenAI response:', data)
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 })
    }

    return NextResponse.json(JSON.parse(content))
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
