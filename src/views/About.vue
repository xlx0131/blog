<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code2, Database, Bot, BarChart3, Layers } from '@lucide/vue'
import avatarImg from '@/assets/头像2.jpg'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  gsap.from('.timeline-item', {
    y: 30, opacity: 0, duration: 0.6, stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.timeline', start: 'top bottom-=15%', toggleActions: 'play none none reverse' },
  })
  gsap.from('.skill-card', {
    y: 20, duration: 0.5, stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.skills-section', start: 'top bottom-=15%', toggleActions: 'play none none reverse' },
  })
})

interface Skill { name: string; level: string; progress: number; icon: any; items: string[] }
interface Advantage { title: string; desc: string; icon: string }

const skills: Skill[] = [
  { name: 'Python', level: '核心技能', progress: 90, icon: Code2, items: ['数据处理 (Pandas/NumPy)', '网络爬虫', '数据可视化', '机器学习 (Scikit-learn)'] },
  { name: 'SQL', level: '核心技能', progress: 85, icon: Database, items: ['数据库查询 (MySQL)', '多表联查与子查询', '索引优化', '存储过程'] },
  { name: 'AI Agent', level: '核心技能', progress: 88, icon: Bot, items: ['Cursor / Codex', 'Claude Code', 'Trae', 'Reasonix', 'Workbuddy', 'Marvis'] },
  { name: '大数据', level: '工作知识', progress: 70, icon: BarChart3, items: ['HDFS', 'MapReduce', 'YARN', 'Spark 基础'] },
  { name: '开发', level: '工作知识', progress: 75, icon: Layers, items: ['Java / C 语言', 'Spring Boot 项目开发', 'Web 前端 (Vue)', 'Unity 小游戏开发', '办公自动化'] },
]

const advantages: Advantage[] = [
  { title: '编程基础扎实', desc: '学习了 C 语言、Java、Python、Web 等多种编程语言，具备良好的编程基础与逻辑思维能力。', icon: '🧠' },
  { title: '数据处理能力', desc: '掌握使用 Python、Spark、SQL 等技术进行数据处理、清洗、分析与建模。', icon: '📈' },
  { title: '学习能力强', desc: '每学期均获得校奖学金，课程压力小、实习时间充足，能够快速学习新技术并应用到实践中。', icon: '🎯' },
  { title: '组织沟通能力', desc: '曾任学生会部门负责人、新生班级班主任助理，具备良好的团队协作与沟通协调能力。', icon: '🤝' },
  { title: '自主学习探索', desc: '课余时间跟随网课自学 Unity 游戏开发、Web 前端等技术，具备主动探索和解决问题的能力。', icon: '🔍' },
  { title: '办公软件熟练', desc: '能够熟练使用 Word、Excel、PowerPoint 等办公软件，满足日常文档处理和汇报需求。', icon: '📝' },
]

const education = [
  { school: '江西农业大学', degree: '数据科学与大数据技术 本科', years: '2023 - 2027' },
]
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20 px-6 sm:px-10 lg:px-20">
    <section class="mx-auto flex min-h-[60dvh] max-w-5xl flex-col justify-center">
      <div class="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
        <div class="relative">
          <div class="h-28 w-28 border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] sm:h-36 sm:w-36 overflow-hidden bg-[#2e5dd6]">
            <img :src="avatarImg" alt="许立鑫" class="h-full w-full object-cover" />
          </div>
          <div class="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center border-2 border-[#161310] bg-[#2e5dd6] sm:h-8 sm:w-8">
            <span class="text-xs text-[#fffaef] font-mono">✓</span>
          </div>
        </div>
        <div class="flex-1">
          <span class="inline-block mb-3 font-mono text-xs tracking-[0.2em] text-[#3a332a] border border-[#161310] px-2 py-0.5">关于</span>
          <h1 class="font-['Pixelify_Sans'] text-4xl font-bold tracking-tight text-[#161310] sm:text-5xl">许立鑫</h1>
          <p class="mt-2 text-lg font-medium tracking-tight text-[#2e5dd6] font-['Pixelify_Sans']">数据分析 · 开发</p>
          <p class="mt-5 max-w-lg text-base leading-relaxed text-[#3a332a] font-mono">
            江西农业大学 数据科学与大数据技术专业 2023 级本科生。对数据分析与开发充满热情，善于从数据中发现价值，用技术解决问题。
          </p>
          <div class="mt-7 flex flex-wrap gap-3">
            <a
              href="mailto:1211288810@qq.com"
              class="inline-block font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 bg-[#2e5dd6] text-[#fffaef]"
            >发送邮件</a>
            <a
              href="https://github.com/xlx0131"
              class="inline-block font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 bg-[#fffaef] text-[#161310]"
            >GitHub</a>
          </div>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-5xl">
      <div class="h-px bg-[#161310] mb-20"></div>

      <section class="skills-section mt-20">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center border-2 border-[#161310] bg-[#2e5dd6] shadow-[3px_3px_0_0_#161310]">
            <span class="text-lg text-[#fffaef]">⚡</span>
          </div>
          <div>
            <h2 class="font-['Pixelify_Sans'] text-2xl font-bold tracking-tight text-[#161310]">专业技能</h2>
            <p class="mt-0.5 font-mono text-sm text-[#3a332a]">日常使用的技术与工具。</p>
          </div>
        </div>
        <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="skill in skills"
            :key="skill.name"
            class="skill-card bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-5 transition-all duration-200 hover:-translate-y-1"
          >
            <div class="flex items-start gap-4">
              <div class="flex shrink-0 h-14 w-14 items-center justify-center border-2 border-[#161310] bg-[#f2ead6] text-[#2e5dd6]">
                <component :is="skill.icon" class="h-7 w-7" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-['Pixelify_Sans'] text-base font-semibold text-[#161310]">{{ skill.name }}</h3>
                <div class="mt-1.5 flex items-center gap-2">
                  <div class="h-1.5 flex-1 overflow-hidden bg-[#f2ead6] border border-[#161310]">
                    <div
                      class="h-full bg-[#2e5dd6] transition-all duration-700 ease-out"
                      :style="{ width: skill.progress + '%' }"
                    ></div>
                  </div>
                  <span class="font-mono text-xs font-semibold text-[#2e5dd6] tabular-nums">{{ skill.progress }}%</span>
                </div>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-1.5">
              <span
                v-for="item in skill.items"
                :key="item"
                class="font-mono text-xs px-2 py-0.5 border border-[#161310] text-[#161310] bg-[#f2ead6]"
              >
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-24">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center border-2 border-[#161310] bg-[#2e5dd6] shadow-[3px_3px_0_0_#161310]">
            <span class="text-lg text-[#fffaef]">🌟</span>
          </div>
          <div>
            <h2 class="font-['Pixelify_Sans'] text-2xl font-bold tracking-tight text-[#161310]">个人优势</h2>
            <p class="mt-0.5 font-mono text-sm text-[#3a332a]">我的核心竞争力。</p>
          </div>
        </div>
        <div class="timeline relative mt-8 pl-6">
          <div class="absolute left-2 top-1 bottom-1 w-px bg-[#161310]"></div>
          <div class="space-y-5">
            <div v-for="(item, idx) in advantages" :key="idx" class="timeline-item relative">
              <div class="absolute -left-[26px] top-5 flex h-5 w-5 items-center justify-center border-2 border-[#161310] bg-[#2e5dd6]">
                <span class="font-mono text-[10px] text-[#fffaef]">{{ idx + 1 }}</span>
              </div>
              <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-5 transition-all duration-200 hover:-translate-y-0.5">
                <div class="flex items-start gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-[#161310] bg-[#f2ead6] text-base">
                    {{ item.icon }}
                  </div>
                  <div class="flex-1">
                    <h3 class="font-['Pixelify_Sans'] text-base font-semibold text-[#161310]">{{ item.title }}</h3>
                    <p class="mt-1 font-mono text-sm leading-relaxed text-[#3a332a]">{{ item.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-24">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center border-2 border-[#161310] bg-[#2e5dd6] shadow-[3px_3px_0_0_#161310]">
            <span class="text-lg text-[#fffaef]">🎓</span>
          </div>
          <div>
            <h2 class="font-['Pixelify_Sans'] text-2xl font-bold tracking-tight text-[#161310]">教育经历</h2>
            <p class="mt-0.5 font-mono text-sm text-[#3a332a]">学术背景。</p>
          </div>
        </div>
        <div class="mt-6 space-y-4">
          <div v-for="edu in education" :key="edu.school" class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] overflow-hidden">
            <div class="flex items-start justify-between gap-4 p-6">
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-[#161310] bg-[#f2ead6] text-xl">
                  🏫
                </div>
                <div>
                  <p class="font-['Pixelify_Sans'] font-semibold text-[#161310]">{{ edu.school }}</p>
                  <p class="mt-1 font-mono text-sm text-[#3a332a]">{{ edu.degree }}</p>
                </div>
              </div>
              <span class="shrink-0 font-mono text-xs px-2 py-0.5 border border-[#161310] text-[#161310]">{{ edu.years }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-24">
        <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] overflow-hidden">
          <div class="p-6 pb-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center border-2 border-[#161310] bg-[#2e5dd6] shadow-[3px_3px_0_0_#161310]">
                <span class="text-lg text-[#fffaef]">📬</span>
              </div>
              <div>
                <h2 class="font-['Pixelify_Sans'] text-xl font-bold text-[#161310]">联系方式</h2>
                <p class="font-mono text-sm text-[#3a332a]">求职中 · 数据分析 / 开发 · 期望城市：南昌 · 薪资：6-9K</p>
              </div>
            </div>
          </div>
          <div class="px-6 pb-6">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <a
                href="tel:15179493671"
                class="flex items-center gap-3 border-2 border-[#161310] bg-[#f2ead6] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#161310]"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#161310] bg-[#2e5dd6] text-lg text-[#fffaef]">
                  📞
                </div>
                <div class="min-w-0">
                  <p class="font-mono text-xs text-[#3a332a]">电话</p>
                  <p class="truncate font-mono text-sm font-medium text-[#161310]">15179493671</p>
                </div>
              </a>
              <a
                href="mailto:1211288810@qq.com"
                class="flex items-center gap-3 border-2 border-[#161310] bg-[#f2ead6] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#161310]"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#161310] bg-[#2e5dd6] text-lg text-[#fffaef]">
                  📧
                </div>
                <div class="min-w-0">
                  <p class="font-mono text-xs text-[#3a332a]">邮箱</p>
                  <p class="truncate font-mono text-sm font-medium text-[#161310]">1211288810@qq.com</p>
                </div>
              </a>
              <a
                href="https://github.com/xlx0131"
                class="flex items-center gap-3 border-2 border-[#161310] bg-[#f2ead6] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#161310]"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#161310] bg-[#2e5dd6] text-lg text-[#fffaef]">
                  🐙
                </div>
                <div class="min-w-0">
                  <p class="font-mono text-xs text-[#3a332a]">GitHub</p>
                  <p class="truncate font-mono text-sm font-medium text-[#161310]">github.com/xlx0131</p>
                </div>
              </a>
            </div>
          </div>
          <div class="border-t-2 border-[#161310] px-6 py-4">
            <a
              href="mailto:1211288810@qq.com"
              class="inline-block w-full sm:w-auto font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 bg-[#2e5dd6] text-[#fffaef] text-center"
            >立即联系</a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
