<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code2, Database, Bot, BarChart3, Layers, BookOpen, Globe, FileText, Zap, Lightbulb, Scan, Network, Info, Cpu, Server } from '@lucide/vue'
import avatarImg from '@/assets/头像2.jpg'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  gsap.from('.pixel-panel', {
    y: 20, duration: 0.5, stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.about-grid', start: 'top bottom-=20%', toggleActions: 'play none none none' },
  })
})

interface Skill { name: string; level: string; progress: number; icon: any; items: string[] }
interface Advantage { title: string; desc: string; icon: string }

const skills: Skill[] = [
  { name: 'Python', level: '核心技能', progress: 90, icon: Code2, items: ['数据处理', '网络爬虫', '数据可视化', '机器学习'] },
  { name: 'SQL', level: '核心技能', progress: 85, icon: Database, items: ['数据库查询', '多表联查', '索引优化', '存储过程'] },
  { name: 'AI Agent', level: '核心技能', progress: 88, icon: Bot, items: ['Cursor', 'Claude Code', 'Trae', 'Reasonix'] },
  { name: '大数据', level: '工作知识', progress: 70, icon: BarChart3, items: ['HDFS', 'MapReduce', 'Spark', 'Hadoop'] },
  { name: '开发', level: '工作知识', progress: 75, icon: Layers, items: ['Java', 'Vue', 'Unity', '自动化'] },
]

const advantages: Advantage[] = [
  { title: '编程扎实', desc: '基础扎实', icon: 'Code2' },
  { title: '数据处理', desc: '分析能力强', icon: 'BarChart3' },
  { title: '学习力强', desc: '快速上手', icon: 'Zap' },
  { title: '沟通协作', desc: '团队合作', icon: 'Network' },
  { title: '自主探索', desc: '主动学习', icon: 'Scan' },
  { title: '办公熟练', desc: '文档处理', icon: 'FileText' },
]

const education = [
  { school: '江西农业大学', degree: '数据科学与大数据技术 本科', years: '2023 - 2027' },
]

const stats = [
  { label: 'GPA', value: '3.8', color: '#2e5dd6' },
  { label: '奖学金', value: '4次', color: '#d4a017' },
  { label: '项目', value: '5+', color: '#2e5dd6' },
  { label: '技能', value: '10+', color: '#d4a017' },
]

const iconMap: Record<string, any> = {
  Code2,
  BarChart3,
  Zap,
  Network,
  Scan,
  FileText,
}

function getAdvIcon(name: string) {
  return iconMap[name] || Code2
}
</script>

<template>
  <div class="about-page min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-16">
    <div class="top-bar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
      <div class="pixel-topbar flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="pixel-logo w-10 h-10 bg-[#2e5dd6] border-2 border-[#fffaef] relative">
            <div class="absolute inset-1 bg-[#d4a017]"></div>
          </div>
          <div>
            <h1 class="font-['Pixelify_Sans'] text-2xl text-[#fffaef] tracking-wider">XULIXIN</h1>
            <p class="font-mono text-xs text-[#b8a88a] tracking-widest">ABOUT · 个人档案</p>
          </div>
        </div>
        <div class="hidden md:block text-center">
          <h2 class="font-['Pixelify_Sans'] text-xl text-[#fffaef]">许立鑫 · 数据分析与开发</h2>
        </div>
        <div class="flex items-center gap-2">
          <span class="pixel-tag bg-[#2e5dd6] text-[#fffaef]">在校</span>
          <span class="pixel-tag bg-[#d4a017] text-[#161310]">开放合作</span>
        </div>
      </div>
    </div>

    <div class="about-grid mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-4">
      <div class="pixel-panel col-span-12 md:col-span-4 lg:col-span-3">
        <div class="panel-header">
          <span class="font-mono text-xs text-[#fffaef] tracking-wider">CHARACTER</span>
        </div>
        <div class="panel-content p-4 flex flex-col items-center">
          <div class="avatar-frame w-28 h-28 border-4 border-[#161310] bg-[#2e5dd6] relative mb-4 shadow-[4px_4px_0_0_#161310]">
            <img :src="avatarImg" alt="许立鑫" class="w-full h-full object-cover" />
            <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-[#d4a017] border-2 border-[#161310] flex items-center justify-center">
              <span class="text-[10px] font-bold text-[#161310]">LV</span>
            </div>
          </div>
          <h3 class="font-['Pixelify_Sans'] text-2xl text-[#161310]">许立鑫</h3>
          <p class="font-mono text-sm text-[#2e5dd6] mt-1">数据分析 · 开发</p>
          <div class="w-full mt-4 pt-4 border-t-2 border-[#161310] border-dashed">
            <div class="flex justify-between items-center mb-2">
              <span class="font-mono text-xs text-[#3a332a]">等级</span>
              <span class="font-mono text-xs font-bold text-[#d4a017]">大三</span>
            </div>
            <div class="h-3 bg-[#f2ead6] border-2 border-[#161310]">
              <div class="h-full bg-[#2e5dd6]" style="width: 75%"></div>
            </div>
            <p class="font-mono text-[10px] text-[#3a332a] mt-1 text-right">EXP: 75%</p>
          </div>
        </div>
      </div>

      <div class="pixel-panel col-span-12 md:col-span-8 lg:col-span-5">
        <div class="panel-header">
          <span class="font-mono text-xs text-[#fffaef] tracking-wider">PROFILE</span>
        </div>
        <div class="panel-content p-5">
          <h3 class="font-['Pixelify_Sans'] text-xl text-[#161310] mb-3">个人简介</h3>
          <p class="font-mono text-base leading-relaxed text-[#3a332a] mb-5">
            江西农业大学 数据科学与大数据技术专业 2023 级本科生。对数据分析与开发充满热情，善于从数据中发现价值，用技术解决问题。
          </p>
          <div class="flex flex-wrap gap-2">
            <a href="mailto:1211288810@qq.com" class="pixel-btn pixel-btn-primary">
            <span class="font-mono text-xs tracking-wider">发送邮件</span>
            </a>
            <a href="https://github.com/xlx0131" class="pixel-btn pixel-btn-secondary">
            <span class="font-mono text-xs tracking-wider">GITHUB</span>
            </a>
          </div>
        </div>
      </div>

      <div class="pixel-panel col-span-12 lg:col-span-4">
        <div class="panel-header">
          <span class="font-mono text-xs text-[#fffaef] tracking-wider">STATS</span>
        </div>
        <div class="panel-content p-4">
          <div class="grid grid-cols-2 gap-3">
            <div v-for="stat in stats" :key="stat.label" class="stat-item p-3 bg-[#f2ead6] border-2 border-[#161310] text-center">
              <p class="font-['Pixelify_Sans'] text-3xl" :style="{ color: stat.color }">{{ stat.value }}</p>
              <p class="font-mono text-xs text-[#3a332a] mt-1">{{ stat.label }}</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t-2 border-dashed border-[#161310] space-y-2">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-[#2e5dd6] border-2 border-[#161310] flex items-center justify-center text-[#fffaef] flex-shrink-0">
                <BookOpen class="w-4 h-4" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-mono text-xs text-[#3a332a]">学校</p>
                <p class="font-mono text-sm font-medium text-[#161310] truncate">江西农业大学</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-[#d4a017] border-2 border-[#161310] flex items-center justify-center text-[#161310] flex-shrink-0">
                <Cpu class="w-4 h-4" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-mono text-xs text-[#3a332a]">专业</p>
                <p class="font-mono text-sm font-medium text-[#161310] truncate">数据科学与大数据</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-[#2e5dd6] border-2 border-[#161310] flex items-center justify-center text-[#fffaef] flex-shrink-0">
                <Globe class="w-4 h-4" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-mono text-xs text-[#3a332a]">城市</p>
                <p class="font-mono text-sm font-medium text-[#161310] truncate">南昌</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pixel-panel col-span-12 lg:col-span-8">
        <div class="panel-header">
          <span class="font-mono text-xs text-[#fffaef] tracking-wider">SKILL TREE</span>
        </div>
        <div class="panel-content p-5">
          <h3 class="font-['Pixelify_Sans'] text-xl text-[#161310] mb-4">专业技能</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="skill in skills" :key="skill.name" class="skill-item p-4 bg-[#fffaef] border-2 border-[#161310] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#161310]">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 bg-[#f2ead6] border-2 border-[#161310] flex items-center justify-center text-[#2e5dd6]">
                  <component :is="skill.icon" class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <h4 class="font-['Pixelify_Sans'] text-base text-[#161310]">{{ skill.name }}</h4>
                  <p class="font-mono text-xs text-[#3a332a]">{{ skill.level }}</p>
                </div>
                <span class="font-mono text-sm font-bold text-[#2e5dd6]">{{ skill.progress }}%</span>
              </div>
              <div class="h-3 bg-[#f2ead6] border-2 border-[#161310] overflow-hidden">
                <div class="h-full bg-[#2e5dd6] transition-all duration-700" :style="{ width: skill.progress + '%' }"></div>
              </div>
              <div class="flex flex-wrap gap-1.5 mt-3">
                <span v-for="item in skill.items.slice(0, 4)" :key="item" class="font-mono text-xs px-2 py-0.5 bg-[#f2ead6] border border-[#161310] text-[#161310]">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pixel-panel col-span-12 lg:col-span-4">
        <div class="panel-header">
          <span class="font-mono text-xs text-[#fffaef] tracking-wider">PERKS</span>
        </div>
        <div class="panel-content p-4">
          <h3 class="font-['Pixelify_Sans'] text-xl text-[#161310] mb-3">个人优势</h3>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="adv in advantages" :key="adv.title" class="perk-card">
              <div class="perk-icon text-[#2e5dd6]">
                <component :is="getAdvIcon(adv.icon)" class="w-8 h-8" />
              </div>
              <div class="perk-content">
                <p class="perk-title font-['Pixelify_Sans'] text-[#161310]">{{ adv.title }}</p>
                <p class="perk-desc font-mono text-[#3a332a]">{{ adv.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pixel-panel col-span-12 md:col-span-5 lg:col-span-4">
        <div class="panel-header">
          <span class="font-mono text-xs text-[#fffaef] tracking-wider">EDUCATION</span>
        </div>
        <div class="panel-content p-4">
          <h3 class="font-['Pixelify_Sans'] text-xl text-[#161310] mb-3">教育经历</h3>
          <div v-for="edu in education" :key="edu.school" class="edu-item p-4 bg-[#fffaef] border-2 border-[#161310]">
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 bg-[#2e5dd6] border-2 border-[#161310] flex items-center justify-center text-[#fffaef] flex-shrink-0">
                <BookOpen class="w-6 h-6" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-['Pixelify_Sans'] text-lg text-[#161310]">{{ edu.school }}</p>
                <p class="font-mono text-sm text-[#3a332a] mt-1">{{ edu.degree }}</p>
                <p class="font-mono text-sm text-[#2e5dd6] mt-1">{{ edu.years }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pixel-panel col-span-12 md:col-span-7 lg:col-span-8">
        <div class="panel-header">
          <span class="font-mono text-xs text-[#fffaef] tracking-wider">CONTACT</span>
        </div>
        <div class="panel-content p-4">
          <h3 class="font-['Pixelify_Sans'] text-xl text-[#161310] mb-3">联系方式</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <a href="tel:15179493671" class="contact-item flex items-center gap-3 p-4 bg-[#fffaef] border-2 border-[#161310] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#161310]">
              <div class="w-10 h-10 bg-[#2e5dd6] border-2 border-[#161310] flex items-center justify-center text-[#fffaef] flex-shrink-0">
                <Server class="w-5 h-5" />
              </div>
              <div class="min-w-0">
                <p class="font-mono text-xs text-[#3a332a]">电话</p>
                <p class="font-mono text-sm font-medium text-[#161310] truncate">15179493671</p>
              </div>
            </a>
            <a href="mailto:1211288810@qq.com" class="contact-item flex items-center gap-3 p-4 bg-[#fffaef] border-2 border-[#161310] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#161310]">
              <div class="w-10 h-10 bg-[#2e5dd6] border-2 border-[#161310] flex items-center justify-center text-[#fffaef] flex-shrink-0">
                <Info class="w-5 h-5" />
              </div>
              <div class="min-w-0">
                <p class="font-mono text-xs text-[#3a332a]">邮箱</p>
                <p class="font-mono text-sm font-medium text-[#161310] truncate">1211288810@qq.com</p>
              </div>
            </a>
            <a href="https://github.com/xlx0131" class="contact-item flex items-center gap-3 p-4 bg-[#fffaef] border-2 border-[#161310] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#161310]">
              <div class="w-10 h-10 bg-[#2e5dd6] border-2 border-[#161310] flex items-center justify-center text-[#fffaef] flex-shrink-0">
                <Code2 class="w-5 h-5" />
              </div>
              <div class="min-w-0">
                <p class="font-mono text-xs text-[#3a332a]">GitHub</p>
                <p class="font-mono text-sm font-medium text-[#161310] truncate">github.com/xlx0131</p>
              </div>
            </a>
          </div>
          <div class="pt-4 border-t-2 border-dashed border-[#161310]">
            <a href="mailto:1211288810@qq.com" class="pixel-btn pixel-btn-primary w-full justify-center">
              <span class="font-mono text-sm tracking-wider">立即联系</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
      <p class="text-center font-mono text-[10px] text-[#b8a88a] tracking-widest">
        ■ PIXEL PORTFOLIO v1.0 ■
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  background-image:
    radial-gradient(#e8dfc8 1px, transparent 1px);
  background-size: 16px 16px;
}

.pixel-topbar {
  background: #161310;
  border: 3px solid #161310;
  box-shadow: 4px 4px 0 0 #161310;
  position: relative;
}

.pixel-topbar::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  height: 2px;
  background: #3a332a;
}

.pixel-logo {
  image-rendering: pixelated;
}

.pixel-tag {
  font-family: monospace;
  font-size: 12px;
  padding: 4px 10px;
  border: 2px solid #161310;
  font-weight: bold;
  letter-spacing: 1px;
}

.pixel-panel {
  background: #fffaef;
  border: 3px solid #161310;
  box-shadow: 4px 4px 0 0 #161310;
  position: relative;
  transition: all 0.2s ease;
}

.pixel-panel:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 0 0 #161310;
}

.panel-header {
  background: #161310;
  padding: 8px 14px;
  border-bottom: 3px solid #161310;
  position: relative;
  font-family: monospace;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 2px;
}

.panel-header::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 8px;
  right: 8px;
  height: 1px;
  background: #3a332a;
}

.panel-content {
  background: #f2ead6;
  min-height: 80px;
}

.avatar-frame {
  image-rendering: pixelated;
}

.pixel-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  border: 2px solid #161310;
  box-shadow: 3px 3px 0 0 #161310;
  text-decoration: none;
  transition: all 0.15s ease;
  cursor: pointer;
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
}

.pixel-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
}

.pixel-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 0 #161310;
}

.pixel-btn-primary {
  background: #2e5dd6;
  color: #fffaef;
}

.pixel-btn-secondary {
  background: #fffaef;
  color: #161310;
}

.skill-item {
  position: relative;
}

.stat-item {
  image-rendering: pixelated;
}

.perk-card {
  position: relative;
  height: 100px;
  background-color: #fffaef;
  border: 2px solid #161310;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.perk-card:hover {
  transform: scale(1.05);
  box-shadow: 4px 4px 0 0 #161310;
}

.perk-card .perk-icon {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.perk-card:hover .perk-icon {
  scale: 0;
}

.perk-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background-color: #fffaef;
  transform: rotateX(-90deg);
  transform-origin: bottom;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 6px;
}

.perk-card:hover .perk-content {
  transform: rotateX(0deg);
}

.perk-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.perk-desc {
  font-size: 12px;
  margin: 0;
}

.edu-item {
  position: relative;
}

.contact-item {
  text-decoration: none;
  color: inherit;
}

@media (max-width: 768px) {
  .about-grid {
    gap: 12px;
  }
  
  .pixel-panel {
    box-shadow: 3px 3px 0 0 #161310;
  }
}
</style>
