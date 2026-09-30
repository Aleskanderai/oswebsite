import { useId } from 'react'

/** A broad, soft cloud bank joins the static sky to the page behind the window. */
export function HeroCloudBorder() {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-[calc(var(--hero-reveal)-18px)] h-[72px] w-full sm:h-[110px]"
    >
      <defs>
        <linearGradient id={`${id}-cloud`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#edf8fb" />
          <stop offset=".5" stopColor="#f8fcfd" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      <path
        d="M-30 62 C10 66 14 22 68 28 C99 -1 163 15 179 46 C219 35 259 61 282 69 C365 44 401 59 457 74 C540 47 606 72 670 75 C755 46 817 67 883 75 C970 46 1041 58 1104 72 C1141 44 1184 51 1212 49 C1228 12 1289 7 1317 34 C1361 15 1403 41 1470 61 L1470 130 L-30 130 Z"
        fill={`url(#${id}-cloud)`}
        stroke="#e4f1f5"
        strokeWidth="1"
        filter={`url(#${id}-soft)`}
      />
    </svg>
  )
}
