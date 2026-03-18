<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { Sim2RealComparison } from '@/types'

const props = defineProps<{
  comparisons: Sim2RealComparison[]
}>()

const chartOption = computed(() => {
  const data = props.comparisons
  const labels = data.map((c) => c.id)
  const predicted = data.map((c) => c.predictedThroughput)
  const actual = data.map((c) => c.actualThroughput)
  const drift = data.map((c) => c.driftPercent)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e2130',
      borderColor: '#2a2d3e',
      textStyle: { color: '#e4e6f0', fontSize: 12 },
    },
    legend: {
      data: ['Predicted', 'Actual', 'Drift %'],
      textStyle: { color: '#9ca0b8', fontSize: 11 },
      top: 0,
    },
    grid: { left: 50, right: 50, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: '#2a2d3e' } },
      axisLabel: { color: '#6b6f85', fontSize: 10, rotate: 30 },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Throughput',
        nameTextStyle: { color: '#6b6f85', fontSize: 10 },
        axisLine: { lineStyle: { color: '#2a2d3e' } },
        axisLabel: { color: '#6b6f85', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1a1d27' } },
      },
      {
        type: 'value',
        name: 'Drift %',
        nameTextStyle: { color: '#6b6f85', fontSize: 10 },
        axisLine: { lineStyle: { color: '#2a2d3e' } },
        axisLabel: { color: '#6b6f85', fontSize: 10 },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Predicted',
        type: 'bar',
        data: predicted,
        barWidth: 12,
        itemStyle: { color: '#4f8ff7', borderRadius: [3, 3, 0, 0] },
      },
      {
        name: 'Actual',
        type: 'bar',
        data: actual,
        barWidth: 12,
        itemStyle: { color: '#34d399', borderRadius: [3, 3, 0, 0] },
      },
      {
        name: 'Drift %',
        type: 'line',
        yAxisIndex: 1,
        data: drift,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#fbbf24', width: 2 },
        itemStyle: { color: '#fbbf24' },
      },
    ],
  }
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <span class="card-title">Sim2Real Comparisons</span>
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
