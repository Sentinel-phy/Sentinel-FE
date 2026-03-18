<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import VChart from 'vue-echarts'
import { fetchDriftSummary, fetchRecentComparisons, fetchAlerts, acknowledgeAlert } from '@/api/sentinel'
import type { Sim2RealComparison, Alert } from '@/types'

const comparisons = ref<Sim2RealComparison[]>([])
const alerts = ref<Alert[]>([])
const driftSummary = ref<any>(null)

onMounted(async () => {
  const [driftRes, compRes, alertRes] = await Promise.all([
    fetchDriftSummary(),
    fetchRecentComparisons(30),
    fetchAlerts(true),
  ])
  driftSummary.value = driftRes
  comparisons.value = compRes.comparisons
  alerts.value = alertRes.alerts
})

async function handleAcknowledge(alertId: string) {
  await acknowledgeAlert(alertId)
  const idx = alerts.value.findIndex(a => a.id === alertId)
  if (idx >= 0) alerts.value[idx].acknowledged = true
}

function driftStatusClass(status: string): string {
  return 'badge-' + status.toLowerCase()
}

const driftChart = computed(() => {
  const data = comparisons.value
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e2130', borderColor: '#2a2d3e', textStyle: { color: '#e4e6f0', fontSize: 12 } },
    legend: { data: ['Predicted Gap', 'Actual Gap', 'Drift'], textStyle: { color: '#9ca0b8', fontSize: 11 }, top: 0 },
    grid: { left: 50, right: 50, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: data.map(c => c.id),
      axisLine: { lineStyle: { color: '#2a2d3e' } },
      axisLabel: { color: '#6b6f85', fontSize: 10, rotate: 30 },
    },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#2a2d3e' } }, axisLabel: { color: '#6b6f85', fontSize: 10 }, splitLine: { lineStyle: { color: '#1a1d27' } } },
    series: [
      { name: 'Predicted Gap', type: 'line', data: data.map(c => c.predictedGapPercent), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#4f8ff7', width: 2 }, itemStyle: { color: '#4f8ff7' } },
      { name: 'Actual Gap', type: 'line', data: data.map(c => c.actualGapPercent), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#34d399', width: 2 }, itemStyle: { color: '#34d399' } },
      { name: 'Drift', type: 'bar', data: data.map(c => c.driftPercent), barWidth: 8, itemStyle: { color: (params: any) => { const v = params.data; return v > 5 ? '#f87171' : v > 2 ? '#fbbf24' : '#34d399' }, borderRadius: [3, 3, 0, 0] } },
    ],
  }
})

function formatTime(ts: string): string {
  return new Date(ts).toLocaleString('ko-KR', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="page-title">Sim2Real Monitoring</h2>
        <p class="page-subtitle">LSTM prediction vs actual performance tracking</p>
      </div>
    </div>

    <!-- Drift summary -->
    <div class="grid-4 section" v-if="driftSummary">
      <div class="card">
        <div class="card-title" style="margin-bottom: 8px;">Average Drift</div>
        <div class="stat-value">{{ driftSummary.avgDriftPercent?.toFixed(1) ?? '—' }}%</div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom: 8px;">Max Drift</div>
        <div class="stat-value" style="color: var(--accent-yellow)">{{ driftSummary.maxDriftPercent?.toFixed(1) ?? '—' }}%</div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom: 8px;">Normal</div>
        <div class="stat-value" style="color: var(--accent-green)">{{ driftSummary.normalCount ?? 0 }}</div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom: 8px;">Critical</div>
        <div class="stat-value" style="color: var(--accent-red)">{{ driftSummary.criticalCount ?? 0 }}</div>
      </div>
    </div>

    <!-- Drift chart -->
    <div class="card section">
      <div class="card-header"><span class="card-title">Sim2Real Gap Comparison</span></div>
      <VChart :option="driftChart" autoresize style="height: 320px" />
    </div>

    <!-- Comparisons table -->
    <div class="card section">
      <div class="card-header"><span class="card-title">Recent Comparisons</span></div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Session</th>
              <th>Predicted</th>
              <th>Actual</th>
              <th>Predicted Gap</th>
              <th>Actual Gap</th>
              <th>Drift</th>
              <th>Confidence</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in comparisons" :key="c.id">
              <td style="font-family: monospace;">{{ c.id }}</td>
              <td style="font-family: monospace;">{{ c.sessionId }}</td>
              <td>{{ c.predictedThroughput.toFixed(1) }}</td>
              <td>{{ c.actualThroughput.toFixed(1) }}</td>
              <td>{{ c.predictedGapPercent.toFixed(1) }}%</td>
              <td>{{ c.actualGapPercent.toFixed(1) }}%</td>
              <td style="font-weight: 600;">{{ c.driftPercent.toFixed(1) }}%</td>
              <td>{{ c.predictionConfidence.toFixed(2) }}</td>
              <td><span class="badge" :class="driftStatusClass(c.driftStatus)">{{ c.driftStatus }}</span></td>
              <td>{{ formatTime(c.timestamp) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Alerts -->
    <div class="card">
      <div class="card-header"><span class="card-title">Alert History</span></div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Category</th>
              <th>Message</th>
              <th>Session</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.id">
              <td><span class="badge" :class="'badge-' + alert.level.toLowerCase()">{{ alert.level }}</span></td>
              <td>{{ alert.category }}</td>
              <td>{{ alert.message }}</td>
              <td style="font-family: monospace;">{{ alert.sessionId }}</td>
              <td>{{ formatTime(alert.timestamp) }}</td>
              <td>
                <button
                  v-if="!alert.acknowledged"
                  class="btn btn-ghost" style="padding: 3px 8px; font-size: 11px;"
                  @click="handleAcknowledge(alert.id)"
                >Acknowledge</button>
                <span v-else style="color: var(--text-muted); font-size: 11px;">Resolved</span>
              </td>
            </tr>
            <tr v-if="alerts.length === 0">
              <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No alerts</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
