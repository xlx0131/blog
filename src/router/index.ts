import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () => import('@/views/Article.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
    },
    {
      path: '/archive',
      name: 'archive',
      component: () => import('@/views/Archive.vue'),
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/Projects.vue'),
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: () => import('@/views/ProjectDetail.vue'),
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: () => import('@/views/Bookmarks.vue'),
    },
    {
      path: '/bookmarks/:id',
      name: 'bookmark-detail',
      component: () => import('@/views/BookmarkDetail.vue'),
    },
    {
      path: '/network-game',
      name: 'network-game',
      component: () => import('@/views/NetworkGame.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/Admin.vue'),
    },
    {
      path: '/writing',
      name: 'writing',
      component: () => import('@/views/Writing.vue'),
    },
    {
      path: '/github-daily',
      name: 'github-daily',
      component: () => import('@/views/GithubDaily.vue'),
    },
    {
      path: '/github-daily/:id',
      name: 'github-daily-detail',
      component: () => import('@/views/GithubDailyDetail.vue'),
    },
  ],
})

export default router
