import { NextRequest, NextResponse } from 'next/server'
import { EQUIPMENT_SCHEMA, EQUIPMENT_SYSTEM_PROMPT } from '@/app/lib/workout'
import { completeJson, getApiKey } from '@/app/lib/openai'
import { isMockMode, mockDelay, MOCK_EQUIPMENT } from '@/app/lib/mocks'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image')

    if (!(image instanceof File)) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    if (isMockMode()) {
      await mockDelay(900)
      return NextResponse.json({ equipment: MOCK_EQUIPMENT, mock: true })
    }

    const apiKey = getApiKey()
    if (!apiKey) {
      return NextResponse.json(
        { error: 'The server has no OpenAI API key configured.' },
        { status: 500 }
      )
    }

    const base64Image = Buffer.from(await image.arrayBuffer()).toString('base64')
    const imageType = image.type || 'image/jpeg'

    const result = await completeJson<{ equipment: string[] }>({
      apiKey,
      maxTokens: 1500,
      schema: EQUIPMENT_SCHEMA,
      messages: [
        { role: 'system', content: EQUIPMENT_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'List the usable workout equipment you can see in this photo.' },
            {
              type: 'image_url',
              image_url: { url: `data:${imageType};base64,${base64Image}`, detail: 'low' },
            },
          ],
        },
      ],
    })

    if ('error' in result) return result.error

    const equipment = Array.isArray(result.data.equipment)
      ? result.data.equipment.map((item) => item.trim()).filter(Boolean)
      : []

    return NextResponse.json({ equipment })
  } catch (error) {
    console.error('Error identifying equipment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
