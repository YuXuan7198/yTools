<template>
  <aside class="sidebar">
    <div class="brand">
      <span class="brand-icon">🧰</span>
      <span class="brand-text">DevToolbox</span>
    </div>
    <div class="search-box">
      <input
        v-model="search"
        type="text"
        placeholder="搜索工具..."
        class="search-input"
      />
    </div>
    <nav class="tool-list">
      <button
        v-for="tool in filteredTools"
        :key="tool.id"
        class="tool-item"
        :class="{ active: tool.id === activeTool }"
        @click="$emit('select', tool.id)"
      >
        <span class="tool-icon">{{ tool.icon }}</span>
        <span class="tool-name">{{ tool.name }}</span>
      </button>
      <p v-if="filteredTools.length === 0" class="no-results">无匹配工具</p>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tools: { type: Array, required: true },
  activeTool: { type: String, required: true },
})

defineEmits(['select'])

const search = ref('')

const filteredTools = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.tools
  return props.tools.filter(t =>
    t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.sidebar {
  width: 200px;
  min-width: 200px;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
  user-select: none;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 16px 16px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.3px;
}

.brand-icon { font-size: 18px; }

.search-box { padding: 0 12px 12px; }

.search-input {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: border-color 120ms;
}

.search-input:focus { border-color: var(--accent); background: #fff; }
.search-input::placeholder { color: #c4b8a8; }

.tool-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text);
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: background 100ms;
}

.tool-item:hover { background: #ebe4d8; }

.tool-item.active {
  background: var(--bg);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.tool-icon { font-size: 15px; flex-shrink: 0; }

.no-results {
  padding: 16px 10px;
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}
</style>
