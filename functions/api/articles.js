export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const method = request.method

  // CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // GET /api/articles — 获取所有文章
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM articles ORDER BY date DESC'
      ).all()
      return Response.json({ success: true, data: results }, { headers: corsHeaders })
    }

    const body = await request.json()

    // POST /api/articles — 新建文章
    if (method === 'POST') {
      if (!body.title) {
        return Response.json({ success: false, error: '标题不能为空' }, { status: 400, headers: corsHeaders })
      }
      const { results } = await env.DB.prepare(
        `INSERT INTO articles (title, content, excerpt, date, category, tags, slug)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         RETURNING *`
      ).bind(
        body.title,
        body.content || '',
        body.excerpt || '',
        body.date || new Date().toISOString().split('T')[0],
        body.category || '技术',
        JSON.stringify(body.tags || []),
        body.slug || ''
      ).run()
      return Response.json({ success: true, data: results[0] }, { headers: corsHeaders })
    }

    // PUT /api/articles — 更新文章
    if (method === 'PUT') {
      const { results } = await env.DB.prepare(
        `UPDATE articles SET title=?, content=?, excerpt=?, date=?, category=?, tags=?, slug=?, updated_at=datetime('now')
         WHERE id=? RETURNING *`
      ).bind(
        body.title, body.content || '', body.excerpt || '',
        body.date, body.category || '技术',
        JSON.stringify(body.tags || []), body.slug || '',
        body.id
      ).run()
      return Response.json({ success: true, data: results[0] }, { headers: corsHeaders })
    }

    // DELETE /api/articles?id=xxx — 删除文章
    if (method === 'DELETE') {
      const id = url.searchParams.get('id')
      if (!id) {
        return Response.json({ success: false, error: '缺少 id 参数' }, { status: 400, headers: corsHeaders })
      }
      await env.DB.prepare('DELETE FROM articles WHERE id = ?').bind(Number(id)).run()
      return Response.json({ success: true }, { headers: corsHeaders })
    }

    return Response.json({ success: false, error: '不支持的请求方法' }, { status: 405, headers: corsHeaders })

  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500, headers: corsHeaders })
  }
}
