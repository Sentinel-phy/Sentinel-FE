<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    '/': 'Dashboard',
    '/sessions': 'Session Management',
    '/gpu': 'GPU Pool',
    '/metering': 'Metering & Billing',
    '/monitoring': 'Sim2Real Monitoring',
  }
  return map[route.path] || 'Sentinel'
})
</script>

<template>
  <header class="header">
    <div class="header-left">
      <h1 class="header-title">{{ pageTitle }}</h1>
    </div>
    <div class="header-right">
      <div class="header-status">
        <span class="status-dot"></span>
        <span class="status-text">Connected</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-secondary);
}

.header-title {
  font-size: 18px;
  font-weight: 700;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-green);
  border-radius: 50%;
}
</style>
