import z from 'zod'

import forge from '../forge'

const QUOTE_URL = 'https://quotescharm.com/api/v1/random'
const QUOTE_TIMEOUT_MS = 5 * 1000
const QUOTE_MAX_BYTES = 64 * 1024
const QUOTE_CACHE_TTL_MS = 5 * 60 * 1000

const quoteSchema = z.array(
  z.object({
    q: z.string(),
    a: z.string(),
    url: z.url()
  })
)

const upstreamQuoteSchema = z.object({
  quote: z.string(),
  author: z.string(),
  url: z.url()
})

type Quote = z.infer<typeof quoteSchema>

let cachedQuote: { fetchedAt: number; data: Quote } | null = null

async function fetchQuote(): Promise<Quote | null> {
  let res: Response

  try {
    res = await fetch(QUOTE_URL, {
      headers: {
        Accept: 'application/json'
      },
      redirect: 'error',
      signal: AbortSignal.timeout(QUOTE_TIMEOUT_MS)
    })
  } catch {
    return null
  }

  if (!res.ok) {
    return null
  }

  const contentLength = Number(res.headers.get('content-length') ?? 0)

  if (contentLength > QUOTE_MAX_BYTES) {
    return null
  }

  const text = await res.text()

  if (text.length > QUOTE_MAX_BYTES) {
    return null
  }

  try {
    const parsed = upstreamQuoteSchema.safeParse(JSON.parse(text))

    if (!parsed.success) {
      return null
    }

    return [
      {
        q: parsed.data.quote,
        a: parsed.data.author,
        url: parsed.data.url
      }
    ]
  } catch {
    return null
  }
}

export const random = forge
  .query({
    description: 'Get a random quote',
    output: {
      OK: quoteSchema
    }
  })
  .callback(async ({ response }) => {
    if (
      cachedQuote &&
      Date.now() - cachedQuote.fetchedAt < QUOTE_CACHE_TTL_MS
    ) {
      return response.ok(cachedQuote.data)
    }

    const quote = await fetchQuote()

    if (!quote) {
      // Serve a stale quote rather than breaking the widget when the upstream
      // is temporarily unavailable.
      if (cachedQuote) {
        return response.ok(cachedQuote.data)
      }

      return response.badRequest('Failed to fetch a quote')
    }

    cachedQuote = {
      fetchedAt: Date.now(),
      data: quote
    }

    return response.ok(quote)
  })
