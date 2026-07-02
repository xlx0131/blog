<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  gsap.from('.timeline-item', {
    y: 30, opacity: 0, duration: 0.6, stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.timeline', start: 'top bottom-=15%', toggleActions: 'play none none reverse' },
  })
})

interface Skill { name: string; level: string; items: string[] }
interface Advantage { title: string; desc: string }

const skills: Skill[] = [
  { name: 'Python', level: '核心技能', items: ['数据处理 (Pandas/NumPy)', '网络爬虫', '数据可视化', '机器学习 (Scikit-learn)'] },
  { name: 'SQL', level: '核心技能', items: ['数据库查询 (MySQL)', '多表联查与子查询', '索引优化', '存储过程'] },
  { name: '大数据', level: '工作知识', items: ['HDFS', 'MapReduce', 'YARN', 'Spark 基础'] },
  { name: '开发', level: '工作知识', items: ['Java / C 语言', 'Web 前端 (Vue)', 'Unity 小游戏开发', '办公自动化'] },
]

const advantages: Advantage[] = [
  { title: '编程基础扎实', desc: '学习了 C 语言、Java、Python、Web 等多种编程语言，具备良好的编程基础与逻辑思维能力。' },
  { title: '数据处理能力', desc: '掌握使用 Python、Spark、SQL 等技术进行数据处理、清洗、分析与建模。' },
  { title: '学习能力强', desc: '每学期均获得校奖学金，课程压力小、实习时间充足，能够快速学习新技术并应用到实践中。' },
  { title: '组织沟通能力', desc: '曾任学生会部门负责人、新生班级班主任助理，具备良好的团队协作与沟通协调能力。' },
  { title: '自主学习探索', desc: '课余时间跟随网课自学 Unity 游戏开发、Web 前端等技术，具备主动探索和解决问题的能力。' },
  { title: '办公软件熟练', desc: '能够熟练使用 Word、Excel、PowerPoint 等办公软件，满足日常文档处理和汇报需求。' },
]

const education = [
  { school: '江西农业大学', degree: '数据科学与大数据技术 本科', years: '2023 - 2027' },
]
</script>

<template>
  <div class="min-h-[100dvh] bg-background">
    <!-- Hero -->
    <section class="mx-auto flex min-h-[60dvh] max-w-5xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <Badge variant="outline" class="mb-4 w-fit text-xs tracking-[0.2em] text-muted-foreground">关于</Badge>
      <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">许立鑫</h1>
      <p class="mt-2 text-lg font-medium tracking-tight text-muted-foreground">数据分析 · 开发</p>
      <p class="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
        江西农业大学 数据科学与大数据技术专业 2023 级本科生。对数据分析与开发充满热情，善于从数据中发现价值，用技术解决问题。
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <Button as="a" href="mailto:1211288810@qq.com">发送邮件</Button>
        <Button as="a" href="https://github.com/xlx0131" variant="outline">GitHub</Button>
      </div>
    </section>

    <div class="mx-auto max-w-5xl px-6 pb-24 sm:px-10 lg:px-16">
      <!-- 专业技能 -->
      <section class="mt-20">
        <h2 class="text-2xl font-bold tracking-tight text-foreground">专业技能</h2>
        <p class="mt-1 text-sm text-muted-foreground">日常使用的技术与工具。</p>
        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card v-for="skill in skills" :key="skill.name">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                {{ skill.name }}
                <Badge variant="secondary" class="text-[11px]">{{ skill.level }}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-1.5">
                <li v-for="item in skill.items" :key="item" class="text-sm text-muted-foreground">· {{ item }}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <!-- 个人优势 -->
      <section class="mt-20">
        <h2 class="text-2xl font-bold tracking-tight text-foreground">个人优势</h2>
        <p class="mt-1 text-sm text-muted-foreground">我的核心竞争力。</p>
        <div class="timeline mt-8 space-y-4">
          <Card v-for="(item, idx) in advantages" :key="idx" class="timeline-item border-l-2 border-l-[#34d399]">
            <CardHeader>
              <CardTitle class="text-base">{{ item.title }}</CardTitle>
              <CardDescription>{{ item.desc }}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <!-- 教育 -->
      <section class="mt-20">
        <h2 class="text-2xl font-bold tracking-tight text-foreground">教育</h2>
        <div class="mt-6 space-y-4">
          <Card v-for="edu in education" :key="edu.school">
            <CardContent class="flex items-start justify-between gap-4 pt-6">
              <div>
                <p class="font-semibold text-foreground">{{ edu.school }}</p>
                <p class="text-sm text-muted-foreground">{{ edu.degree }}</p>
              </div>
              <span class="shrink-0 text-xs text-muted-foreground">{{ edu.years }}</span>
            </CardContent>
          </Card>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="mt-20">
        <Card>
          <CardHeader>
            <CardTitle>联系方式</CardTitle>
            <CardDescription>求职中 · 数据分析 / 开发 · 期望城市：南昌 · 薪资：6-9K</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-6">
              <a href="tel:15179493671" class="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">📞 15179493671</a>
              <a href="mailto:1211288810@qq.com" class="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">📧 1211288810@qq.com</a>
              <a href="https://github.com/xlx0131" class="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">🐙 github.com/xlx0131</a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  </div>
</template>
