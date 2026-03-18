<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSessionStore } from '@/stores/session'
import type { SessionStatus } from '@/types'

const store = useSessionStore()

const showCreateDialog = ref(false)
const newSession = ref({
  userId: 'user_demo',
  durationHours: 2,
  environmentUsd: 'warehouse_30x20.usd',
  forgeProjectId: 'proj_demo',
})

onMounted(() => store.loadAll())

async function handleCreate() {
  await store.create(
    newSession.value.userId,
    newSession.value.durationHours,
    newSession.value.environmentUsd,
    newSession.value.forgeProjectId,
  )
  showCreateDialog.value = false
}

function statusBadgeClass(status: SessionStatus): string {
  const map: Record<string, string> = {
    RUNNING: 'badge-running',
    PENDING: 'badge-pending',
    INITIALIZING: 'badge-pending',
    PAUSED: 'badge-paused',
    TERMINATED: 'badge-terminated',
    TERMINATING: 'badge-terminated',
    FAILED: 'badge-failed',
  }
  return map[status] || ''
}

function formatDate(ts: string | null): string {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('ko-KR', {
    month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatCost(krw: number): string {
  return krw > 0 ? `₩${krw.toLocaleString()}` : '—'
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="page-title">Session Management</h2>
        <p class="page-subtitle">GPU session lifecycle management</p>
      </div>
      <button class="btn btn-primary" @click="showCreateDialog = true">+ New Session</button>
    </div>

    <!-- Create dialog -->
    <div v-if="showCreateDialog" class="card section">
      <h3 style="margin-bottom: 16px; font-size: 15px;">Create New Session</h3>
      <div class="form-row">
        <div class="form-group">
          <label>User ID</label>
          <input v-model="newSession.userId" />
        </div>
        <div class="form-group">
          <label>Duration (hours)</label>
          <input v-model.number="newSession.durationHours" type="number" min="1" max="8" />
        </div>
        <div class="form-group">
          <label>USD Environment</label>
          <select v-model="newSession.environmentUsd">
            <option value="warehouse_30x20.usd">Warehouse 30x20</option>
            <option value="factory_floor.usd">Factory Floor</option>
            <option value="assembly_line.usd">Assembly Line</option>
            <option value="logistics_hub.usd">Logistics Hub</option>
            <option value="default.usd">Default</option>
          </select>
        </div>
        <div class="form-group">
          <label>Forge Project ID</label>
          <input v-model="newSession.forgeProjectId" />
        </div>
      </div>
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <button class="btn btn-primary" @click="handleCreate">Create</button>
        <button class="btn btn-ghost" @click="showCreateDialog = false">Cancel</button>
      </div>
    </div>

    <!-- Session table -->
    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Session ID</th>
              <th>User</th>
              <th>Status</th>
              <th>GPU</th>
              <th>Duration</th>
              <th>Environment</th>
              <th>Cost</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in store.sessions" :key="session.id">
              <td style="font-family: monospace;">{{ session.id }}</td>
              <td>{{ session.userId }}</td>
              <td><span class="badge" :class="statusBadgeClass(session.status)">{{ session.status }}</span></td>
              <td>{{ session.gpuInstanceId || '—' }}</td>
              <td>{{ session.durationHours }}h</td>
              <td style="max-width: 140px; overflow: hidden; text-overflow: ellipsis;">{{ session.environmentUsd }}</td>
              <td>{{ formatCost(session.actualCostKrw || session.estimatedCostKrw) }}</td>
              <td>{{ formatDate(session.createdAt) }}</td>
              <td>
                <div style="display: flex; gap: 4px;">
                  <button
                    v-if="session.status === 'RUNNING'"
                    class="btn btn-ghost" style="padding: 4px 8px; font-size: 11px;"
                    @click="store.pause(session.id)"
                  >Pause</button>
                  <button
                    v-if="session.status === 'PAUSED'"
                    class="btn btn-ghost" style="padding: 4px 8px; font-size: 11px;"
                    @click="store.resume(session.id)"
                  >Resume</button>
                  <button
                    v-if="session.status === 'RUNNING' || session.status === 'PAUSED' || session.status === 'INITIALIZING'"
                    class="btn btn-danger" style="padding: 4px 8px; font-size: 11px;"
                    @click="store.terminate(session.id)"
                  >Terminate</button>
                </div>
              </td>
            </tr>
            <tr v-if="store.sessions.length === 0">
              <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 32px;">
                No sessions found. Create one to get started.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 160px;
}

.form-group label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}
</style>
