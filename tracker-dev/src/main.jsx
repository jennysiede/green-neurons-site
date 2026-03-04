import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SupplyChainTracker from '@tracker'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SupplyChainTracker />
  </StrictMode>
)
