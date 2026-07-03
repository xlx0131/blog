<script setup lang="ts">
import { ref, nextTick, watch, computed, onMounted } from 'vue'
import { Monitor } from '@lucide/vue'

const props = withDefaults(defineProps<{
  commands: Record<string, (args: string) => string>
  devicePrompt?: string
  deviceName?: string
}>(), {
  commands: () => ({}),
  devicePrompt: 'C:\\Users\\Admin>',
  deviceName: '终端模拟器',
})

const input = ref('')
const output = ref<{ text: string; type: string }[]>([])
const history = ref<string[]>([])
const historyIndex = ref(-1)
const inputRef = ref<HTMLInputElement | null>(null)
const outputRef = ref<HTMLDivElement | null>(null)
const measureRef = ref<HTMLSpanElement | null>(null)
const cursorOffset = ref(0)

const searchMode = ref(false)
const searchQuery = ref('')
const searchMatched = ref('')
const searchIndex = ref(-1)

const emit = defineEmits<{
  command: [cmd: string, args: string]
}>()

const prompt = ref(props.devicePrompt || 'C:\\Users\\Admin>')

watch(() => props.devicePrompt, (v) => {
  if (v) prompt.value = v
})

const commandList = computed(() => {
  const cmds = Object.keys(props.commands)
  cmds.push('clear', 'cls', 'help')
  return cmds
})

function addLine(text: string, type = 'output') {
  output.value.push({ text, type })
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (outputRef.value) {
      outputRef.value.scrollTop = outputRef.value.scrollHeight
    }
  })
}

function tabComplete() {
  const cmd = input.value.trim()
  if (!cmd) return

  const parts = cmd.split(/\s+/)
  if (parts.length > 1) return

  const prefix = parts[0].toLowerCase()
  const matches = commandList.value.filter(c => c.toLowerCase().startsWith(prefix))

  if (matches.length === 0) return

  if (matches.length === 1) {
    input.value = matches[0] + ' '
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.setSelectionRange(input.value.length, input.value.length)
      }
    })
  } else {
    addLine(`${prompt.value} ${input.value}`, 'input')
    addLine(matches.join('    '), 'system')
  }
}

function enterSearchMode() {
  searchMode.value = true
  searchQuery.value = ''
  searchMatched.value = ''
  searchIndex.value = -1
  input.value = ''
}

function exitSearchMode(keepInput = false) {
  searchMode.value = false
  if (!keepInput) {
    input.value = ''
  }
  searchQuery.value = ''
  searchMatched.value = ''
  searchIndex.value = -1
}

function findNextMatch(backward = true) {
  if (!searchQuery.value) {
    searchMatched.value = ''
    searchIndex.value = -1
    return
  }
  const reversed = [...history.value].reverse()
  const startIndex = searchIndex.value >= 0 ? history.value.length - 1 - searchIndex.value : -1

  if (backward) {
    for (let i = startIndex + 1; i < reversed.length; i++) {
      if (reversed[i].toLowerCase().includes(searchQuery.value.toLowerCase())) {
        searchMatched.value = reversed[i]
        searchIndex.value = history.value.length - 1 - i
        return
      }
    }
    for (let i = 0; i <= startIndex; i++) {
      if (reversed[i].toLowerCase().includes(searchQuery.value.toLowerCase())) {
        searchMatched.value = reversed[i]
        searchIndex.value = history.value.length - 1 - i
        return
      }
    }
  } else {
    for (let i = startIndex - 1; i >= 0; i--) {
      if (reversed[i].toLowerCase().includes(searchQuery.value.toLowerCase())) {
        searchMatched.value = reversed[i]
        searchIndex.value = history.value.length - 1 - i
        return
      }
    }
    for (let i = reversed.length - 1; i >= startIndex + 1; i--) {
      if (reversed[i].toLowerCase().includes(searchQuery.value.toLowerCase())) {
        searchMatched.value = reversed[i]
        searchIndex.value = history.value.length - 1 - i
        return
      }
    }
  }

  if (searchIndex.value < 0) {
    searchMatched.value = ''
  }
}

function updateSearch() {
  searchIndex.value = -1
  findNextMatch(true)
}

function confirmSearch() {
  if (searchMatched.value) {
    input.value = searchMatched.value
    exitSearchMode(true)
    nextTick(() => runCommand())
  } else {
    exitSearchMode(false)
  }
}

function runCommand() {
  const cmd = input.value.trim()
  if (!cmd) return

  addLine(`${prompt.value} ${cmd}`, 'input')
  history.value.push(cmd)
  historyIndex.value = history.value.length

  const parts = cmd.split(/\s+/)
  const cmdName = parts[0].toLowerCase()
  const args = parts.slice(1).join(' ')

  if (cmdName === 'cls' || cmdName === 'clear') {
    output.value = []
    scrollToBottom()
    input.value = ''
    return
  }

  if (cmdName === 'help') {
    addLine('可用命令列表:', 'system')
    commandList.value.sort().forEach(c => {
      addLine(`  ${c}`, 'output')
    })
    emit('command', cmdName, args)
    input.value = ''
    scrollToBottom()
    return
  }

  if (props.commands[cmdName]) {
    try {
      const result = props.commands[cmdName](args)
      const lines = result.split('\n')
      lines.forEach((line: string) => {
        if (line.startsWith('!ERROR:')) {
          addLine(line.replace('!ERROR:', ''), 'error')
        } else if (line.startsWith('!SUCCESS:')) {
          addLine(line.replace('!SUCCESS:', ''), 'success')
        } else if (line.startsWith('!INFO:')) {
          addLine(line.replace('!INFO:', ''), 'system')
        } else if (line.startsWith('!WARN:')) {
          addLine(line.replace('!WARN:', ''), 'warning')
        } else {
          addLine(line)
        }
      })
    } catch (e: any) {
      addLine(`命令执行出错: ${e.message}`, 'error')
    }
  } else {
    addLine(`'${cmdName}' 不是内部或外部命令，也不是可运行的程序或批处理文件。`, 'error')
    addLine(`输入 HELP 查看可用命令列表。`, 'system')
  }

  emit('command', cmdName, args)
  input.value = ''
  scrollToBottom()
}

function handleKeydown(e: KeyboardEvent) {
  if (searchMode.value) {
    if (e.key === 'Enter') {
      e.preventDefault()
      confirmSearch()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      exitSearchMode(false)
    } else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'r')) {
      e.preventDefault()
      findNextMatch(true)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      findNextMatch(false)
    }
    return
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (history.value.length > 0) {
      if (historyIndex.value <= 0) {
        historyIndex.value = history.value.length - 1
      } else {
        historyIndex.value--
      }
      input.value = history.value[historyIndex.value]
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (history.value.length > 0) {
      if (historyIndex.value >= history.value.length - 1) {
        historyIndex.value = history.value.length
        input.value = ''
      } else {
        historyIndex.value++
        input.value = history.value[historyIndex.value]
      }
    }
  } else if (e.key === 'Tab') {
    e.preventDefault()
    tabComplete()
  } else if (e.ctrlKey && e.key === 'r') {
    e.preventDefault()
    enterSearchMode()
  }
}

function updateCursorPosition() {
  nextTick(() => {
    if (measureRef.value) {
      cursorOffset.value = measureRef.value.offsetWidth
    }
  })
}

function handleInput() {
  updateCursorPosition()
  if (searchMode.value) {
    searchQuery.value = input.value
    updateSearch()
  }
}

function handleKeyup() {
  updateCursorPosition()
}

function handleClick() {
  updateCursorPosition()
}

function focus() { inputRef.value?.focus() }

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
})

defineExpose({
  focus,
  addLine,
  clear() { output.value = [] },
  setPrompt(p: string) { prompt.value = p },
})
</script>

<template>
  <div class="terminal" @click="focus">
    <div class="scanlines"></div>
    <div class="terminal-header">
      <div class="header-left">
        <div class="window-buttons">
          <span class="window-btn close"></span>
          <span class="window-btn minimize"></span>
          <span class="window-btn maximize"></span>
        </div>
        <div class="header-title">
          <Monitor class="header-icon" :size="14" />
          <span class="title-text">{{ deviceName || '终端模拟器' }}</span>
        </div>
      </div>
      <div class="header-right">
        <span class="status-dot"></span>
        <span class="status-text">已连接</span>
      </div>
    </div>
    <div ref="outputRef" class="terminal-output">
      <div
        v-for="(line, i) in output"
        :key="i"
        :class="['terminal-line', `terminal-${line.type}`]"
        v-text="line.text"
      />
    </div>
    <div class="terminal-input-line">
      <template v-if="searchMode">
        <span class="search-prefix">(reverse-i-search)</span>
        <span class="search-quote">`</span>
        <div class="input-wrapper search-wrapper">
          <span ref="measureRef" class="measure-text" v-text="input"></span>
          <input
            ref="inputRef"
            v-model="input"
            type="text"
            class="terminal-input"
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            @keydown.enter="runCommand"
            @keydown="handleKeydown"
            @input="handleInput"
            @keyup="handleKeyup"
            @click="handleClick"
          />
          <span class="cursor-block search-cursor" :style="{ left: cursorOffset + 'px' }"></span>
        </div>
        <span class="search-quote">':</span>
        <span class="search-result" v-text="searchMatched"></span>
      </template>
      <template v-else>
        <span class="terminal-prompt" v-text="prompt" />
        <div class="input-wrapper">
          <span ref="measureRef" class="measure-text" v-text="input"></span>
          <input
            ref="inputRef"
            v-model="input"
            type="text"
            class="terminal-input"
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            @keydown.enter="runCommand"
            @keydown="handleKeydown"
            @input="handleInput"
            @keyup="handleKeyup"
            @click="handleClick"
          />
          <span class="cursor-block" :style="{ left: cursorOffset + 'px' }"></span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.terminal {
  position: relative;
  background: #0a0e17;
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 13px;
  line-height: 1.5;
  cursor: text;
  box-shadow:
    0 0 20px rgba(0, 212, 255, 0.1),
    0 0 40px rgba(0, 212, 255, 0.05),
    inset 0 0 60px rgba(0, 212, 255, 0.03);
}

.scanlines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  opacity: 0.3;
  animation: scanline-flicker 8s ease-in-out infinite;
}

@keyframes scanline-flicker {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.2; }
}

.terminal-header {
  position: relative;
  z-index: 20;
  background: #0f1629;
  padding: 10px 16px;
  font-size: 12px;
  color: #8b949e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  user-select: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.window-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.window-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.window-btn.close {
  background: #ff5f57;
  box-shadow: 0 0 8px rgba(255, 95, 87, 0.5);
}

.window-btn.minimize {
  background: #febc2e;
  box-shadow: 0 0 8px rgba(254, 188, 46, 0.5);
}

.window-btn.maximize {
  background: #28c840;
  box-shadow: 0 0 8px rgba(40, 200, 64, 0.5);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  color: #00d4ff;
  filter: drop-shadow(0 0 4px rgba(0, 212, 255, 0.6));
}

.title-text {
  color: #00d4ff;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ff88;
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.6);
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.status-text {
  color: #8b949e;
  font-size: 11px;
}

.terminal-output {
  position: relative;
  z-index: 5;
  padding: 12px 16px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  background: transparent;
}

.terminal-line {
  white-space: pre-wrap;
  word-break: break-all;
  font-family: inherit;
  margin: 0;
  padding: 0;
}

.terminal-input { color: #e4e4e7; }
.terminal-output { color: #8b949e; }
.terminal-error { color: #ff4757; text-shadow: 0 0 8px rgba(255, 71, 87, 0.4); }
.terminal-success { color: #00ff88; text-shadow: 0 0 8px rgba(0, 255, 136, 0.4); }
.terminal-system { color: #00d4ff; text-shadow: 0 0 8px rgba(0, 212, 255, 0.4); }
.terminal-warning { color: #ffaa00; text-shadow: 0 0 8px rgba(255, 170, 0, 0.4); }
.terminal-input-line .terminal-prompt { color: #00ff88; white-space: pre; flex-shrink: 0; text-shadow: 0 0 8px rgba(0, 255, 136, 0.5); }

.ip-address { color: #a855f7; text-shadow: 0 0 8px rgba(168, 85, 247, 0.4); }
.port-number { color: #ff8c42; text-shadow: 0 0 8px rgba(255, 140, 66, 0.4); }

.terminal-input-line {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  padding: 8px 16px 12px;
  background: transparent;
  border-top: 1px solid rgba(0, 212, 255, 0.1);
}

.search-prefix {
  color: #8b949e;
  flex-shrink: 0;
}

.search-quote {
  color: #00d4ff;
  flex-shrink: 0;
  text-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
}

.search-wrapper {
  margin-left: 0;
  flex: none;
  width: auto;
  min-width: 20px;
}

.search-result {
  color: #00ff88;
  margin-left: 8px;
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-cursor {
  background: #ffaa00;
  box-shadow: 0 0 10px rgba(255, 170, 0, 0.8);
}

.input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.measure-text {
  position: absolute;
  visibility: hidden;
  white-space: pre;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  pointer-events: none;
}

.terminal-input {
  background: none;
  border: none;
  outline: none;
  color: #e4e4e7;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  flex: 1;
  caret-color: transparent;
  width: 100%;
  position: relative;
  z-index: 1;
}

.terminal-input::placeholder { color: #3f3f46; }

.cursor-block {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 16px;
  background: #00ff88;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
  animation: cursor-blink 1s step-end infinite;
  pointer-events: none;
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.terminal-output::-webkit-scrollbar {
  width: 6px;
}

.terminal-output::-webkit-scrollbar-track {
  background: rgba(0, 212, 255, 0.05);
}

.terminal-output::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.3);
  border-radius: 3px;
  box-shadow: 0 0 6px rgba(0, 212, 255, 0.3);
}

.terminal-output::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 212, 255, 0.5);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}
</style>
