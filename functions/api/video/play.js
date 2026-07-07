const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Range',
}

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  const host = url.searchParams.get('host')
  const path = url.searchParams.get('path')

  // Mode 2: Proxy a segment (e.g. .ts file)
  if (host && path) {
    return proxySegment(host, path, request)
  }

  // Mode 1: Fetch video URL (may return HTML player page or direct video)
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
      'User-Agent': UA,
      'Accept': '*/*',
      'Referer': new URL(decodedUrl).origin + '/',
    }

    const response = await fetch(decodedUrl, { headers })
    const contentType = response.headers.get('content-type') || ''

    // If it's HTML (CDN player page), extract m3u8 URL
    if (contentType.includes('text/html')) {
      const html = await response.text()
      return handlePlayerPage(html, decodedUrl)
    }

    // Direct video file - proxy as-is
    const resHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Accept-Ranges': 'bytes',
    }
    const ct = response.headers.get('content-type')
    if (ct) resHeaders['Content-Type'] = ct
    const cl = response.headers.get('content-length')
    if (cl) resHeaders['Content-Length'] = cl
    if (response.headers.get('content-range')) {
      resHeaders['Content-Range'] = response.headers.get('content-range')
    }
    return new Response(response.body, { status: response.status, headers: resHeaders })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }
}

// Parse the CDN player page HTML to find the m3u8 URL, then proxy the m3u8
async function handlePlayerPage(html, pageUrl) {
  try {
    // Extract m3u8 URL from: const url = "/20221102/xxx/index.m3u8?sign=xxx"
    const match = html.match(/const url = "([^"]+)"/)
    if (!match) {
      return new Response('无法解析视频地址', {
        status: 500,
        headers: { 'Content-Type': 'text/plain', ...CORS_HEADERS },
      })
    }

    const cdnHost = new URL(pageUrl).origin
    const m3u8Path = match[1]
    const m3u8Url = cdnHost + m3u8Path

    // Fetch the m3u8 playlist
    const headers = {
      'User-Agent': UA,
      'Referer': cdnHost + '/',
      'Accept': '*/*',
    }

    const m3u8Res = await fetch(m3u8Url, { headers })
    if (!m3u8Res.ok) {
      return new Response('获取 m3u8 失败', {
        status: 500,
        headers: { 'Content-Type': 'text/plain', ...CORS_HEADERS },
      })
    }

    const m3u8Text = await m3u8Res.text()

    // Rewrite segment (.ts) URLs to go through our proxy
    const basePath = m3u8Path.substring(0, m3u8Path.lastIndexOf('/'))
    const rewritten = m3u8Text.replace(/^([^#\s].+\.(ts|m3u8|m4s|mp4)(\?[^\s]*)?)$/gm, (line) => {
      const segmentPath = line.startsWith('/') ? line : basePath + '/' + line
      return `/api/video/play?host=${encodeURIComponent(cdnHost)}&path=${encodeURIComponent(segmentPath)}`
    })

    return new Response(rewritten, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }
}

// Proxy a segment file (.ts, .m3u8, etc.)
async function proxySegment(cdnHost, segmentPath, request) {
  try {
    const targetUrl = cdnHost + segmentPath
    const headers = {
      'User-Agent': UA,
      'Referer': cdnHost + '/',
      'Accept': '*/*',
    }

    // Pass through Range header for seeking support
    if (request.headers.get('Range')) {
      headers['Range'] = request.headers.get('Range')
    }

    const response = await fetch(targetUrl, { headers })
    const resHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
      'Accept-Ranges': 'bytes',
    }

    const ct = response.headers.get('content-type')
    if (ct) resHeaders['Content-Type'] = ct
    const cl = response.headers.get('content-length')
    if (cl) resHeaders['Content-Length'] = cl
    if (response.headers.get('content-range')) {
      resHeaders['Content-Range'] = response.headers.get('content-range')
    }

    return new Response(response.body, {
      status: response.status,
      headers: resHeaders,
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }
}
