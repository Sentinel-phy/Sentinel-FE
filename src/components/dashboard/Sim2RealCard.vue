<script setup lang="ts">
defineProps<{
  sim2real: {
    totalComparisons: number
    avgDriftPercent?: number
    maxDriftPercent?: number
    normalCount?: number
    warningCount?: number
    criticalCount?: number
  }
}>()

function getDriftColor(drift?: number): string {
  if (!drift) return 'var(--text-primary)'
  if (drift <= 2) return 'var(--accent-green)'
  if (drift <= 5) return 'var(--accent-yellow)'
  return 'var(--accent-red)'
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <span class="card-title">Sim2Real</span>
    </div>
    <div class="stat-value" :style="{ color: getDriftColor(sim2real.avgDriftPercent) }">
      {{ sim2real.avgDriftPercent?.toFixed(1) ?? '—' }}%
    </div>
    <div class="stat-label">Average Drift</div>
    <div class="drift-stats">
      <div class="drift-stat">
        <span class="drift-stat-value" style="color: var(--accent-green)">{{ sim2real.normalCount ?? 0 }}</span>
        <span class="drift-stat-label">Normal</span>
      </div>
      <div class="drift-stat">
        <span class="drift-stat-value" style="color: var(--accent-yellow)">{{ sim2real.warningCount ?? 0 }}</span>
        <span class="drift-stat-label">Warning</span>
      </div>
      <div class="drift-stat">
        <span class="drift-stat-value" style="color: var(--accent-red)">{{ sim2real.criticalCount ?? 0 }}</span>
        <span class="drift-stat-label">Critical</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drift-stats {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.drift-stat {
  display: flex;
  flex-direction: column;
}

.drift-stat-value {
  font-size: 18px;
  font-weight: 700;
}

.drift-stat-label {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
