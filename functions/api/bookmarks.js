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
    // GET /api/bookmarks — 获取全部分类+收藏
    if (method === 'GET') {
      const { results: cats } = await env.DB.prepare(
        'SELECT * FROM bookmark_categories ORDER BY sort_order'
      ).all()
      const { results: items } = await env.DB.prepare(
        'SELECT * FROM bookmarks ORDER BY sort_order'
      ).all()

      const grouped = cats.map(cat => ({
        name: cat.name,
        items: items.filter(i => i.category_id === cat.id).map(i => ({
          id: i.id, name: i.name, url: i.url, desc: i.desc, category: cat.name,
        })),
      }))
      return Response.json({ success: true, data: grouped }, { headers: corsHeaders })
    }

    const body = await request.json()

    // POST /api/bookmarks — 新建分类或收藏
    if (method === 'POST') {
      if (body.type === 'category') {
        const { results } = await env.DB.prepare(
          'INSERT INTO bookmark_categories (name, sort_order) VALUES (?, ?) RETURNING *'
        ).bind(body.name, body.sort_order || 0).run()
        return Response.json({ success: true, data: results[0] }, { headers: corsHeaders })
      }

      if (!body.category_id) {
        // 按分类名查找
        const cat = await env.DB.prepare(
          'SELECT id FROM bookmark_categories WHERE name = ?'
        ).bind(body.category).first()
        if (!cat) {
          return Response.json({ success: false, error: '分类不存在' }, { status: 400, headers: corsHeaders })
        }
        body.category_id = cat.id
      }

      const { results } = await env.DB.prepare(
        `INSERT INTO bookmarks (category_id, name, url, desc, sort_order)
         VALUES (?, ?, ?, ?, ?) RETURNING *`
      ).bind(body.category_id, body.name, body.url, body.desc || '', body.sort_order || 0).run()
      return Response.json({ success: true, data: results[0] }, { headers: corsHeaders })
    }

    // PUT /api/bookmarks — 更新收藏
    if (method === 'PUT') {
      if (body.type === 'category') {
        await env.DB.prepare(
          'UPDATE bookmark_categories SET name = ? WHERE id = ?'
        ).bind(body.name, body.id).run()
        return Response.json({ success: true }, { headers: corsHeaders })
      }
      await env.DB.prepare(
        'UPDATE bookmarks SET name=?, url=?, desc=? WHERE id=?'
      ).bind(body.name, body.url, body.desc || '', body.id).run()
      return Response.json({ success: true }, { headers: corsHeaders })
    }

    // DELETE /api/bookmarks — 删除收藏或分类
    if (method === 'DELETE') {
      const id = url.searchParams.get('id')
      const type = url.searchParams.get('type') || 'bookmark'
      if (!id) {
        return Response.json({ success: false, error: '缺少 id' }, { status: 400, headers: corsHeaders })
      }
      if (type === 'category') {
        await env.DB.prepare('DELETE FROM bookmarks WHERE category_id = ?').bind(Number(id)).run()
        await env.DB.prepare('DELETE FROM bookmark_categories WHERE id = ?').bind(Number(id)).run()
      } else {
        await env.DB.prepare('DELETE FROM bookmarks WHERE id = ?').bind(Number(id)).run()
      }
      return Response.json({ success: true }, { headers: corsHeaders })
    }

    return Response.json({ success: false, error: '不支持的请求方法' }, { status: 405, headers: corsHeaders })

  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500, headers: corsHeaders })
  }
}
