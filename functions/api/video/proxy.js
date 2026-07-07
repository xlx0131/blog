import { getSource } from './_sources.js'

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

    const source = url.searchParams.get('source') || url.pathname.split('/').pop()
    const apiPath = url.searchParams.get('path') || 'list'
    const sourceParam = url.searchParams.get('source')

    let finalSource = sourceParam
    if (!finalSource) {
      const match = url.pathname.match(/\/api\/video\/([^/]+)/)
      if (match) finalSource = match[1]
    }

    if (!finalSource) {
      return Response.json(
        { success: false, error: '缺少 source 参数' },
        { status: 400, headers: corsHeaders }
      )
    }

    const sourceConfig = getSource(finalSource)
    if (!sourceConfig) {
      return Response.json(
        { success: false, error: '资源站不存在' },
        { status: 404, headers: corsHeaders }
      )
    }

    if (!sourceConfig.enabled) {
      return Response.json(
        { success: false, error: '资源站已禁用' },
        { status: 403, headers: corsHeaders }
      )
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
    })

    const contentType = response.headers.get('content-type') || ''
    const responseHeaders = {
      ...corsHeaders,
      'Content-Type': contentType.includes('json') ? 'application/json; charset=utf-8' : contentType,
    }

    if (!response.ok) {
      return Response.json(
        { success: false, error: `上游请求失败: ${response.status}` },
        { status: response.status, headers: corsHeaders }
      )
    }

    const data = await response.json()

    return Response.json(
      { success: true, data },
      { headers: corsHeaders }
    )

  } catch (e) {
    return Response.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders }
    )
  }
}
