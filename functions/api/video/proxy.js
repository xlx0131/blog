const SOURCES = {
  heimuer: {
    name: '黑木耳',
    baseUrl: 'https://www.heimuer.tv/api.php/provide/vod',
    enabled: true,
    description: '高清影视资源站，更新速度快',
  },
  ffzy: {
    name: '非凡资源',
    baseUrl: 'https://api.ffzyapi.com/api.php/provide/vod',
    enabled: true,
    description: '海量影视资源，种类齐全',
  },
  subo: {
    name: '速播资源',
    baseUrl: 'https://www.suboziyuan.net/api.php/provide/vod',
    enabled: true,
    description: '快速稳定的影视资源站',
  },
  kuaikan: {
    name: '快看资源',
    baseUrl: 'https://www.kuaikanzy.net/api.php/provide/vod',
    enabled: true,
    description: '热门剧集每日更新',
  },
  okzyw: {
    name: 'OK资源网',
    baseUrl: 'https://okzyw.vip/api.php/provide/vod',
    enabled: true,
    description: '优质高清影视资源',
  },
  ikun: {
    name: 'ikun播',
    baseUrl: 'https://ikunbo.com/api.php/provide/vod',
    enabled: true,
    description: '高清流畅影视资源',
  },
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS,
  })
}

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  if (request.method !== 'GET') {
    return json({ success: false, error: '不支持的请求方法' }, 405)
  }

  try {
    const source = url.searchParams.get('source')
    const apiPath = url.searchParams.get('path') || 'list'

    if (!source) {
      return json({ success: false, error: '缺少 source 参数' }, 400)
    }

    const sourceConfig = SOURCES[source]
    if (!sourceConfig) {
      return json({ success: false, error: '资源站不存在' }, 404)
    }

    if (!sourceConfig.enabled) {
      return json({ success: false, error: '资源站已禁用' }, 403)
    }

    const params = new URLSearchParams(url.searchParams)
    params.delete('source')
    params.delete('path')
    const queryString = params.toString()

    const targetUrl = sourceConfig.baseUrl + '/' + apiPath + (queryString ? '?' + queryString : '')

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': sourceConfig.baseUrl,
      },
      cf: {
        cacheTtl: 300,
        cacheEverything: true,
      },
    })

    if (!response.ok) {
      return json({ success: false, error: '上游请求失败: ' + response.status }, response.status)
    }

    const data = await response.json()

    return json({ success: true, data })

  } catch (e) {
    return json({ success: false, error: e.message || '服务器错误' }, 500)
  }
}
