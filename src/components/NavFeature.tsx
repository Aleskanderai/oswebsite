import { ArrowUpRight } from 'lucide-react'
import { IconAsset, type IconAssetName } from './IconAsset'
import { cn, media } from '@/lib/utils'

function AppTile({ name, className }: { name: IconAssetName; className: string }) {
  return (
    <span className={cn('absolute z-20 flex h-8 w-8 items-center justify-center rounded-[9px] border border-white/75 bg-white/90 shadow-[0_5px_12px_rgba(29,31,53,0.16),inset_0_1px_0_white] backdrop-blur-sm', className)}>
      <IconAsset name={name} className="h-[20px] w-[20px]" />
    </span>
  )
}

/** A small composition of the real mascot and connected apps, not a video preview. */
export function NavFeature({ onPick }: { onPick: () => void }) {
  return (
    <a
      href="#product"
      onClick={onPick}
      className="group/preview relative isolate flex min-h-[204px] flex-col overflow-hidden p-4 text-white"
    >
      <img src={media('canvas-twilight.webp')} alt="" aria-hidden className="absolute inset-0 -z-20 h-full w-full object-cover object-[65%_45%] transition-transform duration-700 motion-safe:group-hover/preview:scale-105" />
      <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(37,39,57,0.22)_0%,rgba(37,39,57,0.08)_30%,rgba(26,29,49,0.78)_100%)]" />
      <span className="relative text-[9px] font-medium uppercase leading-3 tracking-[0.13em] text-white/90">Your AI desktop</span>

      <span aria-hidden className="relative my-0.5 min-h-[96px] flex-1">
        <span className="absolute left-1/2 top-1/2 h-[86px] w-[calc(100%-16px)] max-w-[145px] -translate-x-1/2 -translate-y-1/2 -rotate-[5deg] overflow-hidden rounded-[12px] border border-white/55 bg-white/20 shadow-[0_10px_24px_rgba(24,30,54,0.22),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-[7px] transition-transform duration-500 motion-safe:group-hover/preview:rotate-0">
          <span className="flex h-4 items-center gap-[3px] border-b border-white/20 bg-white/10 px-2">
            <span className="h-[3px] w-[3px] rounded-full bg-white/80" />
            <span className="h-[3px] w-[3px] rounded-full bg-white/55" />
            <span className="h-[3px] w-[3px] rounded-full bg-white/40" />
          </span>
        </span>
        <img src={media('logo-256.png')} alt="" className="absolute left-1/2 top-1/2 z-10 h-[78px] w-[78px] -translate-x-1/2 -translate-y-[44%] [image-rendering:pixelated] drop-shadow-[0_5px_7px_rgba(30,31,56,0.2)] transition-transform duration-500 motion-safe:group-hover/preview:-translate-y-1/2" />
        <AppTile name="gmail" className="left-0 top-[12%] -rotate-[9deg]" />
        <AppTile name="chrome" className="right-0 top-[27%] rotate-[8deg]" />
        <AppTile name="notion" className="bottom-[2%] left-[12%] rotate-[5deg]" />
      </span>

      <span className="relative flex items-start justify-between gap-2 text-[13px] font-medium leading-5">
        <span>See the swarm<br />at work</span>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 transition-transform motion-safe:group-hover/preview:-translate-y-0.5 motion-safe:group-hover/preview:translate-x-0.5" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="relative mt-1 text-[10.5px] leading-4 text-white/80">One desktop. Many agents.</span>
    </a>
  )
}
