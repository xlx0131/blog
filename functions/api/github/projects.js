export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
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
      const type = url.searchParams.get('type') || 'total'
      let limit = parseInt(url.searchParams.get('limit')) || 10
      if (limit > 50) limit = 50
      if (limit < 1) limit = 1

      let results = []

      if (type === 'total') {
        const { results: rows } = await env.DB.prepare(
          `SELECT id, repo_name, full_name, description, language, stars, forks, topics, url as html_url, owner_avatar, owner_login
           FROM github_projects
           ORDER BY stars DESC
           LIMIT ?`
        ).bind(limit).all()
        results = rows
      } else if (type === 'ai') {
        const { results: rows } = await env.DB.prepare(
          `SELECT id, repo_name, full_name, description, language, stars, forks, topics, url as html_url, owner_avatar, owner_login
           FROM github_projects
           WHERE category = 'ai'
           ORDER BY stars DESC
           LIMIT ?`
        ).bind(limit).all()
        results = rows
      } else if (type === 'daily') {
        const { results: rows } = await env.DB.prepare(
          `SELECT p.id, p.repo_name, p.full_name, p.description, p.language, p.stars, p.forks,
                  (s_today.stars - s_yesterday.stars) as daily_growth,
                  p.topics, p.url as html_url, p.owner_avatar, p.owner_login
           FROM github_projects p
           JOIN github_daily_snapshots s_today ON p.id = s_today.project_id
           JOIN github_daily_snapshots s_yesterday ON p.id = s_yesterday.project_id
           WHERE s_today.date = date('now')
             AND s_yesterday.date = date('now', '-1 day')
             AND (s_today.stars - s_yesterday.stars) > 0
           ORDER BY daily_growth DESC
           LIMIT ?`
        ).bind(limit).all()
        results = rows
      } else {
        return Response.json(
          { success: false, error: '无效的 type 参数' },
          { status: 400, headers: corsHeaders }
        )
      }

      const data = results.map(item => ({
        ...item,
        topics: item.topics ? JSON.parse(item.topics) : []
      }))

      return Response.json({ success: true, data }, { headers: corsHeaders })
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
