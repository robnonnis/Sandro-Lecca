import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TomatoShop from './TomatoShop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TomatoShop />
  </StrictMode>,
)
