<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import GpuMetricsCard from '@/components/dashboard/GpuMetricsCard.vue'
import SessionStatsCard from '@/components/dashboard/SessionStatsCard.vue'
import Sim2RealCard from '@/components/dashboard/Sim2RealCard.vue'
import AlertsCard from '@/components/dashboard/AlertsCard.vue'
import MetricsChart from '@/components/dashboard/MetricsChart.vue'
import RecentSessionsCard from '@/components/dashboard/RecentSessionsCard.vue'

const store = useDashboardStore()

onMounted(() => store.startAutoRefresh(5000))
onUnmounted(() => store.stopAutoRefresh())
</script>

<template>
  <div class="dashboard">
    <div v-if="store.error" class="error-banner">
      {{ store.error }}
      <button class="btn btn-ghost" @click="store.load()">Retry</button>
    </div>

    <template v-if="store.data">
      <!-- Top stat cards -->
      <div class="grid-4 section">
        <GpuMetricsCard :gpu="store.data.gpu" />
        <SessionStatsCard :sessions="store.data.sessions" />
        <Sim2RealCard :sim2real="store.data.sim2real" />
        <AlertsCard :alerts="store.data.alerts" :activeAlerts="store.data.activeAlerts" />
      </div>

      <!-- Charts -->
      <div class="grid-2 section">
        <MetricsChart :metrics="store.data.recentMetrics" />
        <RecentSessionsCard :comparisons="store.data.recentComparisons" />
      </div>
    </template>

    <div v-else-if="store.loading" class="loading">Loading dashboard...</div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1400px;
}

.error-banner {
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid var(--accent-red);
  border-radius: var(--radius);
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--accent-red);
  font-size: 13px;
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
  font-size: 14px;
}
</style>
