<script setup lang="ts">
import type { GpuInstance } from '@/types'

defineProps<{
  gpu: {
    total: number
    available: number
    allocated: number
    avgUtilization: number
    instances: GpuInstance[]
  }
}>()
</script>

<template>
  <div class="card">
    <div class="card-header">
      <span class="card-title">GPU Infrastructure</span>
      <span class="badge badge-running">Live</span>
    </div>
    <div class="stat-value">{{ gpu.avgUtilization }}%</div>
    <div class="stat-label">Average Utilization</div>
    <div class="gpu-stats">
      <div class="gpu-stat">
        <span class="gpu-stat-value">{{ gpu.allocated }}</span>
        <span class="gpu-stat-label">Allocated</span>
      </div>
      <div class="gpu-stat">
        <span class="gpu-stat-value">{{ gpu.available }}</span>
        <span class="gpu-stat-label">Available</span>
      </div>
      <div class="gpu-stat">
        <span class="gpu-stat-value">{{ gpu.total }}</span>
        <span class="gpu-stat-label">Total</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gpu-stats {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.gpu-stat {
  display: flex;
  flex-direction: column;
}

.gpu-stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent-blue);
}

.gpu-stat-label {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
