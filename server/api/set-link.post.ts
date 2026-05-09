import { LinkSchema } from '#shared/schemas/link'

defineRouteMeta({
  openAPI: {
    description: 'Create a short link using the ue.lc compatible public API',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['link'],
            properties: {
              link: { type: 'string', description: 'The target URL' },
              slug: { type: 'string', description: 'Custom slug' },
              ttl: { type: 'integer', description: 'Optional TTL in seconds' },
            },
          },
        },
      },
    },
  },
})

export default eventHandler(async (event) => {
  const body = await readBody<{
    link?: string
    url?: string
    slug?: string
    ttl?: number
  }>(event)

  const expiration = typeof body.ttl === 'number' && body.ttl > 0
    ? Math.floor(Date.now() / 1000) + body.ttl
    : undefined

  const link = await LinkSchema.parseAsync({
    url: body.link || body.url,
    slug: body.slug || undefined,
    expiration,
  })

  link.slug = normalizeSlug(event, link.slug)

  if (link.unsafe === undefined) {
    const safe = await isSafeUrl(event, link.url)
    if (!safe) {
      link.unsafe = true
    }
  }

  const existingLink = await getLink(event, link.slug)
  if (existingLink) {
    throw createError({
      status: 409,
      statusMessage: 'Link already exists',
      data: {
        error: 'Link already exists',
      },
    })
  }

  await putLink(event, link)

  const shortUrl = buildShortLink(event, link.slug)
  return {
    id: link.slug,
    shortUrl,
    link,
  }
})
