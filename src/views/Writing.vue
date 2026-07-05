<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BookOpen, FileText, Calendar } from '@lucide/vue'

const router = useRouter()
const isAuthenticated = ref(false)
const showAuthModal = ref(false)
const authUsername = ref('')
const authPassword = ref('')
const authError = ref('')

const categories = [
  { id: 'novels', title: '小说集', desc: '虚构的世界与故事', icon: BookOpen, count: 0, color: '#2e5dd6' },
  { id: 'essays', title: '随笔集', desc: '随想与感悟', icon: FileText, count: 0, color: '#d4a017' },
  { id: 'diaries', title: '日记集', desc: '日常记录', icon: Calendar, count: 0, color: '#a33a3a' },
]

const activeCategory = ref('novels')

onMounted(() => {
  if (sessionStorage.getItem('writingAuth') === 'true') {
    isAuthenticated.value = true
  } else {
    showAuthModal.value = true
  }
})

function verifyAuth() {
  if (authUsername.value === '许立鑫' && authPassword.value === '20050131') {
    isAuthenticated.value = true
    showAuthModal.value = false
    sessionStorage.setItem('writingAuth', 'true')
  } else {
    authError.value = '用户名或密码错误'
  }
}

function closeAuth() {
  showAuthModal.value = false
  router.push('/')
}
</script>

<template>
  <div class="writing-page min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-16 px-6 lg:px-10">
    <!-- 验证弹窗 -->
    <div v-if="showAuthModal" class="auth-overlay">
      <div class="auth-modal">
        <div class="auth-modal-header">
          <span class="font-mono text-xs text-[#fffaef] tracking-wider">ACCESS RESTRICTED</span>
        </div>
        <div class="auth-modal-body p-6">
          <h3 class="font-['Pixelify_Sans'] text-2xl text-[#161310] mb-1 text-center">管理员验证</h3>
          <p class="font-mono text-xs text-[#3a332a] mb-6 text-center">请输入管理员凭证</p>
          
          <div class="space-y-4">
            <div>
              <label class="font-mono text-xs text-[#161310] block mb-2">用户名</label>
              <input
                v-model="authUsername"
                type="text"
                class="auth-input"
                placeholder="请输入用户名"
                @keyup.enter="verifyAuth"
              />
            </div>
            <div>
              <label class="font-mono text-xs text-[#161310] block mb-2">密码</label>
              <input
                v-model="authPassword"
                type="password"
                class="auth-input"
                placeholder="请输入密码"
                @keyup.enter="verifyAuth"
              />
            </div>
            
            <p v-if="authError" class="font-mono text-xs text-[#a33a3a] text-center">
              {{ authError }}
            </p>
            
            <div class="flex gap-3 pt-2">
              <button class="auth-btn secondary flex-1" @click="closeAuth">
                返回
              </button>
              <button class="auth-btn primary flex-1" @click="verifyAuth">
                确认
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isAuthenticated" class="max-w-[1200px] mx-auto">
      <!-- 标题区 -->
      <div class="text-center mb-12">
        <h1 class="font-['Pixelify_Sans'] text-4xl md:text-5xl text-[#161310] mb-4">私人创作</h1>
        <p class="font-mono text-[#3a332a] text-sm">Personal Writings</p>
      </div>

      <!-- 分类标签 -->
      <div class="flex justify-center gap-3 mb-10 flex-wrap">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="category-btn"
          :class="{ active: activeCategory === cat.id }"
          :style="activeCategory === cat.id ? { backgroundColor: cat.color } : {}"
          @click="activeCategory = cat.id"
        >
          <component :is="cat.icon" class="w-5 h-5" />
          <span>{{ cat.title }}</span>
          <span class="count">{{ cat.count }}</span>
        </button>
      </div>

      <!-- 内容区 -->
      <div class="pixel-panel">
        <div class="panel-header">
          <span class="font-mono text-xs text-[#fffaef] tracking-wider">
            {{ categories.find(c => c.id === activeCategory)?.title?.toUpperCase() }}
          </span>
        </div>
        <div class="panel-content p-6">
          <div class="empty-state text-center py-16">
            <div class="empty-icon mb-6">
              <component :is="categories.find(c => c.id === activeCategory)?.icon" class="w-16 h-16" />
            </div>
            <p class="font-['Pixelify_Sans'] text-xl text-[#161310] mb-2">
              暂无内容
            </p>
            <p class="font-mono text-sm text-[#3a332a]">
              这里还空空如也，敬请期待...
            </p>
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="text-center mt-12">
        <p class="font-mono text-xs text-[#3a332a]">
          PRESS ESC TO RETURN
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.writing-page {
  font-family: ui-monospace, monospace;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #fffaef;
  border: 3px solid #161310;
  box-shadow: 4px 4px 0 0 #161310;
  color: #161310;
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  image-rendering: pixelated;
}

.category-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 0 #161310;
}

.category-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #161310;
}

.category-btn.active {
  color: #fffaef;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #161310;
}

.category-btn .count {
  background: rgba(22, 19, 16, 0.15);
  padding: 2px 8px;
  font-size: 12px;
  margin-left: 4px;
}

.category-btn.active .count {
  background: rgba(255, 250, 239, 0.25);
}

.pixel-panel {
  background: #fffaef;
  border: 3px solid #161310;
  box-shadow: 6px 6px 0 0 #161310;
  overflow: hidden;
}

.panel-header {
  background: #161310;
  padding: 10px 16px;
}

.empty-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  color: #d9d2c4;
}

@media (max-width: 768px) {
  .writing-page {
    pt-20: ;
  }

  .category-btn {
    padding: 8px 14px;
    font-size: 14px;
  }
}

.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(22, 19, 16, 0.7);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.auth-modal {
  background: #fffaef;
  border: 3px solid #161310;
  box-shadow: 8px 8px 0 0 #161310;
  width: 100%;
  max-width: 420px;
  animation: modalIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-modal-header {
  background: #161310;
  padding: 10px 16px;
}

.auth-input {
  width: 100%;
  padding: 10px 14px;
  background: #f5f0e8;
  border: 2px solid #161310;
  color: #161310;
  font-family: ui-monospace, monospace;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.auth-input:focus {
  background: #fffaef;
  border-color: #2e5dd6;
  box-shadow: 3px 3px 0 0 #2e5dd6;
}

.auth-btn {
  padding: 10px 20px;
  border: 2px solid #161310;
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.auth-btn.primary {
  background: #2e5dd6;
  color: #fffaef;
  box-shadow: 3px 3px 0 0 #161310;
}

.auth-btn.primary:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
  background: #3a6ee8;
}

.auth-btn.primary:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 0 #161310;
}

.auth-btn.secondary {
  background: #fffaef;
  color: #161310;
  box-shadow: 3px 3px 0 0 #161310;
}

.auth-btn.secondary:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
  background: #f5f0e8;
}

.auth-btn.secondary:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 0 #161310;
}
</style>
