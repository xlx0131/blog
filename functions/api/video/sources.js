import { getEnabledSources } from './_sources.js'

export async function onRequest(context) {
  const { request } = context
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

    const sources = getEnabledSources()

    return Response.json(
      { success: true, data: sources },
      { headers: corsHeaders }
    )

  } catch (e) {
    return Response.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders }
    )
  }
}
