import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Shop from './Shop.jsx'
import Admin from './Admin.jsx'

const isAdmin = window.location.pathname === '/admin'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? <Admin /> : <Shop />}
  </StrictMode>,
)
