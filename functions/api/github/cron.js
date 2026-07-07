const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const FUN_KEYWORDS = ['fun', 'awesome', 'cool', 'playground', 'game', 'games', 'art', 'creative', 'interesting', 'meme', 'toy']

function getDate30DaysAgo() {
  const date = new Date()
  date.setDate(date.getDate() - 30)
  return date.toISOString().split('T')[0]
}

function isFunProject(topics) {
  if (!topics || !Array.isArray(topics)) return 0
  const lowerTopics = topics.map(t => t.toLowerCase())
  return FUN_KEYWORDS.some(keyword => lowerTopics.includes(keyword)) ? 1 : 0
}

async function fetchReadme(token, owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/readme`
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'blog-cron-worker',
  }
  if (token) {
    headers['Authorization'] = `token ${token}`
  }

  try {
    const response = await fetch(url, { headers })
    if (!response.ok) {
      return ''
    }
    const data = await response.json()
    if (data.content) {
      const decoded = atob(data.content)
      return decoded.slice(0, 5000)
    }
    return ''
  } catch (e) {
    return ''
  }
}

async function upsertProject(env, repo, category, token) {
  const repoName = repo.full_name
  const fullName = repo.full_name
  const description = repo.description || ''
  const language = repo.language || ''
  const stars = repo.stargazers_count
  const forks = repo.forks_count
  const watchers = repo.watchers_count
  const openIssues = repo.open_issues_count
  const topics = repo.topics || []
  const topicsStr = JSON.stringify(topics)
  const homepage = repo.homepage || ''
  const url = repo.html_url
  const ownerLogin = repo.owner?.login || ''
  const ownerAvatar = repo.owner?.avatar_url || ''
  const isFun = isFunProject(topics)

  const existing = await env.DB.prepare(
    'SELECT id, description FROM github_projects WHERE repo_name = ?'
  ).bind(repoName).first()

  if (existing) {
    const descriptionChanged = existing.description !== description
    let readme = null

    if (descriptionChanged) {
      readme = await fetchReadme(token, ownerLogin, repo.name)
    }

    if (category === 'ai' || category === 'growth') {
      if (readme !== null) {
        await env.DB.prepare(
          `UPDATE github_projects
           SET full_name = ?, description = ?, language = ?, stars = ?, forks = ?, watchers = ?, open_issues = ?, topics = ?, homepage = ?, html_url = ?, owner_login = ?, owner_avatar = ?, category = ?, is_fun = ?, readme = ?, updated_at = datetime('now')
           WHERE id = ?`
        ).bind(fullName, description, language, stars, forks, watchers, openIssues, topicsStr, homepage, url, ownerLogin, ownerAvatar, category, isFun, readme, existing.id).run()
      } else {
        await env.DB.prepare(
          `UPDATE github_projects
           SET full_name = ?, description = ?, language = ?, stars = ?, forks = ?, watchers = ?, open_issues = ?, topics = ?, homepage = ?, html_url = ?, owner_login = ?, owner_avatar = ?, category = ?, is_fun = ?, updated_at = datetime('now')
           WHERE id = ?`
        ).bind(fullName, description, language, stars, forks, watchers, openIssues, topicsStr, homepage, url, ownerLogin, ownerAvatar, category, isFun, existing.id).run()
      }
    } else {
      if (readme !== null) {
        await env.DB.prepare(
          `UPDATE github_projects
           SET full_name = ?, description = ?, language = ?, stars = ?, forks = ?, watchers = ?, open_issues = ?, topics = ?, homepage = ?, html_url = ?, owner_login = ?, owner_avatar = ?, is_fun = ?, readme = ?, updated_at = datetime('now')
           WHERE id = ?`
        ).bind(fullName, description, language, stars, forks, watchers, openIssues, topicsStr, homepage, url, ownerLogin, ownerAvatar, isFun, readme, existing.id).run()
      } else {
        await env.DB.prepare(
          `UPDATE github_projects
           SET full_name = ?, description = ?, language = ?, stars = ?, forks = ?, watchers = ?, open_issues = ?, topics = ?, homepage = ?, html_url = ?, owner_login = ?, owner_avatar = ?, is_fun = ?, updated_at = datetime('now')
           WHERE id = ?`
        ).bind(fullName, description, language, stars, forks, watchers, openIssues, topicsStr, homepage, url, ownerLogin, ownerAvatar, isFun, existing.id).run()
      }
    }
    return existing.id
  } else {
    const readme = await fetchReadme(token, ownerLogin, repo.name)
    const result = await env.DB.prepare(
      `INSERT INTO github_projects (repo_name, full_name, description, language, stars, forks, watchers, open_issues, topics, homepage, html_url, owner_login, owner_avatar, category, is_fun, readme)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING id`
    ).bind(repoName, fullName, description, language, stars, forks, watchers, openIssues, topicsStr, homepage, url, ownerLogin, ownerAvatar, category, isFun, readme).run()
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
  const date30DaysAgo = getDate30DaysAgo()

  const stats = {
    total: { fetched: 0, upserted: 0 },
    ai: { fetched: 0, upserted: 0 },
    growth: { fetched: 0, upserted: 0 },
    cleanedSnapshots: 0,
    date: today,
  }

  const totalRepos = await fetchGitHubRepos(token, 'stars:>1', 'stars', 50)
  stats.total.fetched = totalRepos.length

  for (let i = 0; i < totalRepos.length; i++) {
    const repo = totalRepos[i]
    const projectId = await upsertProject(env, repo, 'total', token)
    await saveSnapshot(env, projectId, today, repo)
    stats.total.upserted++
  }

  const aiRepos = await fetchGitHubRepos(token, 'topic:ai stars:>1', 'stars', 50)
  stats.ai.fetched = aiRepos.length

  for (let i = 0; i < aiRepos.length; i++) {
    const repo = aiRepos[i]
    const projectId = await upsertProject(env, repo, 'ai', token)
    await saveSnapshot(env, projectId, today, repo)
    stats.ai.upserted++
  }

  const growthRepos = await fetchGitHubRepos(token, `stars:>1000 created:>${date30DaysAgo}`, 'stars', 30)
  stats.growth.fetched = growthRepos.length

  for (let i = 0; i < growthRepos.length; i++) {
    const repo = growthRepos[i]
    const projectId = await upsertProject(env, repo, 'growth', token)
    await saveSnapshot(env, projectId, today, repo)
    stats.growth.upserted++
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
