const API_BASE = '/api'

// ─── 文章管理 ───

export async function getArticles() {
  try {
    const res = await fetch(`${API_BASE}/articles`)
    const json = await res.json()
    return json.success ? json.data : []
  } catch { return [] }
}

export async function saveArticle(article) {
  const method = article.id ? 'PUT' : 'POST'
  try {
    const res = await fetch(`${API_BASE}/articles`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    })
    return await res.json()
  } catch (e) { return { success: false, error: e.message } }
}

export async function deleteArticle(id) {
  try {
    const res = await fetch(`${API_BASE}/articles?id=${id}`, { method: 'DELETE' })
    return await res.json()
  } catch (e) { return { success: false, error: e.message } }
}

// ─── 收藏夹管理 ───

export async function getBookmarkCats() {
  try {
    const res = await fetch(`${API_BASE}/bookmarks`)
    const json = await res.json()
    return json.success ? json.data : []
  } catch { return [] }
}

export async function saveBookmarkCats(cats) {
  // 这个方法不再需要，因为 API 支持逐条增删
  // 保留作为兼容
}

export async function addBookmark(item) {
  try {
    const res = await fetch(`${API_BASE}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    return await res.json()
  } catch (e) { return { success: false, error: e.message } }
}

export async function updateBookmark(item) {
  try {
    const res = await fetch(`${API_BASE}/bookmarks`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    return await res.json()
  } catch (e) { return { success: false, error: e.message } }
}

export async function deleteBookmark(id, type = 'bookmark') {
  try {
    const res = await fetch(`${API_BASE}/bookmarks?id=${id}&type=${type}`, { method: 'DELETE' })
    return await res.json()
  } catch (e) { return { success: false, error: e.message } }
}
