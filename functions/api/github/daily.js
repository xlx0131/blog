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
      const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0]
      const category = url.searchParams.get('category') || 'total'
      let limit = parseInt(url.searchParams.get('limit')) || 20
      if (limit > 100) limit = 100
      if (limit < 1) limit = 1

      const validCategories = ['total', 'growth', 'ai', 'fun']
      if (!validCategories.includes(category)) {
        return Response.json(
          { success: false, error: '无效的 category 参数' },
          { status: 400, headers: corsHeaders }
        )
      }

      const yesterday = new Date(date)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      let results = []
      let statsQuery = ''
      let statsParams = []

      if (category === 'fun') {
        const { results: rows } = await env.DB.prepare(
          `SELECT p.id, p.repo_name, p.full_name, p.description, p.language, p.stars, p.forks,
                  p.watchers, p.open_issues, p.topics, p.html_url, p.homepage, p.owner_avatar,
                  p.owner_login, p.category, p.is_fun, p.created_at, p.updated_at,
                  s_today.stars as today_stars,
                  COALESCE(s_today.stars - s_yesterday.stars, 0) as daily_growth
           FROM github_projects p
           INNER JOIN github_daily_snapshots s_today ON p.id = s_today.project_id
           LEFT JOIN github_daily_snapshots s_yesterday ON p.id = s_yesterday.project_id AND s_yesterday.date = ?
           WHERE s_today.date = ?
             AND p.is_fun = 1
           ORDER BY p.stars DESC
           LIMIT ?`
        ).bind(yesterdayStr, date, limit).all()
        results = rows
      } else if (category === 'growth') {
        const { results: rows } = await env.DB.prepare(
          `SELECT p.id, p.repo_name, p.full_name, p.description, p.language, p.stars, p.forks,
                  p.watchers, p.open_issues, p.topics, p.html_url, p.homepage, p.owner_avatar,
                  p.owner_login, p.category, p.is_fun, p.created_at, p.updated_at,
                  s_today.stars as today_stars,
                  COALESCE(s_today.stars - s_yesterday.stars, 0) as daily_growth
           FROM github_projects p
           INNER JOIN github_daily_snapshots s_today ON p.id = s_today.project_id
           LEFT JOIN github_daily_snapshots s_yesterday ON p.id = s_yesterday.project_id AND s_yesterday.date = ?
           WHERE s_today.date = ?
             AND p.category = ?
           ORDER BY (CASE WHEN s_yesterday.stars IS NOT NULL THEN s_today.stars - s_yesterday.stars ELSE p.stars END) DESC
           LIMIT ?`
        ).bind(yesterdayStr, date, category, limit).all()
        results = rows
      } else {
        const { results: rows } = await env.DB.prepare(
          `SELECT p.id, p.repo_name, p.full_name, p.description, p.language, p.stars, p.forks,
                  p.watchers, p.open_issues, p.topics, p.html_url, p.homepage, p.owner_avatar,
                  p.owner_login, p.category, p.is_fun, p.created_at, p.updated_at,
                  s_today.stars as today_stars,
                  COALESCE(s_today.stars - s_yesterday.stars, 0) as daily_growth
           FROM github_projects p
           INNER JOIN github_daily_snapshots s_today ON p.id = s_today.project_id
           LEFT JOIN github_daily_snapshots s_yesterday ON p.id = s_yesterday.project_id AND s_yesterday.date = ?
           WHERE s_today.date = ?
             AND p.category = ?
           ORDER BY p.stars DESC
           LIMIT ?`
        ).bind(yesterdayStr, date, category, limit).all()
        results = rows
      }

      const statsResult = await env.DB.prepare(
        `SELECT
           COUNT(*) as total_count,
           SUM(CASE WHEN p.category = 'ai' THEN 1 ELSE 0 END) as ai_count,
           SUM(CASE WHEN p.is_fun = 1 THEN 1 ELSE 0 END) as fun_count
         FROM github_projects p
         INNER JOIN github_daily_snapshots s ON p.id = s.project_id
         WHERE s.date = ?`
      ).bind(date).first()

      const data = results.map(item => ({
        ...item,
        topics: item.topics ? JSON.parse(item.topics) : [],
        stars: item.today_stars !== undefined ? item.today_stars : item.stars,
      }))

      const stats = {
        total: statsResult?.total_count || 0,
        ai: statsResult?.ai_count || 0,
        fun: statsResult?.fun_count || 0,
      }

      return Response.json({ success: true, data, stats }, { headers: corsHeaders })
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
