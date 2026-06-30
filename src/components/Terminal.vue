<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

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

const emit = defineEmits<{
  command: [cmd: string, args: string]
}>()

const prompt = ref(props.devicePrompt || 'C:\\Users\\Admin>')

watch(() => props.devicePrompt, (v) => {
  if (v) prompt.value = v
})

function addLine(text: string, type = 'output') {
  output.value.push({ text, type })
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    const el = document.querySelector('.terminal-output')
    if (el) el.scrollTop = el.scrollHeight
  })
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

  // Handle clear command
  if (cmdName === 'cls' || cmdName === 'clear') {
    output.value = []
    scrollToBottom()
    input.value = ''
    return
  }

  if (props.commands[cmdName]) {
    try {
      const result = props.commands[cmdName](args)
      // Split multi-line results
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
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex.value > 0) {
      historyIndex.value--
      input.value = history.value[historyIndex.value]
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      input.value = history.value[historyIndex.value]
    } else {
      historyIndex.value = history.value.length
      input.value = ''
    }
  }
}

function focus() { inputRef.value?.focus() }

defineExpose({
  focus,
  addLine,
  clear() { output.value = [] },
  setPrompt(p: string) { prompt.value = p },
})
</script>

<template>
  <div class="terminal" @click="focus">
    <div class="terminal-header">
      <div class="flex items-center gap-2">
        <span class="terminal-icon">⏻</span>
        <span class="terminal-title">{{ deviceName || '终端模拟器' }}</span>
      </div>
      <div class="flex items-center gap-3 text-[10px]">
        <span class="terminal-status" />
        <span class="text-zinc-500">已连接</span>
      </div>
    </div>
    <div class="terminal-output">
      <div
        v-for="(line, i) in output"
        :key="i"
        :class="['terminal-line', `terminal-${line.type}`]"
        v-text="line.text"
      />
    </div>
    <div class="terminal-input-line">
      <span class="terminal-prompt" v-text="prompt" />
      <input
        ref="inputRef"
        v-model="input"
        type="text"
        class="terminal-input"
        spellcheck="false"
        autocomplete="off"
        @keydown.enter="runCommand"
        @keydown="handleKeydown"
      />
      <button class="terminal-send-btn" type="button" @click="runCommand" title="执行命令 (Enter)">
        发送
      </button>
    </div>
  </div>
</template>

<style scoped>
.terminal {
  background: #0c0d0f;
  border: 1px solid #1e1f22;
  border-radius: 12px;
  overflow: hidden;
  font-family: 'Cascadia Code', 'JetBrains Mono', 'Geist Mono', monospace;
  font-size: 12.5px;
  cursor: text;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03);
}
.terminal-header {
  background: #1a1b1e;
  padding: 7px 14px;
  font-size: 11px;
  color: #a1a1aa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #27272a;
  user-select: none;
}
.terminal-icon { font-size: 10px; }
.terminal-title { font-weight: 500; letter-spacing: 0.2px; }
.terminal-status {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34,197,94,0.4);
}
.terminal-output {
  padding: 8px 14px;
  max-height: 320px;
  overflow-y: auto;
  min-height: 140px;
  background: #0c0d0f;
}
.terminal-line {
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: inherit;
  min-height: 0;
  margin: 0;
  padding: 0;
}
.terminal-input { color: #e4e4e7; }
.terminal-output { color: #c8c8cc; }
.terminal-error { color: #ef4444; }
.terminal-success { color: #22c55e; }
.terminal-system { color: #71717a; }
.terminal-warning { color: #f59e0b; }
.terminal-prompt { color: #22c55e; white-space: pre; flex-shrink: 0; font-size: 12px; }
.terminal-input-line {
  display: flex;
  align-items: center;
  padding: 6px 14px 7px;
  border-top: 1px solid #27272a;
  background: #0c0d0f;
}
.terminal-input {
  background: none;
  border: none;
  outline: none;
  color: #e4e4e7;
  font-family: inherit;
  font-size: inherit;
  flex: 1;
  margin-left: 6px;
  caret-color: #22c55e;
}
.terminal-input::placeholder { color: #3f3f46; }
.terminal-send-btn {
  background: #1e1f22; border: 1px solid #27272a;
  color: #a1a1aa; border-radius: 6px;
  padding: 4px 12px; font-size: 12px; cursor: pointer;
  font-family: inherit; transition: all .15s;
  flex-shrink: 0; margin-left: 4px;
}
.terminal-send-btn:hover { background: #2a2b2e; color: #e4e4e7; }
.terminal-send-btn:active { background: #2ea043; color: #fff; border-color: #22c55e; }
.terminal-output::-webkit-scrollbar { width: 4px; }
.terminal-output::-webkit-scrollbar-track { background: transparent; }
.terminal-output::-webkit-scrollbar-thumb { background: #3a3b3e; border-radius: 2px; }
</style>
