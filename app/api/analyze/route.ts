import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const difficulty = formData.get('difficulty') as string
    const sessionsPerWeekRaw = formData.get('sessionsPerWeek') as string | null
    const weeksRaw = formData.get('weeks') as string | null
    const apiKeyFromRequest = formData.get('apiKey') as string | null

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Use apiKey from request if provided, otherwise fall back to environment variable
    const apiKey = apiKeyFromRequest || process.env.OPENAI_API_KEY

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

    const prompt = `You are a professional trainer. 
    
    Redact a full body program, something that could be appreciated by a someone that would like to get in shape staying at home.

    Plan must have ${weeks} weeks duration, with ${workoutPerWeek} session per week.

    The workout plan must be: 
    - Detailed, progressive, and specifically use only the equipment identified in the image, if there are no equipment, use bodyweight exercises or object that could be used as equipment if in the picture (e.g. a chair, a water bottle, etc.)
    - Balanced, and include a mix of strength and flexibility exercises.
    - Specific to the equipment identified in the image.
    - Be specific for a ${difficulty} level.
    - Be 30 minutes long.

    About blocks
    - The workout should be grouped in 3 blocks max - e.g. 12 weeks duration 4 weeks blocks, 5 weeks duration: 1 x 3 weeks 1 x 2 weeks blocks, and so on.
    - If plan duration is 4 weeks, 2 blocks.
    - The title of the block should contain the weeks and the focus of the block, for example: "Week 1-3: Foundation"
    
    Also, the output must:
    - Not contain emoji
    - Not contain sarcasm
    - Not contain codeblock
    - Not contain Markdown
    - Be JSON only, ensure is valid JSON, response limit MUST not break it.
    - Be in the following JSON format:
    {
      "equipment": ["item1", "item2", ...],
      "plan": [{
        "title": "block title",
        "sessions": [{
          "title": "sessiontitle",
          "exercizes": [{
            "name": "exercise name",
            "sets": "sets",
            "reps": "reps",
            "rest": "rest"
          }]
        }]
      }]
    }`

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
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
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

    const content = data.choices[0]?.message?.content

    if (!content) {
      console.error('No content in OpenAI response:', data)
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 })
    }

    // Try to parse as JSON, fall back to raw content if parsing fails
    try {
      const parsedContent = JSON.parse(content)
      return NextResponse.json(parsedContent)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError)
      // Return the raw content as fallback to maintain previous behavior
      return NextResponse.json({ content })
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
