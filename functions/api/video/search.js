import { SOURCES, getSource } from './_sources.js'

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)
  const method = request.method

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (method !== 'GET') {
      return Response.json(
        { success: false, error: '不支持的请求方法' },
        { status: 405, headers: corsHeaders }
      )
    }

    const wd = url.searchParams.get('wd')
    if (!wd) {
      return Response.json(
        { success: false, error: '缺少搜索关键字 wd' },
        { status: 400, headers: corsHeaders }
      )
    }

    const sourcesParam = url.searchParams.get('sources')
    let sourceKeys = []

    if (sourcesParam) {
      sourceKeys = sourcesParam.split(',').map(s => s.trim()).filter(Boolean)
    } else {
      sourceKeys = Object.keys(SOURCES).filter(key => SOURCES[key].enabled)
    }

    const validSources = sourceKeys.filter(key => {
      const config = getSource(key)
      return config && config.enabled
    })

    if (validSources.length === 0) {
      return Response.json(
        { success: false, error: '没有可用的资源站' },
        { status: 400, headers: corsHeaders }
      )
    }

    const searchPromises = validSources.map(async (sourceKey) => {
      try {
        const sourceConfig = getSource(sourceKey)
        const targetUrl = `${sourceConfig.baseUrl}?ac=list&wd=${encodeURIComponent(wd)}&pagesize=20`

        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Referer': sourceConfig.baseUrl,
          },
        })

        if (!response.ok) {
          return { source: sourceKey, list: [], error: `HTTP ${response.status}` }
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

    return Response.json(
      {
        success: true,
        data: {
          list: uniqueItems,
          total: uniqueItems.length,
          sources: sourceStats,
          keyword: wd,
        }
      },
      { headers: corsHeaders }
    )

  } catch (e) {
    return Response.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders }
    )
  }
}
