const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Range',
}

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  const videoUrl = url.searchParams.get('url')
  if (!videoUrl) {
    return new Response(JSON.stringify({ error: '缺少 url 参数' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  try {
    const decodedUrl = decodeURIComponent(videoUrl)

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Referer': decodedUrl.replace(/\/[^/]+$/, '/'),
    }

    if (request.headers.get('Range')) {
      headers['Range'] = request.headers.get('Range')
    }

    const response = await fetch(decodedUrl, { headers })

    const responseHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Accept-Ranges': 'bytes',
    }

    const contentType = response.headers.get('content-type')
    if (contentType) responseHeaders['Content-Type'] = contentType

    const contentLength = response.headers.get('content-length')
    if (contentLength) responseHeaders['Content-Length'] = contentLength

    if (response.headers.get('content-range')) {
      responseHeaders['Content-Range'] = response.headers.get('content-range')
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    })

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }
}
