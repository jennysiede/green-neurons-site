import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SupplyChainTracker from '../../supply-chain-tracker.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SupplyChainTracker />
  </StrictMode>
)
