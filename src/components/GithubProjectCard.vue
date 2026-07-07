<script setup lang="ts">
import { useRouter } from 'vue-router'

interface GithubProject {
  id: number | string
  repo_name: string
  full_name: string
  description: string
  language: string
  stars: number
  forks: number
  daily_growth?: number
  topics: string[]
  html_url: string
  owner_avatar: string
  owner_login: string
}

interface Props {
  project: GithubProject
  rank?: number
  detailId?: number | string
}

const props = defineProps<Props>()
const router = useRouter()

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return String(num)
}

function handleClick() {
  const id = props.detailId || props.project.id
  router.push(`/github-daily/${id}`)
}
</script>

<template>
  <article
    class="gh-card group cursor-pointer"
    @click="handleClick"
  >
    <div class="gh-card__body">
      <div class="gh-card__header">
        <div class="gh-card__avatar-wrap">
          <img
            :src="project.owner_avatar"
            :alt="project.owner_login"
            class="gh-card__avatar"
          />
          <div v-if="rank" class="gh-card__rank">
            #{{ rank }}
          </div>
        </div>
        <div class="gh-card__owner-info">
          <span class="gh-card__owner">{{ project.owner_login }}</span>
          <span class="gh-card__slash">/</span>
          <h3 class="gh-card__name">{{ project.repo_name }}</h3>
        </div>
      </div>

      <p class="gh-card__desc">{{ project.description }}</p>

      <div class="gh-card__tags">
        <span v-if="project.language" class="gh-card__tag gh-card__tag--lang">
          <span class="gh-card__lang-dot"></span>
          {{ project.language }}
        </span>
        <span
          v-for="topic in project.topics.slice(0, 2)"
          :key="topic"
          class="gh-card__tag"
        >
          {{ topic }}
        </span>
      </div>

      <div class="gh-card__meta">
        <div class="gh-card__stats">
          <span class="gh-card__stat">
            <svg class="gh-card__star-icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
            </svg>
            {{ formatNumber(project.stars) }}
          </span>
          <span class="gh-card__stat">
            <svg class="gh-card__fork-icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
            </svg>
            {{ formatNumber(project.forks) }}
          </span>
        </div>
        <div v-if="project.daily_growth !== undefined && project.daily_growth > 0" class="gh-card__growth">
          ▲{{ formatNumber(project.daily_growth) }}
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.gh-card {
  width: 100%;
  background-color: #fffaef;
  color: #161310;
  border: 2px solid #161310;
  box-shadow: 8px 8px 0 0 #161310;
  font-family: "Inter", ui-sans-serif, sans-serif;
  clip-path: polygon(
    0 0,
    calc(100% - 14px) 0,
    100% 14px,
    100% 100%,
    14px 100%,
    0 calc(100% - 14px)
  );
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.gh-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 12px 12px 0 0 #161310;
}

.gh-card__body {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gh-card__header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gh-card__avatar-wrap {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.gh-card__avatar {
  width: 48px;
  height: 48px;
  border: 2px solid #161310;
  background-color: #f5f0e8;
  image-rendering: pixelated;
}

.gh-card__rank {
  position: absolute;
  top: -6px;
  right: -6px;
  font-family: "VT323", ui-monospace, monospace;
  font-size: 14px;
  font-weight: bold;
  padding: 1px 6px;
  background-color: #e2522e;
  color: #fffaef;
  border: 2px solid #161310;
  line-height: 1;
}

.gh-card__owner-info {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
}

.gh-card__owner {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 16px;
  color: #3a332a;
  letter-spacing: 0.02em;
}

.gh-card__slash {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 16px;
  color: #3a332a;
}

.gh-card__name {
  font-family: "Pixelify Sans", ui-monospace, monospace;
  font-weight: 700;
  font-size: 22px;
  line-height: 1.1;
  color: #161310;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gh-card__desc {
  font-family: "Inter", ui-sans-serif, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #161310;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
}

.gh-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.gh-card__tag {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 14px;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  background-color: #f5f0e8;
  color: #3a332a;
  border: 2px solid #161310;
  line-height: 1.2;
  text-transform: lowercase;
}

.gh-card__tag--lang {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #161310;
  color: #fffaef;
}

.gh-card__lang-dot {
  width: 8px;
  height: 8px;
  background-color: #f24c00;
  border: 1px solid #fffaef;
}

.gh-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  border-top: 2px dotted #d9cdb3;
}

.gh-card__stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.gh-card__stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: "VT323", ui-monospace, monospace;
  font-size: 16px;
  color: #3a332a;
  line-height: 1;
}

.gh-card__star-icon {
  width: 16px;
  height: 16px;
  fill: #e2522e;
}

.gh-card__fork-icon {
  width: 16px;
  height: 16px;
  fill: #3a332a;
}

.gh-card__growth {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 16px;
  font-weight: bold;
  color: #059669;
  line-height: 1;
}
</style>
