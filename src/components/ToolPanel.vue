<template>
  <div class="tool-panel">
    <header class="tool-header">
      <h2 class="tool-title">{{ currentTool.icon }} {{ currentTool.name }}</h2>
    </header>

    <div class="io-area">
      <div class="io-pane">
        <label class="io-label">输入</label>
        <textarea
          v-model="input"
          class="io-textarea"
          :placeholder="currentTool.placeholder"
          spellcheck="false"
        ></textarea>
      </div>
      <div class="io-pane">
        <label class="io-label">输出</label>
        <textarea
          :value="output"
          class="io-textarea output-area"
          placeholder="结果将实时显示..."
          readonly
          spellcheck="false"
        ></textarea>
      </div>
    </div>

    <footer class="tool-footer">
      <div class="footer-left">
        <!-- URL mode toggle -->
        <template v-if="activeToolId === 'url'">
          <button class="btn" :class="{ 'btn-active': urlMode === 'encode' }" @click="urlMode = 'encode'">🔒 编码</button>
          <button class="btn" :class="{ 'btn-active': urlMode === 'decode' }" @click="urlMode = 'decode'">🔓 解码</button>
        </template>

        <!-- JSON mode toggle -->
        <template v-if="activeToolId === 'json'">
          <button class="btn" :class="{ 'btn-active': jsonMode === 'format' }" @click="jsonMode = 'format'">📐 展开</button>
          <button class="btn" :class="{ 'btn-active': jsonMode === 'compress' }" @click="jsonMode = 'compress'">📦 压缩</button>
        </template>

        <!-- Base64 mode toggle -->
        <template v-if="activeToolId === 'base64'">
          <button class="btn" :class="{ 'btn-active': base64Mode === 'encode' }" @click="base64Mode = 'encode'">🔒 编码</button>
          <button class="btn" :class="{ 'btn-active': base64Mode === 'decode' }" @click="base64Mode = 'decode'">🔓 解码</button>
        </template>

        <!-- Timestamp mode toggle -->
        <template v-if="activeToolId === 'timestamp'">
          <button class="btn" :class="{ 'btn-active': tsMode === 'toDate' }" @click="tsMode = 'toDate'">→ 日期</button>
          <button class="btn" :class="{ 'btn-active': tsMode === 'toTs' }" @click="tsMode = 'toTs'">→ 时间戳</button>
        </template>

        <!-- Unicode mode toggle -->
        <template v-if="activeToolId === 'unicode'">
          <button class="btn" :class="{ 'btn-active': uniMode === 'encode' }" @click="uniMode = 'encode'">→ \uXXXX</button>
          <button class="btn" :class="{ 'btn-active': uniMode === 'decode' }" @click="uniMode = 'decode'">→ 字符</button>
        </template>

        <!-- Hash algorithm selector (MD5 removed -- only SHA algorithms supported) -->
        <template v-if="activeToolId === 'hash'">
          <select v-model="hashAlgo" class="algo-select">
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </template>

        <!-- Regex pattern + flags -->
        <template v-if="activeToolId === 'regex'">
          <input
            v-model="regexPattern"
            class="regex-input"
            placeholder="正则表达式，如 \d+"
            spellcheck="false"
          />
          <input
            v-model="regexFlags"
            class="regex-flags-input"
            placeholder="flags，如 g"
            spellcheck="false"
          />
        </template>
      </div>
      <div class="footer-right">
        <button class="btn" @click="doCopy">
          {{ copied ? '✅ 已复制' : '📋 复制' }}
        </button>
        <button class="btn" @click="doClear">🗑 清除</button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import {
  encodeUrl, decodeUrl,
  formatJson, compressJson,
  encodeBase64, decodeBase64,
  timestampToDate, dateToTimestamp,
  unicodeEncode, unicodeDecode,
  hashText,
  testRegex,
} from '../utils/tools.js'

const props = defineProps({
  activeToolId: { type: String, required: true },
  tools: { type: Array, required: true },
})

// --- Current tool ---
const currentTool = computed(() =>
  props.tools.find(t => t.id === props.activeToolId) || props.tools[0]
)

// --- I/O state ---
const input = ref('')
const output = ref('')
const copied = ref(false)
let copyTimer = null

// --- Tool-specific state ---
const urlMode = ref('encode')
const jsonMode = ref('format')
const base64Mode = ref('encode')
const tsMode = ref('toDate')
const uniMode = ref('encode')
const hashAlgo = ref('SHA-256')
const regexPattern = ref('')
const regexFlags = ref('g')

// --- Reset tool state on switch ---
watch(() => props.activeToolId, () => {
  input.value = ''
  output.value = ''
  urlMode.value = 'encode'
  jsonMode.value = 'format'
  base64Mode.value = 'encode'
  tsMode.value = 'toDate'
  uniMode.value = 'encode'
  hashAlgo.value = 'SHA-256'
  regexPattern.value = ''
  regexFlags.value = 'g'
})

// --- Compute output ---
function computeOutput() {
  if (!input.value) { output.value = ''; return }

  switch (props.activeToolId) {
    case 'url':
      output.value = urlMode.value === 'encode' ? encodeUrl(input.value) : decodeUrl(input.value)
      break
    case 'json':
      output.value = jsonMode.value === 'format' ? formatJson(input.value) : compressJson(input.value)
      break
    case 'base64':
      output.value = base64Mode.value === 'encode' ? encodeBase64(input.value) : decodeBase64(input.value)
      break
    case 'timestamp':
      output.value = tsMode.value === 'toDate'
        ? timestampToDate(input.value)
        : (dateToTimestamp(input.value)?.toString() ?? 'Invalid date')
      break
    case 'unicode':
      output.value = uniMode.value === 'encode' ? unicodeEncode(input.value) : unicodeDecode(input.value)
      break
    case 'hash':
      hashText(input.value, hashAlgo.value)
        .then(v => { output.value = v })
        .catch(e => { output.value = `Error: ${e.message}` })
      break
    case 'regex': {
      const result = testRegex(regexPattern.value, regexFlags.value, input.value)
      output.value = result.error
        ? `Error: ${result.error}`
        : result.matches.length === 0
          ? 'No matches'
          : result.matches.map((m, i) => `[${i + 1}] ${m}`).join('\n')
      break
    }
    default:
      output.value = ''
  }
}

watch([input, urlMode, jsonMode, base64Mode, tsMode, uniMode, hashAlgo, regexPattern, regexFlags], () => {
  computeOutput()
})

// --- Actions ---
function doCopy() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value).then(() => {
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copied.value = false }, 1500)
  })
}

function doClear() {
  input.value = ''
  output.value = ''
}

onUnmounted(() => {
  clearTimeout(copyTimer)
})
</script>

<style scoped>
.tool-panel {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24px 24px 16px;
  gap: 16px;
}

.tool-header { flex-shrink: 0; }

.tool-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.3px;
}

/* I/O area */
.io-area {
  flex: 1;
  display: flex;
  gap: 16px;
  min-height: 0;
}

.io-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: fadeIn 150ms ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.io-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.io-textarea {
  flex: 1;
  width: 100%;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text);
  background: #faf8f4;
  resize: none;
  outline: none;
  transition: border-color 120ms;
}

.io-textarea:focus {
  border-color: var(--accent);
  background: #fff;
}

.output-area {
  background: #f6f3ec;
  color: var(--output-color);
}

/* Footer */
.tool-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.footer-left  { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.footer-right { display: flex; gap: 6px; }

.btn {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  background: var(--bg);
  color: var(--text);
  transition: background 100ms, border-color 100ms;
  white-space: nowrap;
}

.btn:hover { background: #f0ebe0; }

.btn-active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  box-shadow: 0 1px 3px rgba(212, 168, 83, 0.25);
}

.btn-active:hover { opacity: 0.92; background: var(--accent-hover); }

/* Tool-specific controls */
.algo-select {
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-family: inherit;
  background: var(--bg);
  color: var(--text);
  outline: none;
  cursor: pointer;
}

.regex-input {
  width: 180px;
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-family: var(--font-mono);
  background: #faf8f4;
  color: var(--accent);
  outline: none;
}

.regex-input:focus { border-color: var(--accent); background: #fff; }

.regex-flags-input {
  width: 60px;
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  background: #faf8f4;
  color: var(--text);
  outline: none;
}

.regex-flags-input:focus { border-color: var(--accent); }
</style>
