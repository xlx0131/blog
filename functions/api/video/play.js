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

  // Mode 2: Proxy a segment (.ts, .m3u8, etc.)
  if (host && path) {
    return proxySegment(host, path, request)
  }

  // Mode 1: Fetch video URL
  const videoUrl = url.searchParams.get('url')
  if (!videoUrl) {
    return jsonError('缺少 url 参数', 400)
  }

  try {
    const decodedUrl = decodeURIComponent(videoUrl)
    const origin = new URL(decodedUrl).origin

    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': UA,
        'Accept': '*/*',
        'Referer': origin + '/',
      },
    })

    const contentType = response.headers.get('content-type') || ''

    // HTML response — likely a CDN player page or challenge page
    if (contentType.includes('text/html')) {
      const html = await response.text()
      return handlePlayerPage(html, decodedUrl)
    }

    // Not HTML — proxy directly (mp4, ts, m3u8 playlist, etc.)
    return proxyDirect(response)
  } catch (e) {
    return jsonError('CDN 请求失败: ' + e.message)
  }
}

// Parse CDN player page HTML → extract m3u8 → proxy playlist with rewritten segments
async function handlePlayerPage(html, pageUrl) {
  // Try to extract m3u8 URL from: const url = "/path/to/index.m3u8?sign=xxx"
  const match = html.match(/const url = "([^"]+)"/)
  if (!match) {
    // Could be a Cloudflare challenge page or blocked request
    if (html.includes('Checking your browser') || html.includes('cf-browser-verification')) {
      return jsonError('CDN 防爬虫验证拦截，请尝试切换播放源')
    }
    return jsonError('无法解析视频地址，请尝试切换播放源')
  }

  try {
    const cdnHost = new URL(pageUrl).origin
    const m3u8Path = match[1]
    const m3u8Url = cdnHost + m3u8Path

    // Fetch the m3u8 playlist
    const m3u8Res = await fetch(m3u8Url, {
      headers: { 'User-Agent': UA, 'Referer': cdnHost + '/', 'Accept': '*/*' },
    })
    if (!m3u8Res.ok) {
      return jsonError('获取视频流失败 (m3u8)')
    }

    const m3u8Text = await m3u8Res.text()

    // Rewrite segment URLs to go through our proxy
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
    return jsonError('处理视频流失败: ' + e.message)
  }
}

// Proxy segment files (.ts, .m3u8, etc.)
async function proxySegment(cdnHost, segmentPath, request) {
  try {
    const targetUrl = cdnHost + segmentPath
    const headers = {
      'User-Agent': UA,
      'Referer': cdnHost + '/',
      'Accept': '*/*',
    }
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
    return jsonError('片段加载失败: ' + e.message)
  }
}

// Proxy a direct video file
function proxyDirect(response) {
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
}

function jsonError(msg, status = 500) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}
