const KEYS = {
  articles: 'blog_admin_articles',
  bookmarks: 'blog_admin_bookmarks',
}

export function getArticles() {
  try { return JSON.parse(localStorage.getItem(KEYS.articles) || '[]') }
  catch { return [] }
}

export function saveArticle(article) {
  const list = getArticles()
  const idx = list.findIndex(a => a.id === article.id)
  if (idx >= 0) { list[idx] = article }
  else { list.unshift(article) }
  localStorage.setItem(KEYS.articles, JSON.stringify(list))
}

export function deleteArticle(id) {
  const list = getArticles().filter(a => a.id !== id)
  localStorage.setItem(KEYS.articles, JSON.stringify(list))
}

export function getBookmarkCats() {
  try { return JSON.parse(localStorage.getItem(KEYS.bookmarks) || '[]') }
  catch { return [] }
}

export function saveBookmarkCats(cats) {
  localStorage.setItem(KEYS.bookmarks, JSON.stringify(cats))
}
