import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'
import { markChunkRecoverySuccess, setupChunkRecovery } from './utils/chunkRecovery'

setupChunkRecovery()

registerSW({
  immediate: true,
  onRegisterError(error) {
    console.error('[MindFlow] Service worker registration failed:', error)
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

markChunkRecoverySuccess()
