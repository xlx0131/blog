import { ref, computed } from 'vue'

export type GameSubPhase = 'investigating' | 'repairing' | 'verifying' | 'completed'

export interface InvestigationLog {
  optionValue: string
  optionLabel: string
  timestamp: number
  result: 'correct' | 'wrong' | 'excluded'
}

export function useGameFlow() {
  const subPhase = ref<GameSubPhase>('investigating')
  const investigationLogs = ref<InvestigationLog[]>([])
  const selectedFixAction = ref<string | null>(null)
  const fixAttempts = ref(0)
  const verifiedItems = ref<string[]>([])
  const verifyFailed = ref(false)

  function setSubPhase(phase: GameSubPhase) {
    subPhase.value = phase
  }

  const isInvestigating = computed(() => subPhase.value === 'investigating')
  const isRepairing = computed(() => subPhase.value === 'repairing')
  const isVerifying = computed(() => subPhase.value === 'verifying')
  const isCompleted = computed(() => subPhase.value === 'completed')

  function logInvestigation(optionValue: string, optionLabel: string, result: 'correct' | 'wrong' | 'excluded') {
    investigationLogs.value.push({ optionValue, optionLabel, timestamp: Date.now(), result })
  }

  function markVerified(itemId: string) {
    if (!verifiedItems.value.includes(itemId)) {
      verifiedItems.value.push(itemId)
    }
  }

  const allVerified = computed(() => {
    return verifiedItems.value.length > 0
  })

  function reset() {
    subPhase.value = 'investigating'
    investigationLogs.value = []
    selectedFixAction.value = null
    fixAttempts.value = 0
    verifiedItems.value = []
    verifyFailed.value = false
  }

  return {
    subPhase, investigationLogs, selectedFixAction, fixAttempts, verifiedItems, verifyFailed,
    setSubPhase, isInvestigating, isRepairing, isVerifying, isCompleted,
    logInvestigation, markVerified, allVerified, reset,
  }
}
