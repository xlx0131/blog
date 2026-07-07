const SOURCES = {
  ffzy: {
    name: '非凡资源',
    baseUrl: 'https://api.ffzyapi.com/api.php/provide/vod',
    enabled: true,
    description: '海量影视资源（9.7万+部）',
  },
  subo: {
    name: '速播资源',
    baseUrl: 'https://www.suboziyuan.net/api.php/provide/vod',
    enabled: true,
    description: '快速稳定的影视资源站',
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
    const wd = url.searchParams.get('wd')
    if (!wd) {
      return json({ success: false, error: '缺少搜索关键字 wd' }, 400)
    }

    const sourcesParam = url.searchParams.get('sources')
    let sourceKeys = []

    if (sourcesParam) {
      sourceKeys = sourcesParam.split(',').map(s => s.trim()).filter(Boolean)
    } else {
      sourceKeys = Object.keys(SOURCES).filter(key => SOURCES[key].enabled)
    }

    const validSources = sourceKeys.filter(key => {
      const config = SOURCES[key]
      return config && config.enabled
    })

    if (validSources.length === 0) {
      return json({ success: false, error: '没有可用的资源站' }, 400)
    }

    const searchPromises = validSources.map(async (sourceKey) => {
      try {
        const sourceConfig = SOURCES[sourceKey]
        const targetUrl = sourceConfig.baseUrl + '?ac=list&wd=' + encodeURIComponent(wd) + '&pagesize=20'

        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Referer': sourceConfig.baseUrl,
          },
        })

        if (!response.ok) {
          return { source: sourceKey, list: [], error: 'HTTP ' + response.status }
        }

        const data = await response.json()
        const list = (data.list || []).map(item => ({
          ...item,
          _source: sourceKey,
          _sourceName: sourceConfig.name,
        }))

        return { source: sourceKey, list, error: null }
      } catch (e) {
        return { source: sourceKey, list: [], error: e.message }
      }
    })

    const results = await Promise.allSettled(searchPromises)

    const allItems = []
    const sourceStats = {}

    results.forEach((result, index) => {
      const sourceKey = validSources[index]
      if (result.status === 'fulfilled') {
        const { list, error } = result.value
        sourceStats[sourceKey] = {
          success: !error,
          count: list.length,
          error: error || null,
        }
        allItems.push(...list)
      } else {
        sourceStats[sourceKey] = {
          success: false,
          count: 0,
          error: result.reason.message,
        }
      }
    })

    const seen = new Set()
    const uniqueItems = []

    for (const item of allItems) {
      const name = item.vod_name?.trim()
      if (name && !seen.has(name)) {
        seen.add(name)
        uniqueItems.push(item)
      }
    }

    return json({
      success: true,
      data: {
        list: uniqueItems,
        total: uniqueItems.length,
        sources: sourceStats,
        keyword: wd,
      }
    })

  } catch (e) {
    return json({ success: false, error: e.message || '服务器错误' }, 500)
  }
}
