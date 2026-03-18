import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Session } from '@/types'
import * as api from '@/api/sentinel'

export const useSessionStore = defineStore('session', () => {
  const sessions = ref<Session[]>([])
  const activeSessions = ref<Session[]>([])
  const loading = ref(false)

  async function loadAll() {
    loading.value = true
    try {
      const res = await api.fetchSessions()
      sessions.value = res.sessions
    } finally {
      loading.value = false
    }
  }

  async function loadActive() {
    const res = await api.fetchActiveSessions()
    activeSessions.value = res.sessions
  }

  async function create(userId: string, durationHours: number, environmentUsd?: string, forgeProjectId?: string) {
    const session = await api.createSession({
      user_id: userId,
      duration_hours: durationHours,
      environment_usd: environmentUsd,
      forge_project_id: forgeProjectId,
    })
    sessions.value.unshift(session)
    return session
  }

  async function pause(sessionId: string) {
    const updated = await api.pauseSession(sessionId)
    updateInList(updated)
    return updated
  }

  async function resume(sessionId: string) {
    const updated = await api.resumeSession(sessionId)
    updateInList(updated)
    return updated
  }

  async function terminate(sessionId: string) {
    const updated = await api.terminateSession(sessionId)
    updateInList(updated)
    return updated
  }

  function updateInList(session: Session) {
    const idx = sessions.value.findIndex(s => s.id === session.id)
    if (idx >= 0) sessions.value[idx] = session
  }

  return { sessions, activeSessions, loading, loadAll, loadActive, create, pause, resume, terminate }
})
