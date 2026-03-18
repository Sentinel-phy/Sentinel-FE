<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchGpuPool } from '@/api/sentinel'
import type { GpuInstance } from '@/types'

const pool = ref<{
  instances: GpuInstance[]
  total: number
  available: number
  allocated: number
  avgUtilization: number
} | null>(null)

onMounted(async () => {
  pool.value = await fetchGpuPool()
})

function statusClass(status: string): string {
  const map: Record<string, string> = {
    AVAILABLE: 'badge-available',
    ALLOCATED: 'badge-allocated',
    MAINTENANCE: 'badge-warning',
    OFFLINE: 'badge-failed',
  }
  return map[status] || ''
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="page-title">GPU Pool</h2>
        <p class="page-subtitle">Physical AI GPU infrastructure status</p>
      </div>
      <button class="btn btn-ghost" @click="fetchGpuPool().then(d => pool = d)">Refresh</button>
    </div>

    <template v-if="pool">
      <!-- Summary -->
      <div class="grid-4 section">
        <div class="card">
          <div class="card-title" style="margin-bottom: 8px;">Total Instances</div>
          <div class="stat-value">{{ pool.total }}</div>
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom: 8px;">Available</div>
          <div class="stat-value" style="color: var(--accent-green)">{{ pool.available }}</div>
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom: 8px;">Allocated</div>
          <div class="stat-value" style="color: var(--accent-blue)">{{ pool.allocated }}</div>
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom: 8px;">Avg Utilization</div>
          <div class="stat-value">{{ pool.avgUtilization }}%</div>
        </div>
      </div>

      <!-- Instance cards -->
      <div class="grid-3">
        <div v-for="gpu in pool.instances" :key="gpu.id" class="card gpu-card">
          <div class="card-header">
            <span style="font-weight: 700; font-size: 14px;">{{ gpu.name }}</span>
            <span class="badge" :class="statusClass(gpu.status)">{{ gpu.status }}</span>
          </div>
          <div class="gpu-detail">
            <div class="gpu-detail-row">
              <span>GPU</span>
              <span>{{ gpu.gpuModel }}</span>
            </div>
            <div class="gpu-detail-row">
              <span>VRAM</span>
              <span>{{ gpu.vramUsedGb.toFixed(1) }} / {{ gpu.vramGb }} GB</span>
            </div>
            <div class="gpu-detail-row">
              <span>Utilization</span>
              <span>{{ gpu.gpuUtilization.toFixed(1) }}%</span>
            </div>
            <div class="gpu-detail-row">
              <span>Provider</span>
              <span>{{ gpu.provider }}</span>
            </div>
            <div class="gpu-detail-row">
              <span>Rate</span>
              <span>${{ gpu.hourlyRateUsd }}/hr</span>
            </div>
            <div class="gpu-detail-row" v-if="gpu.currentSessionId">
              <span>Session</span>
              <span style="font-family: monospace; color: var(--accent-blue);">{{ gpu.currentSessionId }}</span>
            </div>
          </div>
          <!-- Utilization bar -->
          <div class="util-bar-bg">
            <div class="util-bar-fill" :style="{ width: gpu.gpuUtilization + '%' }"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.gpu-card {
  display: flex;
  flex-direction: column;
}

.gpu-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.gpu-detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.gpu-detail-row span:first-child {
  color: var(--text-muted);
}

.util-bar-bg {
  height: 4px;
  background: var(--bg-secondary);
  border-radius: 2px;
  overflow: hidden;
}

.util-bar-fill {
  height: 100%;
  background: var(--accent-blue);
  border-radius: 2px;
  transition: width 0.5s;
}
</style>
