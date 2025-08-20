import { StrictMode } from 'react'
import { Toaster } from 'react-hot-toast'
import { createRoot } from 'react-dom/client'

import '@/index.css'
import App from '@/App'

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <>
    <App />
    <Toaster />
    </>
  </StrictMode>
)
