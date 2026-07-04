<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { levels } from '@/data/network-levels.js'

// ─── 登录状态 ───
const loggedIn = ref(false)
const username = ref('')
const password = ref('')
const loginError = ref('')
const activeTab = ref<'articles' | 'bookmarks'>('articles')

async function login() {
  if (username.value === 'admin' && password.value === 'xlx1234') {
    loggedIn.value = true
    loginError.value = ''
    localStorage.setItem('admin_logged', 'true')
    await loadArticles()
    await loadBookmarks()
  } else {
    loginError.value = '账号或密码错误'
  }
}

function logout() {
  loggedIn.value = false
  username.value = ''
  password.value = ''
  localStorage.removeItem('admin_logged')
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

async function loadArticles() {
  articles.value = await getArticles()
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

async function saveArticleHandler() {
  if (!newArticle.value.title.trim()) return
  await saveArticle({ ...newArticle.value })
  showArticleEditor.value = false
  await loadArticles()
}

async function removeArticle(id) {
  if (confirm('确定删除这篇文章？')) {
    await deleteArticle(id)
    await loadArticles()
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

async function loadBookmarks() {
  bookmarkCats.value = await getBookmarkCats()
}

async function addCategory() {
  const name = newCatName.value.trim()
  if (!name) return
  const cats = await getBookmarkCats()
  cats.push({ name, items: [] })
  await saveBookmarkCats(cats)
  await loadBookmarks()
  newCatName.value = ''
  showCatInput.value = false
}

async function deleteCategory(name) {
  if (!confirm(`确定删除分类「${name}」及其所有收藏？`)) return
  const cats = await getBookmarkCats()
  const idx = cats.findIndex(c => c.name === name)
  if (idx >= 0) {
    cats.splice(idx, 1)
    await saveBookmarkCats(cats)
  }
  await loadBookmarks()
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
  if (localStorage.getItem('admin_logged') === 'true') {
    loggedIn.value = true
    loadArticles()
    loadBookmarks()
  }
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] text-[#161310]">
    <!-- ═══ 登录页 ═══ -->
    <div v-if="!loggedIn" class="flex items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-[#fffaef] border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] flex items-center justify-center font-mono text-2xl mx-auto mb-4">🔐</div>
          <h1 class="font-mono text-2xl font-black text-[#161310]">管理后台</h1>
          <p class="font-mono text-sm text-[#3a332a] mt-1">请登录以管理内容</p>
        </div>
        <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] p-6 space-y-4" @keydown="handleKeydown">
          <div>
            <label class="font-mono text-xs text-[#3a332a] block mb-1.5">账号</label>
            <input
              v-model="username"
              type="text"
              class="w-full bg-[#f5f0e8] border-2 border-[#161310] px-3 py-2.5 font-mono text-sm text-[#161310] outline-none transition-colors focus:border-[#2e5dd6]"
              placeholder="admin"
            />
          </div>
          <div>
            <label class="font-mono text-xs text-[#3a332a] block mb-1.5">密码</label>
            <input
              v-model="password"
              type="password"
              class="w-full bg-[#f5f0e8] border-2 border-[#161310] px-3 py-2.5 font-mono text-sm text-[#161310] outline-none transition-colors focus:border-[#2e5dd6]"
              placeholder="••••••••"
              @keydown.enter="login"
            />
          </div>
          <p v-if="loginError" class="font-mono text-xs text-[#e2522e]">{{ loginError }}</p>
          <button
            class="w-full font-mono text-sm tracking-wider uppercase px-4 py-2.5 border-2 border-[#161310] bg-[#161310] text-[#fffaef] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5"
            @click="login"
          >登 录</button>
        </div>
      </div>
    </div>

    <!-- ═══ 后台管理 ═══ -->
    <div v-else class="max-w-6xl mx-auto px-4 py-8 pt-24">
      <!-- Top bar -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="font-mono text-2xl font-black text-[#161310]">管理后台</h1>
          <p class="font-mono text-sm text-[#3a332a] mt-1">管理文章和收藏夹</p>
        </div>
        <button
          class="font-mono text-xs tracking-wider uppercase px-3 py-1.5 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5"
          @click="logout"
        >退出登录</button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mb-6 bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-1 w-fit">
        <button
          :class="activeTab === 'articles' ? 'bg-[#161310] text-[#fffaef]' : 'text-[#3a332a] hover:text-[#161310]'"
          class="font-mono text-sm tracking-wider uppercase px-5 py-2 transition-colors"
          @click="activeTab = 'articles'"
        >📝 文章管理</button>
        <button
          :class="activeTab === 'bookmarks' ? 'bg-[#161310] text-[#fffaef]' : 'text-[#3a332a] hover:text-[#161310]'"
          class="font-mono text-sm tracking-wider uppercase px-5 py-2 transition-colors"
          @click="activeTab = 'bookmarks'"
        >🔖 收藏夹管理</button>
      </div>

      <!-- ═══ 文章管理 ═══ -->
      <div v-if="activeTab === 'articles'">
        <div class="flex items-center justify-between mb-4">
          <p class="font-mono text-sm text-[#3a332a]">共 {{ articles.length }} 篇文章</p>
          <button
            class="font-mono text-xs tracking-wider uppercase px-3 py-1.5 border-2 border-[#161310] bg-[#161310] text-[#fffaef] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5"
            @click="openNewArticle"
          >＋ 新建文章</button>
        </div>

        <div class="space-y-2">
          <div
            v-for="article in articles"
            :key="article.id"
            class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-4 flex items-center justify-between group transition-all duration-200 hover:-translate-y-0.5"
          >
            <div class="flex-1 min-w-0">
              <h3 class="font-['Pixelify_Sans'] text-sm font-bold text-[#161310] truncate">{{ article.title }}</h3>
              <p class="font-mono text-xs text-[#3a332a] mt-0.5">{{ article.date }} · {{ article.category }}</p>
            </div>
            <div class="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="font-mono text-xs tracking-wider uppercase px-2 py-1 border border-[#161310] text-[#161310] hover:bg-[#161310]/10 transition-colors" @click="openEditArticle(article)">编辑</button>
              <button class="font-mono text-xs tracking-wider uppercase px-2 py-1 border border-[#e2522e] text-[#e2522e] hover:bg-[#e2522e]/10 transition-colors" @click="removeArticle(article.id)">删除</button>
            </div>
          </div>
          <div v-if="articles.length === 0" class="text-center py-12 font-mono text-sm text-[#3a332a]">
            暂无文章，点击「新建文章」开始
          </div>
        </div>

        <!-- Article Editor Modal -->
        <div v-if="showArticleEditor" class="fixed inset-0 bg-[#161310]/70 flex items-center justify-center z-50 p-4" @click.self="showArticleEditor = false">
          <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <h2 class="font-mono text-lg font-bold text-[#161310] mb-4">{{ editingArticle ? '编辑文章' : '新建文章' }}</h2>
            <div class="space-y-3">
              <input v-model="newArticle.title" placeholder="文章标题" class="w-full bg-[#f5f0e8] border-2 border-[#161310] px-3 py-2.5 font-mono text-sm text-[#161310] outline-none focus:border-[#2e5dd6]" />
              <div class="flex gap-3">
                <input v-model="newArticle.date" type="date" class="flex-1 bg-[#f5f0e8] border-2 border-[#161310] px-3 py-2.5 font-mono text-sm text-[#161310] outline-none focus:border-[#2e5dd6]" />
                <input v-model="newArticle.category" placeholder="分类" class="flex-1 bg-[#f5f0e8] border-2 border-[#161310] px-3 py-2.5 font-mono text-sm text-[#161310] outline-none focus:border-[#2e5dd6]" />
              </div>
              <textarea v-model="newArticle.excerpt" placeholder="摘要" rows="2" class="w-full bg-[#f5f0e8] border-2 border-[#161310] px-3 py-2.5 font-mono text-sm text-[#161310] outline-none focus:border-[#2e5dd6] resize-none"></textarea>
              <textarea v-model="newArticle.content" placeholder="文章内容 (支持 HTML)" rows="8" class="w-full bg-[#f5f0e8] border-2 border-[#161310] px-3 py-2.5 font-mono text-sm text-[#161310] outline-none focus:border-[#2e5dd6] resize-none"></textarea>
            </div>
            <div class="flex gap-3 mt-4 justify-end">
              <button class="font-mono text-sm px-4 py-2 text-[#3a332a] hover:text-[#161310] transition-colors" @click="showArticleEditor = false">取消</button>
              <button class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] bg-[#161310] text-[#fffaef] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5" @click="saveArticleHandler">保存</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ 收藏夹管理 ═══ -->
      <div v-if="activeTab === 'bookmarks'">
        <div class="flex items-center justify-between mb-4">
          <p class="font-mono text-sm text-[#3a332a]">共 {{ bookmarkCats.reduce((s, c) => s + c.items.length, 0) }} 个收藏</p>
          <button
            class="font-mono text-xs tracking-wider uppercase px-3 py-1.5 border-2 border-[#161310] bg-[#161310] text-[#fffaef] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5"
            @click="showCatInput = true"
          >＋ 新建分类</button>
        </div>

        <!-- New category input -->
        <div v-if="showCatInput" class="flex gap-2 mb-4">
          <input v-model="newCatName" placeholder="分类名称" class="flex-1 bg-[#f5f0e8] border-2 border-[#161310] px-3 py-2 font-mono text-sm text-[#161310] outline-none focus:border-[#2e5dd6]" @keydown.enter="addCategory" />
          <button class="font-mono text-xs tracking-wider uppercase px-3 py-1.5 border-2 border-[#161310] bg-[#161310] text-[#fffaef] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5" @click="addCategory">确定</button>
          <button class="font-mono text-xs px-3 py-1.5 text-[#3a332a] hover:text-[#161310] transition-colors" @click="showCatInput = false">取消</button>
        </div>

        <!-- Categories -->
        <div v-for="cat in bookmarkCats" :key="cat.name" class="mb-6 bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 bg-[#f5f0e8] border-b-2 border-[#161310]">
            <h3 class="font-['Pixelify_Sans'] text-sm font-bold text-[#161310]">{{ cat.name }} <span class="font-mono font-normal text-[#3a332a]">({{ cat.items.length }})</span></h3>
            <div class="flex gap-2">
              <button class="font-mono text-xs text-[#2e5dd6] hover:underline px-2" @click="openNewBookmark(cat.name)">＋ 添加</button>
              <button class="font-mono text-xs text-[#e2522e] hover:underline px-2" @click="deleteCategory(cat.name)">删除分类</button>
            </div>
          </div>
          <div class="divide-y-2 divide-[#d9cdb3]">
            <div v-for="item in cat.items" :key="item.id" class="px-4 py-3 flex items-center justify-between group hover:bg-[#f5f0e8]/50 transition-colors">
              <div class="flex-1 min-w-0">
                <h4 class="font-['Pixelify_Sans'] text-sm font-bold text-[#161310] truncate">{{ item.name }}</h4>
                <p class="font-mono text-xs text-[#3a332a] truncate">{{ item.url }}</p>
              </div>
              <div class="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="font-mono text-xs text-[#2e5dd6] hover:underline px-2" @click="openEditBookmark(cat.name, item)">编辑</button>
                <button class="font-mono text-xs text-[#e2522e] hover:underline px-2" @click="removeBookmark(cat.name, item.id)">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bookmark Editor Modal -->
      <div v-if="showBookmarkEditor" class="fixed inset-0 bg-[#161310]/70 flex items-center justify-center z-50 p-4" @click.self="showBookmarkEditor = false">
        <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] p-6 w-full max-w-lg">
          <h2 class="font-mono text-lg font-bold text-[#161310] mb-4">{{ editingBookmark ? '编辑收藏' : '新建收藏' }}</h2>
          <div class="space-y-3">
            <input v-model="newBookmark.name" placeholder="名称" class="w-full bg-[#f5f0e8] border-2 border-[#161310] px-3 py-2.5 font-mono text-sm text-[#161310] outline-none focus:border-[#2e5dd6]" />
            <input v-model="newBookmark.url" placeholder="URL (https://...)" class="w-full bg-[#f5f0e8] border-2 border-[#161310] px-3 py-2.5 font-mono text-sm text-[#161310] outline-none focus:border-[#2e5dd6]" />
            <textarea v-model="newBookmark.desc" placeholder="描述" rows="2" class="w-full bg-[#f5f0e8] border-2 border-[#161310] px-3 py-2.5 font-mono text-sm text-[#161310] outline-none focus:border-[#2e5dd6] resize-none"></textarea>
          </div>
          <div class="flex gap-3 mt-4 justify-end">
            <button class="font-mono text-sm px-4 py-2 text-[#3a332a] hover:text-[#161310] transition-colors" @click="showBookmarkEditor = false">取消</button>
            <button class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] bg-[#161310] text-[#fffaef] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5" @click="saveBookmarkHandler">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
