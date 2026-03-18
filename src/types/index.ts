// Session types
export type SessionStatus = 'PENDING' | 'INITIALIZING' | 'RUNNING' | 'PAUSED' | 'TERMINATING' | 'TERMINATED' | 'FAILED'

export interface Session {
  id: string
  userId: string
  gpuInstanceId: string | null
  forgeProjectId: string | null
  environmentUsd: string
  durationHours: number
  status: SessionStatus
  webrtcUrl: string | null
  estimatedCostKrw: number
  actualCostKrw: number
  createdAt: string
  startedAt: string | null
  terminatedAt: string | null
  peakGpuUtilization: number
  peakVramGb: number
  totalGpuSeconds: number
}

// GPU types
export type GpuInstanceStatus = 'AVAILABLE' | 'ALLOCATED' | 'MAINTENANCE' | 'OFFLINE'

export interface GpuInstance {
  id: string
  name: string
  gpuModel: string
  vramGb: number
  provider: string
  hourlyRateUsd: number
  status: GpuInstanceStatus
  gpuUtilization: number
  vramUsedGb: number
  currentSessionId: string | null
  createdAt: string
}

// Metering types
export interface MeteringRecord {
  id: string
  sessionId: string
  gpuInstanceId: string
  gpuUtilization: number
  vramUsedGb: number
  gpuTempCelsius: number
  powerWatts: number
  timestamp: string
}

// Monitoring types
export interface Sim2RealComparison {
  id: string
  sessionId: string
  forgeProjectId: string
  predictedThroughput: number
  predictedGapPercent: number
  predictionConfidence: number
  actualThroughput: number
  actualGapPercent: number
  driftPercent: number
  driftStatus: 'NORMAL' | 'WARNING' | 'CRITICAL'
  timestamp: string
}

export type AlertLevel = 'INFO' | 'WARNING' | 'CRITICAL'

export interface Alert {
  id: string
  sessionId: string
  level: AlertLevel
  category: string
  message: string
  acknowledged: boolean
  timestamp: string
}

// Billing types
export interface BillingPlan {
  id: string
  name: string
  monthlyFeeKrw: number
  includedHours: number
  hourlyRateKrw: number
  priorityAllocation: boolean
  monitoringEnabled: boolean
}

export interface BillingSummary {
  userId: string
  plan: string
  monthlyFeeKrw: number
  includedHours: number
  usedHours: number
  remainingIncludedHours: number
  extraHours: number
  totalCostKrw: number
}

// Dashboard aggregate
export interface DashboardData {
  gpu: {
    total: number
    available: number
    allocated: number
    avgUtilization: number
    instances: GpuInstance[]
  }
  sessions: {
    totalSessions: number
    activeSessions: number
    pendingSessions: number
    terminatedSessions: number
    gpuTotal: number
    gpuAvailable: number
    gpuAllocated: number
    gpuAvgUtilization: number
  }
  metering: {
    totalRecords: number
    recentAvgUtilization?: number
    recentAvgVramGb?: number
  }
  recentMetrics: MeteringRecord[]
  sim2real: {
    totalComparisons: number
    avgDriftPercent?: number
    maxDriftPercent?: number
    normalCount?: number
    warningCount?: number
    criticalCount?: number
  }
  recentComparisons: Sim2RealComparison[]
  alerts: {
    total: number
    active: number
    warnings: number
    criticals: number
  }
  activeAlerts: Alert[]
}
