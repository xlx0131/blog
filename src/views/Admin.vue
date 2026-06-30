<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { levels } from '@/data/network-levels.js'

// ─── 登录状态 ───
const loggedIn = ref(false)
const username = ref('')
const password = ref('')
const loginError = ref('')
const activeTab = ref<'articles' | 'bookmarks'>('articles')

function login() {
  if (username.value === 'admin' && password.value === 'xlx1234') {
    loggedIn.value = true
    loginError.value = ''
    loadArticles()
    loadBookmarks()
  } else {
    loginError.value = '账号或密码错误'
  }
}

function logout() {
  loggedIn.value = false
  username.value = ''
  password.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') login()
}

// ─── 文章管理 ───
import { getArticles, saveArticle, deleteArticle } from '@/data/admin-store.js'

const articles = ref([])
const editingArticle = ref<Article | null>(null)
const showArticleEditor = ref(false)

const emptyArticle = () => ({
  id: Date.now(), title: '', content: '', excerpt: '',
  date: new Date().toISOString().split('T')[0], category: '技术', tags: [], slug: '',
})

const newArticle = ref(emptyArticle())

function loadArticles() {
  articles.value = getArticles()
}

function openNewArticle() {
  newArticle.value = emptyArticle()
  editingArticle.value = null
  showArticleEditor.value = true
}

function openEditArticle(article) {
  newArticle.value = { ...article }
  editingArticle.value = article
  showArticleEditor.value = true
}

function saveArticleHandler() {
  if (!newArticle.value.title.trim()) return
  saveArticle({ ...newArticle.value })
  showArticleEditor.value = false
  loadArticles()
}

function removeArticle(id: number) {
  if (confirm('确定删除这篇文章？')) {
    deleteArticle(id)
    loadArticles()
  }
}

// ─── 收藏夹管理 ───
import { getBookmarkCats, saveBookmarkCats } from '@/data/admin-store.js'

const bookmarkCats = ref([])
const editingCat = ref('')
const showCatInput = ref(false)
const newCatName = ref('')
const editingBookmark = ref<{ cat: string; item: BookmarkItem } | null>(null)
const showBookmarkEditor = ref(false)

const emptyBookmark = (): BookmarkItem => ({ id: Date.now(), name: '', url: '', desc: '', category: '' })
const newBookmark = ref(emptyBookmark())

function loadBookmarks() {
  bookmarkCats.value = getBookmarkCats()
}

function addCategory() {
  const name = newCatName.value.trim()
  if (!name) return
  const cats = getBookmarkCats()
  cats.push({ name, items: [] })
  saveBookmarkCats(cats)
  loadBookmarks()
  newCatName.value = ''
  showCatInput.value = false
}

function deleteCategory(name: string) {
  if (!confirm(`确定删除分类「${name}」及其所有收藏？`)) return
  const cats = getBookmarkCats().filter(c => c.name !== name)
  saveBookmarkCats(cats)
  loadBookmarks()
}

function openNewBookmark(catName: string) {
  newBookmark.value = { ...emptyBookmark(), id: Date.now(), category: catName }
  editingBookmark.value = null
  showBookmarkEditor.value = true
}

function openEditBookmark(catName: string, item: BookmarkItem) {
  newBookmark.value = { ...item, category: catName }
  editingBookmark.value = item
  showBookmarkEditor.value = true
}

function saveBookmarkHandler() {
  if (!newBookmark.value.name.trim() || !newBookmark.value.url.trim()) return
  const cats = getBookmarkCats()
  const cat = cats.find(c => c.name === newBookmark.value.category)
  if (!cat) return

  if (editingBookmark.value) {
    const idx = cat.items.findIndex(i => i.id === editingBookmark.value!.id)
    if (idx >= 0) cat.items[idx] = { ...newBookmark.value }
  } else {
    cat.items.push({ ...newBookmark.value })
  }
  saveBookmarkCats(cats)
  loadBookmarks()
  showBookmarkEditor.value = false
}

function removeBookmark(catName: string, id: number) {
  if (!confirm('确定删除这个收藏？')) return
  const cats = getBookmarkCats()
  const cat = cats.find(c => c.name === catName)
  if (!cat) return
  cat.items = cat.items.filter(i => i.id !== id)
  saveBookmarkCats(cats)
  loadBookmarks()
}

onMounted(() => {
  // 尝试从 localStorage 恢复登录
  if (localStorage.getItem('admin_logged') === 'true') {
    loggedIn.value = true
    loadArticles()
    loadBookmarks()
  }
})

function onLoginSuccess() {
  localStorage.setItem('admin_logged', 'true')
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#0d1117] text-[#c9d1d9]">
    <!-- ═══ 登录页 ═══ -->
    <div v-if="!loggedIn" class="flex items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <div class="text-4xl mb-3">🔐</div>
          <h1 class="text-xl font-bold">管理后台</h1>
          <p class="text-sm text-[#8b949e] mt-1">请登录以管理内容</p>
        </div>
        <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4" @keydown="handleKeydown">
          <div>
            <label class="text-xs text-[#8b949e] block mb-1.5">账号</label>
            <input
              v-model="username"
              type="text"
              class="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm text-[#c9d1d9] outline-none focus:border-[#58a6ff] transition-colors"
              placeholder="admin"
            />
          </div>
          <div>
            <label class="text-xs text-[#8b949e] block mb-1.5">密码</label>
            <input
              v-model="password"
              type="password"
              class="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm text-[#c9d1d9] outline-none focus:border-[#58a6ff] transition-colors"
              placeholder="••••••••"
              @keydown.enter="login"
            />
          </div>
          <p v-if="loginError" class="text-xs text-[#f85149]">{{ loginError }}</p>
          <button
            class="w-full bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
            @click="login"
          >
            登 录
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ 后台管理 ═══ -->
    <div v-else class="max-w-6xl mx-auto px-4 py-8">
      <!-- Top bar -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-xl font-bold">管理后台</h1>
          <p class="text-sm text-[#8b949e]">管理文章和收藏夹</p>
        </div>
        <button
          class="text-xs text-[#8b949e] hover:text-[#f85149] transition-colors border border-[#30363d] rounded-lg px-4 py-2"
          @click="logout"
        >
          退出登录
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mb-6 bg-[#161b22] rounded-lg p-1 border border-[#30363d] w-fit">
        <button
          :class="activeTab === 'articles' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9]'"
          class="px-5 py-2 text-sm rounded-md transition-colors font-medium"
          @click="activeTab = 'articles'"
        >📝 文章管理</button>
        <button
          :class="activeTab === 'bookmarks' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9]'"
          class="px-5 py-2 text-sm rounded-md transition-colors font-medium"
          @click="activeTab = 'bookmarks'"
        >🔖 收藏夹管理</button>
      </div>

      <!-- ═══ 文章管理 ═══ -->
      <div v-if="activeTab === 'articles'">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-[#8b949e]">共 {{ articles.length }} 篇文章</p>
          <button
            class="bg-[#238636] hover:bg-[#2ea043] text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
            @click="openNewArticle"
          >＋ 新建文章</button>
        </div>

        <!-- Article list -->
        <div class="space-y-2">
          <div
            v-for="article in articles"
            :key="article.id"
            class="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center justify-between group hover:border-[#58a6ff] transition-colors"
          >
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold truncate">{{ article.title }}</h3>
              <p class="text-xs text-[#8b949e] mt-0.5">{{ article.date }} · {{ article.category }}</p>
            </div>
            <div class="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="text-xs text-[#58a6ff] hover:underline px-2" @click="openEditArticle(article)">编辑</button>
              <button class="text-xs text-[#f85149] hover:underline px-2" @click="removeArticle(article.id)">删除</button>
            </div>
          </div>
          <div v-if="articles.length === 0" class="text-center py-12 text-[#8b949e] text-sm">
            暂无文章，点击"新建文章"开始
          </div>
        </div>

        <!-- Article Editor Modal -->
        <div v-if="showArticleEditor" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="showArticleEditor = false">
          <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <h2 class="text-base font-bold mb-4">{{ editingArticle ? '编辑文章' : '新建文章' }}</h2>
            <div class="space-y-3">
              <input v-model="newArticle.title" placeholder="文章标题" class="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#58a6ff]" />
              <div class="flex gap-3">
                <input v-model="newArticle.date" type="date" class="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#58a6ff]" />
                <input v-model="newArticle.category" placeholder="分类" class="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#58a6ff]" />
              </div>
              <textarea v-model="newArticle.excerpt" placeholder="摘要" rows="2" class="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#58a6ff] resize-none"></textarea>
              <textarea v-model="newArticle.content" placeholder="文章内容 (支持 HTML)" rows="8" class="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#58a6ff] resize-none font-mono"></textarea>
            </div>
            <div class="flex gap-3 mt-4 justify-end">
              <button class="px-4 py-2 text-sm text-[#8b949e] hover:text-[#c9d1d9] transition-colors" @click="showArticleEditor = false">取消</button>
              <button class="px-4 py-2 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors font-medium" @click="saveArticleHandler">保存</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ 收藏夹管理 ═══ -->
      <div v-if="activeTab === 'bookmarks'">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-[#8b949e]">共 {{ bookmarkCats.reduce((s, c) => s + c.items.length, 0) }} 个收藏</p>
          <button
            class="bg-[#1f6feb] hover:bg-[#58a6ff] text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
            @click="showCatInput = true"
          >＋ 新建分类</button>
        </div>

        <!-- New category input -->
        <div v-if="showCatInput" class="flex gap-2 mb-4">
          <input v-model="newCatName" placeholder="分类名称" class="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#58a6ff]" @keydown.enter="addCategory" />
          <button class="px-4 py-2 text-sm bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-colors" @click="addCategory">确定</button>
          <button class="px-4 py-2 text-sm text-[#8b949e] hover:text-[#c9d1d9] transition-colors" @click="showCatInput = false">取消</button>
        </div>

        <!-- Categories -->
        <div v-for="cat in bookmarkCats" :key="cat.name" class="mb-6 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-[#30363d]">
            <h3 class="text-sm font-semibold">{{ cat.name }} <span class="text-[#8b949e] font-normal">({{ cat.items.length }})</span></h3>
            <div class="flex gap-2">
              <button class="text-xs text-[#58a6ff] hover:underline px-2" @click="openNewBookmark(cat.name)">＋ 添加</button>
              <button class="text-xs text-[#f85149] hover:underline px-2" @click="deleteCategory(cat.name)">删除分类</button>
            </div>
          </div>
          <div class="divide-y divide-[#30363d]">
            <div v-for="item in cat.items" :key="item.id" class="px-4 py-3 flex items-center justify-between group hover:bg-[#0d1117]/50 transition-colors">
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium truncate">{{ item.name }}</h4>
                <p class="text-xs text-[#8b949e] truncate">{{ item.url }}</p>
              </div>
              <div class="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="text-xs text-[#58a6ff] hover:underline px-2" @click="openEditBookmark(cat.name, item)">编辑</button>
                <button class="text-xs text-[#f85149] hover:underline px-2" @click="removeBookmark(cat.name, item.id)">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bookmark Editor Modal -->
      <div v-if="showBookmarkEditor" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="showBookmarkEditor = false">
        <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-full max-w-lg">
          <h2 class="text-base font-bold mb-4">{{ editingBookmark ? '编辑收藏' : '新建收藏' }}</h2>
          <div class="space-y-3">
            <input v-model="newBookmark.name" placeholder="名称" class="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#58a6ff]" />
            <input v-model="newBookmark.url" placeholder="URL (https://...)" class="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#58a6ff]" />
            <textarea v-model="newBookmark.desc" placeholder="描述" rows="2" class="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#58a6ff] resize-none"></textarea>
          </div>
          <div class="flex gap-3 mt-4 justify-end">
            <button class="px-4 py-2 text-sm text-[#8b949e] hover:text-[#c9d1d9] transition-colors" @click="showBookmarkEditor = false">取消</button>
            <button class="px-4 py-2 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors font-medium" @click="saveBookmarkHandler">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
