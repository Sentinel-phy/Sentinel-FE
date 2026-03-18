import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardData } from '@/types'
import { fetchDashboard } from '@/api/sentinel'

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<DashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  let refreshTimer: ReturnType<typeof setInterval> | null = null

  async function load() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetchDashboard()
    } catch (e: any) {
      error.value = e.message || 'Failed to load dashboard'
    } finally {
      loading.value = false
    }
  }

  function startAutoRefresh(intervalMs: number = 5000) {
    stopAutoRefresh()
    load()
    refreshTimer = setInterval(load, intervalMs)
  }

  function stopAutoRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  return { data, loading, error, load, startAutoRefresh, stopAutoRefresh }
})
