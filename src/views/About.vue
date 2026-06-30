<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollReveal from '@/components/ScrollReveal.vue'


gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  gsap.from('.timeline-item', {
    y: 30, opacity: 0, duration: 0.6, stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.timeline', start: 'top bottom-=15%', toggleActions: 'play none none reverse' },
  })
})

interface Skill { name: string; level: string; items: string[] }
interface Experience { years: string; company: string; role: string; description: string }
interface Education { school: string; degree: string; years: string }

const skills = [
  { name: '前端', level: '核心能力', items: ['Vue 3 / Composition API', 'React 18 / Hooks', 'TypeScript', 'Tailwind CSS'] },
  { name: '后端', level: '工作知识', items: ['Node.js / Express', 'PostgreSQL', 'Redis', 'REST & GraphQL APIs'] },
  { name: '工具', level: '日常使用', items: ['Vite', 'Git / GitHub Actions', 'Docker', 'Playwright / Vitest'] },
  { name: '设计', level: '协作', items: ['Figma handoff', 'Design systems', 'Responsive layout', 'Accessibility'] },
]

const experience = [
  { years: '2024 - Present', company: 'StackWave Technologies', role: '全栈工程师', description: '负责构建和维护 200 多个工程团队使用的核心产品面板。主导了从基于类的 Vue 2 代码库到 Vue 3 Composition API 和 TypeScript 的迁移，将打包体积减少了 34%。' },
  { years: '2022 - 2024', company: 'Prism Labs', role: '初级前端开发', description: '使用 React 和 D3 为内部数据分析平台开发交互式数据可视化组件。与设计团队合作建立了模式库，将新功能的 UI 开发时间减少了约 40%。' },
  { years: '2021 - 2022', company: 'Orion Digital Studio', role: '前端实习生', description: '为电商和 SaaS 领域的客户构建响应式落地页和邮件模板。向团队引入了规范的 Git 分支约定和代码审查实践。' },
]

const education = [
  { school: 'Metro State University', degree: '计算机科学学士', years: '2018 - 2022' },
  { school: 'CodeBridge Academy', degree: '全栈网页开发训练营', years: '2021' },
]
</script>

<template>
  <div class="min-h-[100dvh] bg-[#fafafa]">
    <ScrollReveal :threshold="0.1">
    <section class="grid min-h-[70dvh] grid-cols-1 lg:grid-cols-5">
      <div class="col-span-3 flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <span class="text-xs font-semibold tracking-[0.2em] text-emerald-600 uppercase">关于</span>
        <h1 class="mt-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">许立鑫</h1>
        <p class="mt-2 text-lg font-medium tracking-tight text-neutral-500">全栈工程师</p>
        <p class="mt-6 max-w-lg text-base leading-relaxed text-neutral-600">我构建精确、高性能且令人愉悦的界面。</p>
        <div class="mt-8 flex flex-wrap gap-4">
          <a href="mailto:xulixin@example.com" class="btn-tactile magnetic-btn ripple-btn inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-emerald-700">发送邮件</a>
          <a href="https://github.com/lionelchen" class="btn-tactile inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-300 hover:border-emerald-200 hover:text-emerald-600">GitHub</a>
        </div>
      </div>
    </section>
    </ScrollReveal>

    <div class="mx-auto max-w-5xl px-6 pb-24 sm:px-10 lg:px-16">
      <ScrollReveal :threshold="0.1">
      <section class="mt-20">
        <h2 class="text-2xl font-bold tracking-tight text-neutral-900">技能</h2>
        <p class="mt-1 text-sm text-neutral-500">我日常使用的技术和领域。</p>
        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div v-for="skill in skills" :key="skill.name" class="border-l-2 border-emerald-600 bg-white pl-4 pt-0.5 transition-all">
            <h3 class="text-base font-semibold tracking-tight text-neutral-800">{{ skill.name }}</h3>
            <p class="mt-0.5 text-xs font-medium text-emerald-600">{{ skill.level }}</p>
            <ul class="mt-3 space-y-1"><li v-for="item in skill.items" :key="item" class="text-sm text-neutral-600">{{ item }}</li></ul>
          </div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal :threshold="0.1">
      <section class="mt-20">
        <h2 class="text-2xl font-bold tracking-tight text-neutral-900">经历</h2>
        <p class="mt-1 text-sm text-neutral-500">我曾担任的职位及成果。</p>
        <div class="timeline mt-8 space-y-10">
          <div v-for="exp in experience" :key="exp.company" class="timeline-item border-l-2 border-emerald-600 pl-5">
            <span class="inline-block rounded-full bg-emerald-600/10 px-3 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-700">{{ exp.years }}</span>
            <h3 class="mt-2 text-lg font-semibold tracking-tight text-neutral-900">{{ exp.role }} <span class="font-normal text-neutral-500">于 {{ exp.company }}</span></h3>
            <p class="mt-2 max-w-prose text-sm leading-relaxed text-neutral-600">{{ exp.description }}</p>
          </div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal :threshold="0.1">
      <section class="mt-20">
        <h2 class="text-2xl font-bold tracking-tight text-neutral-900">教育</h2>
        <div class="mt-6 space-y-5">
          <div v-for="edu in education" :key="edu.school" class="flex items-start justify-between gap-4 border-b border-neutral-100 pb-4">
            <div><h3 class="text-base font-semibold tracking-tight text-neutral-800">{{ edu.school }}</h3><p class="text-sm text-neutral-500">{{ edu.degree }}</p></div>
            <span class="shrink-0 text-xs font-medium text-neutral-400">{{ edu.years }}</span>
          </div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal :threshold="0.1">
      <section class="mt-20 rounded-xl bg-white border border-neutral-200 p-8">
        <h2 class="text-2xl font-bold tracking-tight text-neutral-900">联系方式</h2>
        <p class="mt-1 text-sm text-neutral-500">我正在积极寻找机会。随时联系。</p>
        <div class="mt-6 flex flex-wrap gap-6">
          <a href="mailto:xulixin@example.com" class="group flex items-center gap-2 text-sm font-medium text-neutral-600 transition-all">xulixin@example.com</a>
          <a href="https://github.com/lionelchen" class="group flex items-center gap-2 text-sm font-medium text-neutral-600 transition-all">github.com/lionelchen</a>
        </div>
      </section></ScrollReveal>

    </div>
  </div>
</template>
