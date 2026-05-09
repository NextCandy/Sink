export default eventHandler((event) => {
  if (event.path === '/api/set-link') {
    setHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
    })
  }

  if (event.method === 'OPTIONS') {
    return
  }

  if (event.path === '/api/set-link') {
    return
  }

  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')
  if (event.path.startsWith('/api/') && token !== useRuntimeConfig(event).siteToken) {
    throw createError({
      status: 401,
      statusText: 'Unauthorized',
    })
  }
  if (token && token.length < 8) {
    throw createError({
      status: 401,
      statusText: 'Token is too short',
    })
  }
})
