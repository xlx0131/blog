export async function onRequest(context) {
  const { request, env, params } = context
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
      const id = params.id
      if (!id) {
        return Response.json(
          { success: false, error: '缺少项目 id' },
          { status: 400, headers: corsHeaders }
        )
      }

      const project = await env.DB.prepare(
        `SELECT id, repo_name, full_name, description, language, stars, forks, watchers,
                open_issues, topics, html_url, homepage, owner_avatar, owner_login,
                readme, category, created_at, updated_at
         FROM github_projects
         WHERE id = ?`
      ).bind(Number(id)).first()

      if (!project) {
        return Response.json(
          { success: false, error: '项目不存在' },
          { status: 404, headers: corsHeaders }
        )
      }

      const data = {
        ...project,
        topics: project.topics ? JSON.parse(project.topics) : []
      }

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
