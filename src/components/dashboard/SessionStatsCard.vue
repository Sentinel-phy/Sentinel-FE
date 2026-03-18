<script setup lang="ts">
defineProps<{
  sessions: {
    totalSessions: number
    activeSessions: number
    pendingSessions: number
    terminatedSessions: number
  }
}>()
</script>

<template>
  <div class="card">
    <div class="card-header">
      <span class="card-title">Sessions</span>
    </div>
    <div class="stat-value" :style="{ color: sessions.activeSessions > 0 ? 'var(--accent-green)' : 'var(--text-primary)' }">
      {{ sessions.activeSessions }}
    </div>
    <div class="stat-label">Active Sessions</div>
    <div class="session-stats">
      <div class="session-stat">
        <span class="session-stat-value">{{ sessions.pendingSessions }}</span>
        <span class="session-stat-label">Pending</span>
      </div>
      <div class="session-stat">
        <span class="session-stat-value">{{ sessions.terminatedSessions }}</span>
        <span class="session-stat-label">Terminated</span>
      </div>
      <div class="session-stat">
        <span class="session-stat-value">{{ sessions.totalSessions }}</span>
        <span class="session-stat-label">Total</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.session-stats {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.session-stat {
  display: flex;
  flex-direction: column;
}

.session-stat-value {
  font-size: 18px;
  font-weight: 700;
}

.session-stat-label {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
