import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: () => import('@/views/SessionsView.vue'),
    },
    {
      path: '/metering',
      name: 'metering',
      component: () => import('@/views/MeteringView.vue'),
    },
    {
      path: '/monitoring',
      name: 'monitoring',
      component: () => import('@/views/MonitoringView.vue'),
    },
    {
      path: '/gpu',
      name: 'gpu',
      component: () => import('@/views/GpuPoolView.vue'),
    },
  ],
})

export default router
