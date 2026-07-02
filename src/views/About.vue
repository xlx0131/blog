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
interface Advantage { title: string; description: string }

const skills: Skill[] = [
  { name: 'Python', level: '核心技能', items: ['数据处理 (Pandas/NumPy)', '网络爬虫', '数据可视化', '机器学习 (Scikit-learn)'] },
  { name: 'SQL', level: '核心技能', items: ['数据库查询 (MySQL)', '多表联查与子查询', '索引优化', '存储过程'] },
  { name: '大数据', level: '工作知识', items: ['HDFS', 'MapReduce', 'YARN', 'Spark 基础'] },
  { name: '开发', level: '工作知识', items: ['Java / C 语言', 'Web 前端 (Vue)', 'Unity 小游戏开发', '办公自动化'] },
]

const advantages: Advantage[] = [
  { title: '编程基础扎实', description: '学习了 C 语言、Java、Python、Web 等多种编程语言，具备良好的编程基础与逻辑思维能力。' },
  { title: '数据处理能力', description: '掌握使用 Python、Spark、SQL 等技术进行数据处理、清洗、分析与建模。' },
  { title: '学习能力强', description: '每学期均获得校奖学金，课程压力小、实习时间充足，能够快速学习新技术并应用到实践中。' },
  { title: '组织沟通能力', description: '曾任学生会部门负责人、新生班级班主任助理，具备良好的团队协作与沟通协调能力。' },
  { title: '自主学习探索', description: '课余时间跟随网课自学 Unity 游戏开发、Web 前端等技术，具备主动探索和解决问题的能力。' },
  { title: '办公软件熟练', description: '能够熟练使用 Word、Excel、PowerPoint 等办公软件，满足日常文档处理和汇报需求。' },
]

const education = [
  { school: '江西农业大学', degree: '数据科学与大数据技术 本科', years: '2023 - 2027' },
]
</script>

<template>
  <div class="min-h-[100dvh] bg-[#0d1117]">
    <ScrollReveal :threshold="0.1">
    <section class="grid min-h-[70dvh] grid-cols-1 lg:grid-cols-5">
      <div class="col-span-3 flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <span class="text-xs font-semibold tracking-[0.2em] text-emerald-600 uppercase">关于</span>
        <h1 class="mt-4 text-4xl font-bold tracking-tight text-[#e6edf3] sm:text-5xl">许立鑫</h1>
        <p class="mt-2 text-lg font-medium tracking-tight text-[#8b949e]">数据分析 · 开发</p>
        <p class="mt-6 max-w-lg text-base leading-relaxed text-[#8b949e]">
          江西农业大学 数据科学与大数据技术专业 2023 级本科生。对数据分析与开发充满热情，善于从数据中发现价值，用技术解决问题。
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <a href="mailto:1211288810@qq.com" class="btn-tactile magnetic-btn ripple-btn inline-flex items-center gap-2 rounded-lg bg-[#059669] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-emerald-700">发送邮件</a>
          <a href="https://github.com/xlx0131" class="btn-tactile inline-flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#161b22] px-5 py-2.5 text-sm font-medium text-[#e6edf3] transition-all duration-300 hover:border-emerald-400 hover:text-[#34d399]">GitHub</a>
        </div>
      </div>
    </section>
    </ScrollReveal>

    <div class="mx-auto max-w-5xl px-6 pb-24 sm:px-10 lg:px-16">
      <ScrollReveal :threshold="0.1">
      <section class="mt-20">
        <h2 class="text-2xl font-bold tracking-tight text-[#e6edf3]">专业技能</h2>
        <p class="mt-1 text-sm text-[#8b949e]">日常使用的技术与工具。</p>
        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div v-for="skill in skills" :key="skill.name" class="border-l-2 border-[#34d399] bg-[#161b22] pl-4 pt-0.5 transition-all">
            <h3 class="text-base font-semibold tracking-tight text-[#e6edf3]">{{ skill.name }}</h3>
            <p class="mt-0.5 text-xs font-medium text-[#34d399]">{{ skill.level }}</p>
            <ul class="mt-3 space-y-1"><li v-for="item in skill.items" :key="item" class="text-sm text-[#8b949e]">{{ item }}</li></ul>
          </div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal :threshold="0.1">
      <section class="mt-20">
        <h2 class="text-2xl font-bold tracking-tight text-[#e6edf3]">个人优势</h2>
        <p class="mt-1 text-sm text-[#8b949e]">我的核心竞争力。</p>
        <div class="timeline mt-8 space-y-6">
          <div v-for="(item, idx) in advantages" :key="idx" class="timeline-item border-l-2 border-[#34d399] pl-5">
            <h3 class="text-base font-semibold tracking-tight text-[#e6edf3]">{{ item.title }}</h3>
            <p class="mt-1 max-w-prose text-sm leading-relaxed text-[#8b949e]">{{ item.description }}</p>
          </div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal :threshold="0.1">
      <section class="mt-20">
        <h2 class="text-2xl font-bold tracking-tight text-[#e6edf3]">教育</h2>
        <div class="mt-6 space-y-5">
          <div v-for="edu in education" :key="edu.school" class="flex items-start justify-between gap-4 border-b border-[#30363d] pb-4">
            <div><h3 class="text-base font-semibold tracking-tight text-[#e6edf3]">{{ edu.school }}</h3><p class="text-sm text-[#8b949e]">{{ edu.degree }}</p></div>
            <span class="shrink-0 text-xs font-medium text-[#6e7681]">{{ edu.years }}</span>
          </div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal :threshold="0.1">
      <section class="mt-20 rounded-xl bg-[#161b22] border border-[#30363d] p-8">
        <h2 class="text-2xl font-bold tracking-tight text-[#e6edf3]">联系方式</h2>
        <p class="mt-1 text-sm text-[#8b949e]">求职中 · 数据分析 / 开发 · 期望城市：南昌 · 薪资：3-7K</p>
        <div class="mt-6 flex flex-wrap gap-6">
          <a href="tel:15179493671" class="group flex items-center gap-2 text-sm font-medium text-[#8b949e] transition-all hover:text-[#34d399]">📞 15179493671</a>
          <a href="mailto:1211288810@qq.com" class="group flex items-center gap-2 text-sm font-medium text-[#8b949e] transition-all hover:text-[#34d399]">📧 1211288810@qq.com</a>
          <a href="https://github.com/xlx0131" class="group flex items-center gap-2 text-sm font-medium text-[#8b949e] transition-all hover:text-[#34d399]">🐙 github.com/xlx0131</a>
        </div>
      </section></ScrollReveal>

    </div>
  </div>
</template>
