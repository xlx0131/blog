export async function onRequest(context) {
  const { request, env } = context
  const method = request.method

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM ai_skills ORDER BY sort_order ASC, id DESC'
      ).all()

      return Response.json({ success: true, data: results }, { headers: corsHeaders })
    }

    return Response.json(
      { success: false, error: '不支持的请求方法' },
      { status: 405, headers: corsHeaders }
    )

  } catch (e) {
    return Response.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders }
    )
  }
}
