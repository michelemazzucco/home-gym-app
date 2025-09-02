import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const difficulty = formData.get('difficulty') as string

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Check image size limit (7.5MB to account for base64 expansion)
    const maxSize = 7.5 * 1024 * 1024 // 7.5MB in bytes
    if (image.size > maxSize) {
      return NextResponse.json({ 
        error: `Image too large. Maximum size is 7.5MB, your image is ${(image.size / 1024 / 1024).toFixed(2)}MB` 
      }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    
    // Check base64 size limit (10MB in base64)
    const maxBase64Size = 10 * 1024 * 1024 // 10MB in characters
    if (base64Image.length > maxBase64Size) {
      return NextResponse.json({ 
        error: `Image too large after encoding. Base64 size is ${(base64Image.length / 1024 / 1024).toFixed(2)}MB, maximum is 10MB` 
      }, { status: 400 })
    }
    
    // Determine image type for data URL
    const imageType = image.type || 'image/jpeg'

    const workoutPerWeek = 3
    const weeks = 12

    const prompt = `You are a professional trainer. 
    
    Redact a full body program, something that could be appreciated by a someone that would like to get in shape staying at home.

    The workout plan should be: 
    - Detailed, progressive, and specifically use only the equipment identified in the image, if there are no equipment, use bodyweight exercises or object that could be used as equipment if in the picture (e.g. a chair, a water bottle, etc.)
    - Balanced, and include a mix of strength and flexibility exercises.
    - Specific to the equipment identified in the image.
    - The workout plan should be specific for a ${difficulty} level.
    - The workout plan should be 30 minutes long.
    - The workout plan should be specific to the equipment identified in the image.
    - The workout plan should be specific to the difficulty level.
    - Grouped in blocks of 2-3 weeks each.
    ${workoutPerWeek} session per week, with ${weeks} duration.
    
    
    Also, the output should:
    - Not contain emoji
    - Not contain sarcasm
    - Not contain codeblock
    - Not contain Markdown
    - JSON only
    - Following the JSON format below:
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
            "rest": "rest",
          }, ...]
        }, ...]
      }, ...]
    }`
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${imageType};base64,${base64Image}`,
                  detail: 'low'
                }
              }
            ]
          }
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
        return NextResponse.json({ 
          error: `OpenAI API error (${response.status}): ${errorMessage}` 
        }, { status: 500 })
      } catch {
        return NextResponse.json({ 
          error: `OpenAI API error (${response.status}): ${errorData}` 
        }, { status: 500 })
      }
    }

    const data = await response.json()
    
    const content = data.choices[0]?.message?.content

    if (!content) {
      console.error('No content in OpenAI response:', data)
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 })
    }

    console.log(content)
    console.log(JSON.parse(content))

    return NextResponse.json(JSON.parse(content))

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}