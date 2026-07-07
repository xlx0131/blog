const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

async function upsertProject(env, repo, category) {
  const repoName = repo.full_name
  const fullName = repo.full_name
  const description = repo.description || ''
  const language = repo.language || ''
  const stars = repo.stargazers_count
  const forks = repo.forks_count
  const watchers = repo.watchers_count
  const openIssues = repo.open_issues_count
  const topics = JSON.stringify(repo.topics || [])
  const homepage = repo.homepage || ''
  const url = repo.html_url
  const ownerLogin = repo.owner?.login || ''
  const ownerAvatar = repo.owner?.avatar_url || ''

  const existing = await env.DB.prepare(
    'SELECT id FROM github_projects WHERE repo_name = ?'
  ).bind(repoName).first()

  if (existing) {
    if (category === 'ai') {
      await env.DB.prepare(
        `UPDATE github_projects
         SET full_name = ?, description = ?, language = ?, stars = ?, forks = ?, watchers = ?, open_issues = ?, topics = ?, homepage = ?, html_url = ?, owner_login = ?, owner_avatar = ?, category = ?, updated_at = datetime('now')
         WHERE id = ?`
      ).bind(fullName, description, language, stars, forks, watchers, openIssues, topics, homepage, url, ownerLogin, ownerAvatar, category, existing.id).run()
    } else {
      await env.DB.prepare(
        `UPDATE github_projects
         SET full_name = ?, description = ?, language = ?, stars = ?, forks = ?, watchers = ?, open_issues = ?, topics = ?, homepage = ?, html_url = ?, owner_login = ?, owner_avatar = ?, updated_at = datetime('now')
         WHERE id = ?`
      ).bind(fullName, description, language, stars, forks, watchers, openIssues, topics, homepage, url, ownerLogin, ownerAvatar, existing.id).run()
    }
    return existing.id
  } else {
    const result = await env.DB.prepare(
      `INSERT INTO github_projects (repo_name, full_name, description, language, stars, forks, watchers, open_issues, topics, homepage, html_url, owner_login, owner_avatar, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING id`
    ).bind(repoName, fullName, description, language, stars, forks, watchers, openIssues, topics, homepage, url, ownerLogin, ownerAvatar, category).run()
    return result.results[0].id
  }
}

async function saveSnapshot(env, projectId, date, repo) {
  const existing = await env.DB.prepare(
    'SELECT id FROM github_daily_snapshots WHERE project_id = ? AND date = ?'
  ).bind(projectId, date).first()

  const stars = repo.stargazers_count
  const forks = repo.forks_count

  if (existing) {
    await env.DB.prepare(
      `UPDATE github_daily_snapshots
       SET stars = ?, forks = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).bind(stars, forks, existing.id).run()
  } else {
    await env.DB.prepare(
      `INSERT INTO github_daily_snapshots (project_id, date, stars, forks)
       VALUES (?, ?, ?, ?)`
    ).bind(projectId, date, stars, forks).run()
  }
}

async function fetchGitHubRepos(token, query, sort = 'stars', perPage = 50) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=desc&per_page=${perPage}`
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'blog-cron-worker',
  }
  if (token) {
    headers['Authorization'] = `token ${token}`
  }

  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  return data.items || []
}

async function fetchAndStoreProjects(env) {
  const token = env.GITHUB_TOKEN || ''
  const today = new Date().toISOString().split('T')[0]

  const stats = {
    total: { fetched: 0, upserted: 0 },
    ai: { fetched: 0, upserted: 0 },
    cleanedSnapshots: 0,
    date: today,
  }

  const totalRepos = await fetchGitHubRepos(token, 'stars:>1', 'stars', 50)
  stats.total.fetched = totalRepos.length

  for (let i = 0; i < totalRepos.length; i++) {
    const repo = totalRepos[i]
    const projectId = await upsertProject(env, repo, 'total')
    await saveSnapshot(env, projectId, today, repo)
    stats.total.upserted++
  }

  const aiRepos = await fetchGitHubRepos(token, 'topic:ai stars:>1', 'stars', 50)
  stats.ai.fetched = aiRepos.length

  for (let i = 0; i < aiRepos.length; i++) {
    const repo = aiRepos[i]
    const projectId = await upsertProject(env, repo, 'ai')
    await saveSnapshot(env, projectId, today, repo)
    stats.ai.upserted++
  }

  const deleteResult = await env.DB.prepare(
    "DELETE FROM github_daily_snapshots WHERE date < date('now', '-30 day')"
  ).run()
  stats.cleanedSnapshots = deleteResult.meta?.changes || 0

  return stats
}

export async function onRequest(context) {
  const { request, env } = context
  const method = request.method

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (method === 'GET') {
      const stats = await fetchAndStoreProjects(env)
      return Response.json({ success: true, data: stats }, { headers: corsHeaders })
    }

    return Response.json({ success: false, error: '不支持的请求方法' }, { status: 405, headers: corsHeaders })
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500, headers: corsHeaders })
  }
}

export async function scheduled(event, env, ctx) {
  ctx.waitUntil(fetchAndStoreProjects(env))
}
