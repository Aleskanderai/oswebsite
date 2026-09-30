import { lazy, Suspense } from 'react'

/*
  Dev-only: /?scene=hero (or browser, apps, swarm, kit) renders one product scene alone on
  a plain page, and &t=4.5 freezes its clock, so each scene can be screenshotted at exact
  moments. Not linked from the site.
*/

const SCENES = {
  hero: lazy(() => import('./HeroScene').then((m) => ({ default: m.HeroScene }))),
  browser: lazy(() => import('./BrowserScene').then((m) => ({ default: m.BrowserScene }))),
  apps: lazy(() => import('./AppsScene').then((m) => ({ default: m.AppsScene }))),
  swarm: lazy(() => import('./SwarmScene').then((m) => ({ default: m.SwarmScene }))),
  kit: lazy(() => import('./KitScene').then((m) => ({ default: m.KitScene }))),
}

// Use cases panels: /?scene=uc-sales etc., shown on the same gradient as the section.
const PANELS = {
  'uc-sales': lazy(() => import('../usecases/SalesPanel').then((m) => ({ default: () => <m.SalesPanel prompt="Find 50 Series A fintech startups in New York and draft a first email to each founder." /> }))),
  'uc-ops': lazy(() => import('../usecases/OpsPanel').then((m) => ({ default: () => <m.OpsPanel prompt="Every Friday, match Stripe payouts against QuickBooks and flag anything that doesn't line up." /> }))),
  'uc-recruiting': lazy(() => import('../usecases/RecruitingPanel').then((m) => ({ default: () => <m.RecruitingPanel prompt="Screen the 120 new applicants for the design role and book calls with the top ten." /> }))),
  'uc-research': lazy(() => import('../usecases/ResearchPanel').then((m) => ({ default: () => <m.ResearchPanel prompt={'Read the last month of papers on browser agents and write me a two\u2011page brief.'} /> }))),
}

export function Harness({ name }: { name: string }) {
  const w = new URLSearchParams(window.location.search).get('w')
  const Panel = PANELS[name as keyof typeof PANELS]
  if (Panel) {
    // The panel column is about 680 px wide on a desktop page (616 inside its padding) and
    // about 375 px on a phone (335 inside).
    return (
      <div style={{ background: '#fff', minHeight: '100vh' }}>
        <div className="relative overflow-hidden bg-[linear-gradient(150deg,#e9f1fe_0%,#efe8fd_55%,#fbe9f3_100%)] p-5 sm:p-8" style={{ width: w ? Number(w) : 680 }}>
          <Suspense fallback={null}>
            <Panel />
          </Suspense>
        </div>
      </div>
    )
  }
  const Scene = SCENES[name as keyof typeof SCENES]
  if (!Scene) return <p style={{ padding: 24 }}>Unknown scene {name}</p>
  return (
    <div style={{ padding: 0, background: '#fff', minHeight: '100vh' }}>
      <div style={{ width: w ? Number(w) : '100%' }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>
    </div>
  )
}
