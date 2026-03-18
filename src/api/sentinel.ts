import axios from 'axios'
import type { Session, GpuInstance, MeteringRecord, Sim2RealComparison, Alert, BillingPlan, BillingSummary, DashboardData } from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Dashboard
export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await api.get('/dashboard')
  return data
}

// Health
export async function fetchHealth() {
  const { data } = await api.get('/health')
  return data
}

// Sessions
export async function fetchSessions(userId?: string): Promise<{ sessions: Session[]; count: number }> {
  const params = userId ? { userId } : {}
  const { data } = await api.get('/session', { params })
  return data
}

export async function fetchActiveSessions(): Promise<{ sessions: Session[]; count: number }> {
  const { data } = await api.get('/session/active')
  return data
}

export async function fetchSessionStats() {
  const { data } = await api.get('/session/stats')
  return data
}

export async function fetchSession(sessionId: string): Promise<Session> {
  const { data } = await api.get(`/session/${sessionId}`)
  return data
}

export async function createSession(params: {
  user_id: string
  duration_hours: number
  environment_usd?: string
  forge_project_id?: string
}): Promise<Session> {
  const { data } = await api.post('/session/create', params)
  return data
}

export async function pauseSession(sessionId: string): Promise<Session> {
  const { data } = await api.post(`/session/${sessionId}/pause`)
  return data
}

export async function resumeSession(sessionId: string): Promise<Session> {
  const { data } = await api.post(`/session/${sessionId}/resume`)
  return data
}

export async function terminateSession(sessionId: string): Promise<Session> {
  const { data } = await api.post(`/session/${sessionId}/terminate`)
  return data
}

// GPU Pool
export async function fetchGpuPool(): Promise<{
  instances: GpuInstance[]
  total: number
  available: number
  allocated: number
  avgUtilization: number
}> {
  const { data } = await api.get('/gpu')
  return data
}

// Metering
export async function fetchMeteringStats() {
  const { data } = await api.get('/metering/stats')
  return data
}

export async function fetchRecentMetrics(limit: number = 50): Promise<{ records: MeteringRecord[]; count: number }> {
  const { data } = await api.get('/metering/recent', { params: { limit } })
  return data
}

export async function fetchSessionMetrics(sessionId: string): Promise<{ records: MeteringRecord[]; count: number }> {
  const { data } = await api.get(`/metering/session/${sessionId}`)
  return data
}

export async function fetchBillingSummary(userId: string): Promise<BillingSummary> {
  const { data } = await api.get('/metering/billing', { params: { userId } })
  return data
}

export async function fetchBillingPlans(): Promise<{ plans: BillingPlan[] }> {
  const { data } = await api.get('/metering/plans')
  return data
}

// Monitoring
export async function fetchDriftSummary() {
  const { data } = await api.get('/monitoring/drift')
  return data
}

export async function fetchRecentComparisons(limit: number = 20): Promise<{ comparisons: Sim2RealComparison[]; count: number }> {
  const { data } = await api.get('/monitoring/comparisons', { params: { limit } })
  return data
}

export async function fetchAlerts(all: boolean = false): Promise<{ alerts: Alert[]; count: number }> {
  const { data } = await api.get('/monitoring/alerts', { params: { all: all ? 'true' : undefined } })
  return data
}

export async function acknowledgeAlert(alertId: string): Promise<Alert> {
  const { data } = await api.post(`/monitoring/alerts/${alertId}/acknowledge`)
  return data
}

export async function submitComparison(params: {
  session_id: string
  forge_project_id?: string
  lstm_prediction: { throughput: number; gap_percent: number; confidence: number }
  actual_performance: { throughput: number; measured_gap: number }
}): Promise<Sim2RealComparison> {
  const { data } = await api.post('/monitoring/compare', params)
  return data
}
