<script setup lang="ts">
interface AiSkill {
  id: number | string
  name: string
  description: string
  category: string
  url?: string
  icon?: string
}

interface Props {
  skill: AiSkill
}

defineProps<Props>()

function handleClick(skill: AiSkill) {
  if (skill.url) {
    window.open(skill.url, '_blank')
  }
}
</script>

<template>
  <article
    class="skill-card group"
    :class="{ 'cursor-pointer': skill.url }"
    @click="handleClick(skill)"
  >
    <div class="skill-card__body">
      <div class="skill-card__icon-wrap">
        <div v-if="skill.icon" class="skill-card__icon-text">
          {{ skill.icon }}
        </div>
        <svg v-else class="skill-card__icon-svg" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="12" width="48" height="40" stroke="#161310" stroke-width="3" fill="#f5f0e8"/>
          <rect x="14" y="20" width="10" height="3" fill="#161310"/>
          <rect x="28" y="20" width="22" height="3" fill="#d9cdb3"/>
          <rect x="14" y="28" width="36" height="3" fill="#d9cdb3"/>
          <rect x="14" y="36" width="28" height="3" fill="#d9cdb3"/>
          <rect x="14" y="44" width="20" height="3" fill="#d9cdb3"/>
          <circle cx="48" cy="44" r="6" stroke="#161310" stroke-width="3" fill="#e2522e"/>
          <path d="M48 41v6M45 44h6" stroke="#fffaef" stroke-width="2"/>
        </svg>
      </div>
      <div class="skill-card__content">
        <span class="skill-card__category">{{ skill.category }}</span>
        <h3 class="skill-card__name">{{ skill.name }}</h3>
        <p class="skill-card__desc">{{ skill.description }}</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.skill-card {
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

.skill-card.cursor-pointer:hover {
  transform: translate(-2px, -2px);
  box-shadow: 12px 12px 0 0 #161310;
}

.skill-card__body {
  padding: 18px 20px;
  display: flex;
  gap: 16px;
}

.skill-card__icon-wrap {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border: 2px solid #161310;
  background-color: #f5f0e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-card__icon-text {
  font-size: 28px;
  line-height: 1;
}

.skill-card__icon-svg {
  width: 40px;
  height: 40px;
}

.skill-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skill-card__category {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 14px;
  letter-spacing: 0.08em;
  color: #e2522e;
  line-height: 1;
  text-transform: uppercase;
}

.skill-card__name {
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

.skill-card__desc {
  font-family: "Inter", ui-sans-serif, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #161310;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
