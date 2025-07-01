// @ts-ignore
import { createRouter, createWebHistory } from 'vue-router'
// @ts-ignore
import type { RouteRecordRaw } from 'vue-router'
// 配置路由信息
const routes: RouteRecordRaw[] = [
  {
    name: 'main',
    path: '/',
    component: () => import('/@/views/main.vue'),
    children: [],
  },
  {
    name: 'pick',
    path: '/pick',
    component: () => import('/@/views/pick/index.vue'),
    children: [],
  },
  {
    name: 'error',
    path: '/error',
    component: () => import('/@/views/error.vue'),
  }
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router
