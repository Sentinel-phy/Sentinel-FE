<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import VChart from 'vue-echarts'
import { fetchRecentMetrics, fetchBillingSummary, fetchBillingPlans } from '@/api/sentinel'
import type { MeteringRecord, BillingPlan, BillingSummary } from '@/types'

const metrics = ref<MeteringRecord[]>([])
const billing = ref<BillingSummary | null>(null)
const plans = ref<BillingPlan[]>([])

onMounted(async () => {
  const [metricsRes, billingRes, plansRes] = await Promise.all([
    fetchRecentMetrics(100),
    fetchBillingSummary('user_demo'),
    fetchBillingPlans(),
  ])
  metrics.value = metricsRes.records
  billing.value = billingRes
  plans.value = plansRes.plans
})

const utilizationChart = computed(() => {
  const data = metrics.value.slice(-50)
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e2130', borderColor: '#2a2d3e', textStyle: { color: '#e4e6f0', fontSize: 12 } },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: data.map(r => new Date(r.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
      axisLine: { lineStyle: { color: '#2a2d3e' } },
      axisLabel: { color: '#6b6f85', fontSize: 10, rotate: 30 },
    },
    yAxis: { type: 'value', max: 100, axisLine: { lineStyle: { color: '#2a2d3e' } }, axisLabel: { color: '#6b6f85', fontSize: 10 }, splitLine: { lineStyle: { color: '#1a1d27' } } },
    series: [{
      type: 'line',
      data: data.map(r => r.gpuUtilization),
      smooth: true,
      symbol: 'none',
      lineStyle: { color: '#4f8ff7', width: 2 },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(79,143,247,0.3)' }, { offset: 1, color: 'rgba(79,143,247,0)' }] } },
    }],
  }
})

const tempPowerChart = computed(() => {
  const data = metrics.value.slice(-50)
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e2130', borderColor: '#2a2d3e', textStyle: { color: '#e4e6f0', fontSize: 12 } },
    legend: { data: ['Temperature', 'Power'], textStyle: { color: '#9ca0b8', fontSize: 11 }, top: 0 },
    grid: { left: 50, right: 50, top: 30, bottom: 30 },
    xAxis: {
      type: 'category',
      data: data.map(r => new Date(r.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
      axisLine: { lineStyle: { color: '#2a2d3e' } },
      axisLabel: { color: '#6b6f85', fontSize: 10, rotate: 30 },
    },
    yAxis: [
      { type: 'value', name: 'Temp', axisLine: { lineStyle: { color: '#2a2d3e' } }, axisLabel: { color: '#6b6f85', fontSize: 10 }, splitLine: { lineStyle: { color: '#1a1d27' } } },
      { type: 'value', name: 'Watts', axisLine: { lineStyle: { color: '#2a2d3e' } }, axisLabel: { color: '#6b6f85', fontSize: 10 }, splitLine: { show: false } },
    ],
    series: [
      { name: 'Temperature', type: 'line', data: data.map(r => r.gpuTempCelsius), smooth: true, symbol: 'none', lineStyle: { color: '#f87171', width: 2 } },
      { name: 'Power', type: 'line', yAxisIndex: 1, data: data.map(r => r.powerWatts), smooth: true, symbol: 'none', lineStyle: { color: '#fbbf24', width: 2 } },
    ],
  }
})
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="page-title">Metering & Billing</h2>
        <p class="page-subtitle">GPU usage tracking and cost management</p>
      </div>
    </div>

    <!-- Billing summary -->
    <div class="grid-4 section" v-if="billing">
      <div class="card">
        <div class="card-title" style="margin-bottom: 8px;">Plan</div>
        <div class="stat-value">{{ billing.plan }}</div>
        <div class="stat-label">{{ billing.monthlyFeeKrw.toLocaleString() }} / month</div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom: 8px;">Used Hours</div>
        <div class="stat-value">{{ billing.usedHours }}h</div>
        <div class="stat-label">of {{ billing.includedHours }}h included</div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom: 8px;">Extra Hours</div>
        <div class="stat-value" :style="{ color: billing.extraHours > 0 ? 'var(--accent-yellow)' : 'var(--accent-green)' }">
          {{ billing.extraHours }}h
        </div>
        <div class="stat-label">overage this month</div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom: 8px;">Total Cost</div>
        <div class="stat-value">{{ billing.totalCostKrw.toLocaleString() }}</div>
        <div class="stat-label">KRW this month</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid-2 section">
      <div class="card">
        <div class="card-header"><span class="card-title">GPU Utilization</span></div>
        <VChart :option="utilizationChart" autoresize style="height: 260px" />
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Temperature & Power</span></div>
        <VChart :option="tempPowerChart" autoresize style="height: 260px" />
      </div>
    </div>

    <!-- Billing plans -->
    <div class="card section">
      <div class="card-header"><span class="card-title">Available Plans</span></div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Plan</th>
              <th>Monthly Fee</th>
              <th>Included Hours</th>
              <th>Hourly Rate</th>
              <th>Priority</th>
              <th>Monitoring</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plan in plans" :key="plan.id">
              <td style="font-weight: 600;">{{ plan.name }}</td>
              <td>{{ plan.monthlyFeeKrw.toLocaleString() }}</td>
              <td>{{ plan.includedHours }}h</td>
              <td>{{ plan.hourlyRateKrw.toLocaleString() }}/h</td>
              <td><span :class="plan.priorityAllocation ? 'badge badge-running' : 'badge badge-terminated'">{{ plan.priorityAllocation ? 'Yes' : 'No' }}</span></td>
              <td><span :class="plan.monitoringEnabled ? 'badge badge-running' : 'badge badge-terminated'">{{ plan.monitoringEnabled ? 'Yes' : 'No' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
