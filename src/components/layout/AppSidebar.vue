<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/', label: 'Dashboard', icon: '&#9632;' },
  { path: '/sessions', label: 'Sessions', icon: '&#9654;' },
  { path: '/gpu', label: 'GPU Pool', icon: '&#9881;' },
  { path: '/metering', label: 'Metering', icon: '&#9783;' },
  { path: '/monitoring', label: 'Monitoring', icon: '&#9673;' },
]
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-icon">S</div>
      <div class="brand-text">
        <span class="brand-name">Sentinel</span>
        <span class="brand-version">v1.0</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: route.path === item.path }"
      >
        <span class="nav-icon" v-html="item.icon"></span>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="footer-label">Talos Platform</div>
      <div class="footer-sub">Physical AI Infrastructure</div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 16px 0;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 20px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: var(--accent-blue);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  color: #fff;
}

.brand-name {
  font-weight: 700;
  font-size: 16px;
  display: block;
}

.brand-version {
  font-size: 11px;
  color: var(--text-muted);
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
  text-decoration: none;
}

.nav-item:hover {
  background: var(--bg-card);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(79, 143, 247, 0.12);
  color: var(--accent-blue);
}

.nav-icon {
  font-size: 14px;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 16px 20px 0;
  border-top: 1px solid var(--border);
  margin-top: 16px;
}

.footer-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

.footer-sub {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 2px;
}
</style>
