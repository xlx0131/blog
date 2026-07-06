<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import githubData from '@/data/github-projects.json'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))

interface GitHubProject {
  id: number
  name: string
  fullName: string
  description: string
  language: string
  topics: string[]
  stars: number
  forks: number
  watchers: number
  openIssues: number
  htmlUrl: string
  homepage: string
  license: string
  readmeSummary: string
  addedDate: string
  lastUpdatedDate: string
}

const project = computed(() => {
  return (githubData.projects as GitHubProject[]).find(p => p.id === id.value)
})

const languageColors: Record<string, string> = {
  TypeScript: '#f7df1e',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  Go: '#00add8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4f5d95',
}

function getLanguageColor(lang: string): string {
  return languageColors[lang] || '#6e7681'
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function goBack() {
  router.push('/github-hot')
}

function openUrl(url: string) {
  window.open(url, '_blank', 'noopener noreferrer')
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20" v-if="project">
    <div class="max-w-[900px] mx-auto px-6 sm:px-10">
      <button
        class="gh-back-btn"
        @click="goBack"
      >
        ← 返回列表
      </button>

      <div class="gh-detail-card">
        <div class="gh-detail-body">
          <div class="gh-detail-lang">
            <span
              class="w-3 h-3 rounded-full border border-[#161310]"
              :style="{ backgroundColor: getLanguageColor(project.language) }"
            ></span>
            <span class="gh-detail-lang-text">{{ project.language }}</span>
          </div>

          <h1 class="gh-detail-title">{{ project.name }}</h1>
          <p class="gh-detail-fullname">{{ project.fullName }}</p>
          <p class="gh-detail-desc">{{ project.description }}</p>

          <div class="gh-stats-grid">
            <div class="gh-stat-card">
              <div class="gh-stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div class="gh-stat-value">{{ formatNumber(project.stars) }}</div>
              <div class="gh-stat-label">Stars</div>
            </div>

            <div class="gh-stat-card">
              <div class="gh-stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="6" cy="3" r="2"/>
                  <circle cx="18" cy="3" r="2"/>
                  <circle cx="12" cy="21" r="2"/>
                  <path d="M6 5v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5"/>
                  <path d="M12 11v8"/>
                </svg>
              </div>
              <div class="gh-stat-value">{{ formatNumber(project.forks) }}</div>
              <div class="gh-stat-label">Forks</div>
            </div>

            <div class="gh-stat-card">
              <div class="gh-stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div class="gh-stat-value">{{ formatNumber(project.watchers) }}</div>
              <div class="gh-stat-label">Watchers</div>
            </div>

            <div class="gh-stat-card">
              <div class="gh-stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="gh-stat-value">{{ formatNumber(project.openIssues) }}</div>
              <div class="gh-stat-label">Issues</div>
            </div>
          </div>

          <div class="gh-section">
            <h2 class="gh-section-title">README 摘要</h2>
            <div class="gh-section-divider"></div>
            <p class="gh-readme-text">{{ project.readmeSummary }}</p>
          </div>

          <div class="gh-section">
            <h2 class="gh-section-title">项目信息</h2>
            <div class="gh-section-divider"></div>
            <div class="gh-info-grid">
              <div class="gh-info-item">
                <span class="gh-info-label">开源协议</span>
                <span class="gh-info-value">{{ project.license }}</span>
              </div>
              <div class="gh-info-item">
                <span class="gh-info-label">收录日期</span>
                <span class="gh-info-value">{{ formatDate(project.addedDate) }}</span>
              </div>
              <div class="gh-info-item">
                <span class="gh-info-label">最近更新</span>
                <span class="gh-info-value">{{ formatDate(project.lastUpdatedDate) }}</span>
              </div>
              <div v-if="project.homepage" class="gh-info-item">
                <span class="gh-info-label">项目官网</span>
                <a
                  class="gh-info-link"
                  :href="project.homepage"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ project.homepage }} ↗
                </a>
              </div>
            </div>
          </div>

          <div class="gh-section">
            <h2 class="gh-section-title">话题标签</h2>
            <div class="gh-section-divider"></div>
            <div class="gh-topics">
              <span
                v-for="topic in project.topics"
                :key="topic"
                class="gh-topic"
              >
                {{ topic }}
              </span>
            </div>
          </div>

          <div class="gh-actions">
            <a
              class="gh-btn gh-btn-primary"
              :href="project.htmlUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              在 GitHub 上查看 →
            </a>
            <a
              v-if="project.homepage"
              class="gh-btn gh-btn-secondary"
              :href="project.homepage"
              target="_blank"
              rel="noopener noreferrer"
            >
              访问官网
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20 flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <div class="gh-empty-icon">?</div>
      <h1 class="gh-empty-title">项目未找到</h1>
      <p class="gh-empty-desc">抱歉，您访问的项目不存在或已被移除。</p>
      <button
        class="gh-back-btn"
        @click="goBack"
      >
        ← 返回列表
      </button>
    </div>
  </div>
</template>

<style scoped>
.gh-back-btn {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 8px 16px;
  border: 2px solid #161310;
  background-color: #fffaef;
  color: #161310;
  box-shadow: 4px 4px 0 0 #161310;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  margin-bottom: 24px;
}

.gh-back-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 0 #161310;
}

.gh-detail-card {
  background-color: #fffaef;
  border: 2px solid #161310;
  box-shadow: 8px 8px 0 0 #161310;
  clip-path: polygon(
    0 0,
    calc(100% - 16px) 0,
    100% 16px,
    100% 100%,
    16px 100%,
    0 calc(100% - 16px)
  );
}

.gh-detail-body {
  padding: 32px;
}

.gh-detail-lang {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.gh-detail-lang-text {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 18px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #3a332a;
  line-height: 1;
}

.gh-detail-title {
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-weight: 700;
  font-size: 48px;
  line-height: 1.04;
  color: #161310;
  margin: 0 0 8px;
}

.gh-detail-fullname {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 20px;
  color: #2e5dd6;
  margin: 0 0 16px;
  letter-spacing: 0.02em;
}

.gh-detail-desc {
  font-family: 'Inter', ui-sans-serif, sans-serif;
  font-size: 16px;
  line-height: 1.7;
  color: #161310;
  margin: 0 0 28px;
}

.gh-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

.gh-stat-card {
  background-color: #f5f0e8;
  border: 2px solid #161310;
  padding: 16px;
  text-align: center;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.gh-stat-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 0 #161310;
}

.gh-stat-icon {
  width: 28px;
  height: 28px;
  margin: 0 auto 8px;
  color: #e2522e;
}

.gh-stat-icon svg {
  width: 100%;
  height: 100%;
}

.gh-stat-value {
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-size: 28px;
  font-weight: 700;
  color: #161310;
  line-height: 1;
  margin-bottom: 4px;
}

.gh-stat-label {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3a332a;
  line-height: 1;
}

.gh-section {
  margin-bottom: 28px;
}

.gh-section-title {
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-size: 22px;
  font-weight: 700;
  color: #161310;
  margin: 0 0 12px;
  line-height: 1;
}

.gh-section-divider {
  height: 2px;
  background: repeating-linear-gradient(
    to right,
    #161310 0,
    #161310 8px,
    transparent 8px,
    transparent 12px
  );
  margin-bottom: 16px;
}

.gh-readme-text {
  font-family: 'Inter', ui-sans-serif, sans-serif;
  font-size: 15px;
  line-height: 1.8;
  color: #161310;
  margin: 0;
  background-color: #f5f0e8;
  border: 2px solid #d9cdb3;
  padding: 16px;
}

.gh-info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.gh-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f0e8;
  border: 2px solid #d9cdb3;
  gap: 12px;
}

.gh-info-label {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 16px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #3a332a;
  flex-shrink: 0;
}

.gh-info-value {
  font-family: 'Inter', ui-sans-serif, sans-serif;
  font-size: 14px;
  color: #161310;
  text-align: right;
  word-break: break-all;
}

.gh-info-link {
  font-family: 'Inter', ui-sans-serif, sans-serif;
  font-size: 14px;
  color: #2e5dd6;
  text-decoration: none;
  text-align: right;
  word-break: break-all;
  transition: color 0.2s ease;
}

.gh-info-link:hover {
  color: #e2522e;
}

.gh-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.gh-topic {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 15px;
  letter-spacing: 0.04em;
  padding: 4px 12px;
  background-color: #f2ead6;
  color: #3a332a;
  border: 2px solid #d9cdb3;
  line-height: 1.4;
  transition: all 0.2s ease;
}

.gh-topic:hover {
  background-color: #e2522e;
  color: #fffaef;
  border-color: #161310;
}

.gh-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px dotted #d9cdb3;
}

.gh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 18px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 12px 24px;
  border: 2px solid #161310;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  line-height: 1;
}

.gh-btn-primary {
  background-color: #2e5dd6;
  color: #fffaef;
  box-shadow: 4px 4px 0 0 #161310;
}

.gh-btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 0 #161310;
}

.gh-btn-secondary {
  background-color: #fffaef;
  color: #161310;
  box-shadow: 4px 4px 0 0 #161310;
}

.gh-btn-secondary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 0 #161310;
  background-color: #f5f0e8;
}

.gh-empty-icon {
  width: 80px;
  height: 80px;
  background-color: #fffaef;
  border: 2px solid #161310;
  box-shadow: 8px 8px 0 0 #161310;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-size: 36px;
  color: #161310;
  margin: 0 auto 24px;
}

.gh-empty-title {
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-size: 28px;
  font-weight: 700;
  color: #161310;
  margin: 0 0 8px;
}

.gh-empty-desc {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 16px;
  color: #3a332a;
  margin: 0 0 24px;
}

@media (min-width: 640px) {
  .gh-stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .gh-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .gh-detail-body {
    padding: 48px;
  }

  .gh-detail-title {
    font-size: 56px;
  }
}
</style>
