<template>
  <div class="app-shell">
    <Sidebar
      :tools="tools"
      :active-tool="activeTool"
      @select="activeTool = $event"
    />
    <main class="main-area">
      <ToolPanel
        :active-tool-id="activeTool"
        :tools="tools"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import ToolPanel from './components/ToolPanel.vue'

const tools = [
  { id: 'url',       name: 'URL 编解码',     icon: '🔗', placeholder: '输入要编码/解码的 URL 或文本...' },
  { id: 'json',      name: 'JSON 格式化',     icon: '📋', placeholder: '输入 JSON 字符串...' },
  { id: 'base64',    name: 'Base64 编解码',   icon: '🔐', placeholder: '输入要编码/解码的文本...' },
  { id: 'timestamp', name: '时间戳转换',      icon: '🕐', placeholder: '输入 Unix 时间戳或日期时间...' },
  { id: 'unicode',   name: 'Unicode 转换',    icon: '🔤', placeholder: '输入文本或 \\uXXXX 转义序列...' },
  { id: 'hash',      name: 'SHA 哈希',        icon: '🔒', placeholder: '输入要计算哈希的文本...' },
  { id: 'regex',     name: '正则测试',        icon: '🔍', placeholder: '输入测试文本...' },
]

const activeTool = ref('url')
</script>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
