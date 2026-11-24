import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

import StepPlayer from './components/StepPlayer.vue'
import FlowStage from './components/FlowStage.vue'
import Quiz from './components/Quiz.vue'
import AgentLoopAnim from './components/AgentLoopAnim.vue'
import ContextWindowAnim from './components/ContextWindowAnim.vue'
import ClaudeMdLayersAnim from './components/ClaudeMdLayersAnim.vue'
import PermissionFlowAnim from './components/PermissionFlowAnim.vue'
import HookLifecycleAnim from './components/HookLifecycleAnim.vue'
import SubagentFanoutAnim from './components/SubagentFanoutAnim.vue'
import ClaudeShipFlowAnim from './components/ClaudeShipFlowAnim.vue'
import ShipWatchAnim from './components/ShipWatchAnim.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('StepPlayer', StepPlayer)
    app.component('FlowStage', FlowStage)
    app.component('Quiz', Quiz)
    app.component('AgentLoopAnim', AgentLoopAnim)
    app.component('ContextWindowAnim', ContextWindowAnim)
    app.component('ClaudeMdLayersAnim', ClaudeMdLayersAnim)
    app.component('PermissionFlowAnim', PermissionFlowAnim)
    app.component('HookLifecycleAnim', HookLifecycleAnim)
    app.component('SubagentFanoutAnim', SubagentFanoutAnim)
    app.component('ClaudeShipFlowAnim', ClaudeShipFlowAnim)
    app.component('ShipWatchAnim', ShipWatchAnim)
  }
} satisfies Theme
