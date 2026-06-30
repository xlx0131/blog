import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

// 全局 GSAP 动画增强（在所有页面生效）
import { useGsapEnhance } from '@/composables/useGsapEnhance'
// 在 App 根组件 mount 后执行
// App.vue 的 onMounted 中会调用 useGsapEnhance
