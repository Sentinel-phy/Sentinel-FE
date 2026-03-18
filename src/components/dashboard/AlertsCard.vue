<script setup lang="ts">
import type { Alert } from '@/types'

defineProps<{
  alerts: {
    total: number
    active: number
    warnings: number
    criticals: number
  }
  activeAlerts: Alert[]
}>()

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <span class="card-title">Alerts</span>
      <span v-if="alerts.criticals > 0" class="badge badge-critical">{{ alerts.criticals }} Critical</span>
    </div>
    <div class="stat-value" :style="{ color: alerts.active > 0 ? 'var(--accent-yellow)' : 'var(--accent-green)' }">
      {{ alerts.active }}
    </div>
    <div class="stat-label">Active Alerts</div>
    <div class="alert-list" v-if="activeAlerts.length > 0">
      <div v-for="alert in activeAlerts.slice(0, 3)" :key="alert.id" class="alert-item">
        <span class="alert-level" :class="'level-' + alert.level.toLowerCase()">
          {{ alert.level === 'CRITICAL' ? '!!' : '!' }}
        </span>
        <span class="alert-msg">{{ alert.message }}</span>
        <span class="alert-time">{{ formatTime(alert.timestamp) }}</span>
      </div>
    </div>
    <div v-else class="no-alerts">No active alerts</div>
  </div>
</template>

<style scoped>
.alert-list {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.alert-level {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 10px;
  flex-shrink: 0;
}

.level-warning { background: rgba(251, 191, 36, 0.2); color: var(--accent-yellow); }
.level-critical { background: rgba(248, 113, 113, 0.2); color: var(--accent-red); }
.level-info { background: rgba(79, 143, 247, 0.2); color: var(--accent-blue); }

.alert-msg {
  flex: 1;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.alert-time {
  color: var(--text-muted);
  flex-shrink: 0;
}

.no-alerts {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-muted);
}
</style>
