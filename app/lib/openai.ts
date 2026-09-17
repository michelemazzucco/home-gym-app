import { NextResponse } from 'next/server'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

export const MODEL = 'gpt-5-mini'

export const resolveApiKey = (fromRequest?: string | null) =>
  fromRequest?.trim() || process.env.OPENAI_API_KEY || null

type ChatMessage = {
  role: 'system' | 'user'
  content: string | Array<Record<string, unknown>>
}

export async function completeJson<T>({
  apiKey,
  messages,
  schema,
  maxTokens,
}: {
  apiKey: string
  messages: ChatMessage[]
  schema: unknown
  maxTokens: number
}): Promise<{ data: T } | { error: NextResponse }> {
  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      // Reasoning tokens count against this budget, so it is not just the JSON.
      max_completion_tokens: maxTokens,
      reasoning_effort: 'minimal',
      response_format: { type: 'json_schema', json_schema: schema },
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    console.error('OpenAI API error:', response.status, body)

    let message = body
    try {
      message = JSON.parse(body)?.error?.message ?? body
    } catch {}

    return {
      error: NextResponse.json(
        { error: `OpenAI API error (${response.status}): ${message}` },
        { status: response.status === 401 ? 401 : 502 }
      ),
    }
  }

  const payload = await response.json()
  const message = payload.choices?.[0]?.message

  if (message?.refusal) {
    console.error('OpenAI refused the request:', message.refusal)
    return { error: NextResponse.json({ error: 'Request refused by the model' }, { status: 422 }) }
  }

  if (!message?.content) {
    console.error('No content in OpenAI response:', payload)
    return { error: NextResponse.json({ error: 'No response from OpenAI' }, { status: 502 }) }
  }

  try {
    return { data: JSON.parse(message.content) as T }
  } catch {
    console.error('Could not parse OpenAI response:', message.content)
    return {
      error: NextResponse.json({ error: 'Malformed response from OpenAI' }, { status: 502 }),
    }
  }
}
