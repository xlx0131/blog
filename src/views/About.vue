<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import avatarImg from '@/assets/头像2.jpg'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  gsap.from('.timeline-item', {
    y: 30, opacity: 0, duration: 0.6, stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.timeline', start: 'top bottom-=15%', toggleActions: 'play none none reverse' },
  })
  gsap.from('.skill-card', {
    y: 20, opacity: 0, duration: 0.5, stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.skills-section', start: 'top bottom-=15%', toggleActions: 'play none none reverse' },
  })
})

interface Skill { name: string; level: string; progress: number; icon: string; items: string[] }
interface Advantage { title: string; desc: string; icon: string }

const skills: Skill[] = [
  { name: 'Python', level: '核心技能', progress: 90, icon: '🐍', items: ['数据处理 (Pandas/NumPy)', '网络爬虫', '数据可视化', '机器学习 (Scikit-learn)'] },
  { name: 'SQL', level: '核心技能', progress: 85, icon: '🗄️', items: ['数据库查询 (MySQL)', '多表联查与子查询', '索引优化', '存储过程'] },
  { name: '大数据', level: '工作知识', progress: 70, icon: '📊', items: ['HDFS', 'MapReduce', 'YARN', 'Spark 基础'] },
  { name: '开发', level: '工作知识', progress: 75, icon: '💻', items: ['Java / C 语言', 'Web 前端 (Vue)', 'Unity 小游戏开发', '办公自动化'] },
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
  <div class="min-h-[100dvh] bg-background">
    <section class="mx-auto flex min-h-[60dvh] max-w-5xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <div class="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
        <div class="relative">
          <Avatar class="h-28 w-28 border-4 border-border sm:h-36 sm:w-36">
            <AvatarImage :src="avatarImg" alt="许立鑫" />
            <AvatarFallback class="text-2xl font-semibold">许立鑫</AvatarFallback>
          </Avatar>
          <div class="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-[#34d399] sm:h-8 sm:w-8">
            <span class="text-xs">✓</span>
          </div>
        </div>
        <div class="flex-1">
          <Badge variant="outline" class="mb-3 w-fit text-xs tracking-[0.2em] text-muted-foreground">关于</Badge>
          <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">许立鑫</h1>
          <p class="mt-2 text-lg font-medium tracking-tight text-[#34d399]">数据分析 · 开发</p>
          <p class="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            江西农业大学 数据科学与大数据技术专业 2023 级本科生。对数据分析与开发充满热情，善于从数据中发现价值，用技术解决问题。
          </p>
          <div class="mt-7 flex flex-wrap gap-3">
            <Button as="a" href="mailto:1211288810@qq.com" class="bg-[#34d399] text-emerald-950 hover:bg-[#2dd4bf]">发送邮件</Button>
            <Button as="a" href="https://github.com/xlx0131" variant="outline">GitHub</Button>
          </div>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-5xl px-6 pb-24 sm:px-10 lg:px-16">
      <Separator class="mb-20" />

      <section class="skills-section mt-20">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#34d399]/10 text-[#34d399]">
            <span class="text-lg">⚡</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-foreground">专业技能</h2>
            <p class="mt-0.5 text-sm text-muted-foreground">日常使用的技术与工具。</p>
          </div>
        </div>
        <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Card
            v-for="skill in skills"
            :key="skill.name"
            class="skill-card group overflow-hidden transition-all duration-300 hover:-translate-y-1"
            :class="skill.level === '核心技能'
              ? 'border-[#34d399]/20 bg-card/80 hover:border-[#34d399]/50 hover:shadow-lg hover:shadow-[#34d399]/10'
              : 'border-slate-200/20 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 shadow-sm hover:border-slate-300/30 hover:shadow-md hover:shadow-slate-900/10'"
          >
            <CardHeader class="pb-3">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-colors"
                    :class="skill.level === '核心技能'
                      ? 'bg-[#34d399]/10 group-hover:bg-[#34d399]/20'
                      : 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200'"
                  >
                    {{ skill.icon }}
                  </div>
                  <div>
                    <CardTitle :class="skill.level === '核心技能' ? 'text-lg text-foreground' : 'text-lg text-slate-900'">
                      {{ skill.name }}
                    </CardTitle>
                  </div>
                </div>
                <Badge
                  :variant="skill.level === '核心技能' ? 'default' : 'secondary'"
                  :class="skill.level === '核心技能' ? 'bg-[#34d399] text-emerald-950 hover:bg-[#2dd4bf]' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0'"
                >
                  {{ skill.level }}
                </Badge>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span :class="skill.level === '核心技能' ? 'text-muted-foreground' : 'text-slate-500'">熟练度</span>
                  <span :class="skill.level === '核心技能' ? 'font-medium text-[#34d399]' : 'font-medium text-emerald-600'">{{ skill.progress }}%</span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full" :class="skill.level === '核心技能' ? 'bg-secondary' : 'bg-slate-200'">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="skill.level === '核心技能'
                      ? 'bg-gradient-to-r from-[#34d399] to-[#2dd4bf]'
                      : 'bg-gradient-to-r from-emerald-400 to-emerald-500'"
                    :style="{ width: skill.progress + '%' }"
                  ></div>
                </div>
              </div>
              <ul class="space-y-1.5 pt-1">
                <li
                  v-for="item in skill.items"
                  :key="item"
                  class="flex items-start gap-2 text-sm"
                  :class="skill.level === '核心技能' ? 'text-muted-foreground' : 'text-slate-600'"
                >
                  <span :class="skill.level === '核心技能' ? 'mt-0.5 text-[#34d399]' : 'mt-0.5 text-emerald-500'">›</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section class="mt-24">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#34d399]/10 text-[#34d399]">
            <span class="text-lg">🌟</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-foreground">个人优势</h2>
            <p class="mt-0.5 text-sm text-muted-foreground">我的核心竞争力。</p>
          </div>
        </div>
        <div class="timeline relative mt-8 pl-6">
          <div class="absolute left-2 top-1 bottom-1 w-px bg-gradient-to-b from-[#34d399]/50 via-border to-transparent"></div>
          <div class="space-y-5">
            <div v-for="(item, idx) in advantages" :key="idx" class="timeline-item relative">
              <div class="absolute -left-[26px] top-5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-[#34d399]">
                <span class="text-[10px] text-emerald-950">{{ idx + 1 }}</span>
              </div>
              <Card class="transition-all duration-300 hover:border-[#34d399]/30 hover:shadow-md">
                <CardHeader class="pb-3">
                  <div class="flex items-start gap-3">
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#34d399]/10 text-base">
                      {{ item.icon }}
                    </div>
                    <div class="flex-1">
                      <CardTitle class="text-base">{{ item.title }}</CardTitle>
                      <CardDescription class="mt-1 leading-relaxed">{{ item.desc }}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-24">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#34d399]/10 text-[#34d399]">
            <span class="text-lg">🎓</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-foreground">教育经历</h2>
            <p class="mt-0.5 text-sm text-muted-foreground">学术背景。</p>
          </div>
        </div>
        <div class="mt-6 space-y-4">
          <Card v-for="edu in education" :key="edu.school" class="overflow-hidden">
            <CardContent class="flex items-start justify-between gap-4 p-6">
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#34d399]/20 to-[#2dd4bf]/20 text-xl">
                  🏫
                </div>
                <div>
                  <p class="font-semibold text-foreground">{{ edu.school }}</p>
                  <p class="mt-1 text-sm text-muted-foreground">{{ edu.degree }}</p>
                </div>
              </div>
              <Badge variant="outline" class="shrink-0 text-xs">{{ edu.years }}</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      <section class="mt-24">
        <Card class="overflow-hidden border-[#34d399]/20 bg-gradient-to-br from-[#34d399]/5 via-card to-transparent">
          <CardHeader class="pb-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#34d399]/10 text-[#34d399]">
                <span class="text-lg">📬</span>
              </div>
              <div>
                <CardTitle>联系方式</CardTitle>
                <CardDescription>求职中 · 数据分析 / 开发 · 期望城市：南昌 · 薪资：6-9K</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <a href="tel:15179493671" class="group flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 p-4 transition-all hover:border-[#34d399]/30 hover:bg-background hover:shadow-sm">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#34d399]/10 text-lg transition-colors group-hover:bg-[#34d399]/20">
                  📞
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-muted-foreground">电话</p>
                  <p class="truncate text-sm font-medium text-foreground">15179493671</p>
                </div>
              </a>
              <a href="mailto:1211288810@qq.com" class="group flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 p-4 transition-all hover:border-[#34d399]/30 hover:bg-background hover:shadow-sm">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#34d399]/10 text-lg transition-colors group-hover:bg-[#34d399]/20">
                  📧
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-muted-foreground">邮箱</p>
                  <p class="truncate text-sm font-medium text-foreground">1211288810@qq.com</p>
                </div>
              </a>
              <a href="https://github.com/xlx0131" class="group flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 p-4 transition-all hover:border-[#34d399]/30 hover:bg-background hover:shadow-sm">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#34d399]/10 text-lg transition-colors group-hover:bg-[#34d399]/20">
                  🐙
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-muted-foreground">GitHub</p>
                  <p class="truncate text-sm font-medium text-foreground">github.com/xlx0131</p>
                </div>
              </a>
            </div>
          </CardContent>
          <CardFooter class="border-t border-border/50 pt-4">
            <Button as="a" href="mailto:1211288810@qq.com" class="w-full bg-[#34d399] text-emerald-950 hover:bg-[#2dd4bf] sm:w-auto">
              立即联系
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  </div>
</template>
