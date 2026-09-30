import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Dev only: /?scene=hero (browser, apps, swarm, kit, uc-sales, uc-ops, uc-recruiting,
// uc-research) shows one animation alone, and &t=4.5 freezes its clock for screenshots.
// Production builds drop this branch entirely.
const scene = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('scene') : null
const Harness = import.meta.env.DEV ? lazy(() => import('./components/os/Harness').then((m) => ({ default: m.Harness }))) : null

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {scene && Harness ? (
      <Suspense fallback={null}>
        <Harness name={scene} />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
