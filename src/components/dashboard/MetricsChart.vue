<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { MeteringRecord } from '@/types'

const props = defineProps<{
  metrics: MeteringRecord[]
}>()

const chartOption = computed(() => {
  const data = props.metrics.slice(-30)
  const timestamps = data.map((r) =>
    new Date(r.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  )
  const utilization = data.map((r) => r.gpuUtilization)
  const vram = data.map((r) => r.vramUsedGb)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e2130',
      borderColor: '#2a2d3e',
      textStyle: { color: '#e4e6f0', fontSize: 12 },
    },
    legend: {
      data: ['GPU Utilization (%)', 'VRAM (GB)'],
      textStyle: { color: '#9ca0b8', fontSize: 11 },
      top: 0,
    },
    grid: { left: 50, right: 50, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: timestamps,
      axisLine: { lineStyle: { color: '#2a2d3e' } },
      axisLabel: { color: '#6b6f85', fontSize: 10, rotate: 30 },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Utilization %',
        nameTextStyle: { color: '#6b6f85', fontSize: 10 },
        axisLine: { lineStyle: { color: '#2a2d3e' } },
        axisLabel: { color: '#6b6f85', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1a1d27' } },
        max: 100,
      },
      {
        type: 'value',
        name: 'VRAM GB',
        nameTextStyle: { color: '#6b6f85', fontSize: 10 },
        axisLine: { lineStyle: { color: '#2a2d3e' } },
        axisLabel: { color: '#6b6f85', fontSize: 10 },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'GPU Utilization (%)',
        type: 'line',
        data: utilization,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#4f8ff7', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(79,143,247,0.3)' },
              { offset: 1, color: 'rgba(79,143,247,0)' },
            ],
          },
        },
      },
      {
        name: 'VRAM (GB)',
        type: 'line',
        yAxisIndex: 1,
        data: vram,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#a78bfa', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(167,139,250,0.2)' },
              { offset: 1, color: 'rgba(167,139,250,0)' },
            ],
          },
        },
      },
    ],
  }
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <span class="card-title">GPU Metrics (Real-time)</span>
    </div>
    <div class="chart-wrapper">
      <VChart :option="chartOption" autoresize style="height: 280px" />
    </div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
}
</style>
