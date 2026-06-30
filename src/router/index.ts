import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
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
  ],
})

export default router
