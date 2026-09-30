import type { InputHTMLAttributes, Ref } from 'react'
import { ChevronDown } from 'lucide-react'
import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js/min'
import { cn } from '@/lib/utils'

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
const preferred: CountryCode[] = ['US', 'CA', 'GB', 'FR', 'DE', 'AU']
const regions = getCountries().sort((a, b) => (regionNames.of(a) ?? a).localeCompare(regionNames.of(b) ?? b))
const choices = [...preferred, ...regions.filter((country) => !preferred.includes(country))]

type Props = InputHTMLAttributes<HTMLInputElement> & {
  ref?: Ref<HTMLInputElement>
  country: CountryCode
  onCountryChange: (country: CountryCode) => void
}

/** A segmented glass phone field with an actual country picker and native mobile behavior. */
export function LiquidGlassInput({ ref, className, country, onCountryChange, disabled, ...props }: Props) {
  return (
    <div className="liquid-glass-input relative isolate flex h-11 min-w-0 items-center rounded-[9px]" data-disabled={disabled || undefined}>
      <div className="phone-country relative ml-1 flex h-[34px] shrink-0 items-center gap-1 rounded-[5px] px-1.5 sm:px-2">
        <span aria-hidden className="hidden text-[9px] font-semibold tracking-[.04em] text-[#637889] min-[440px]:inline">{country}</span>
        <span aria-hidden className="text-[12px] font-medium tabular-nums text-[#344859]">+{getCountryCallingCode(country)}</span>
        <ChevronDown aria-hidden size={10} strokeWidth={1.7} className="text-[#637889]" />
        <select
          aria-label="Country calling code"
          name="phone-country"
          autoComplete="country"
          value={country}
          disabled={disabled}
          onChange={(event) => onCountryChange(event.target.value as CountryCode)}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[5px] opacity-0 disabled:cursor-wait"
        >
          {choices.map((code) => <option key={code} value={code}>{regionNames.of(code)} (+{getCountryCallingCode(code)})</option>)}
        </select>
      </div>
      <span aria-hidden className="phone-field-divider mx-1 h-[18px] w-px shrink-0" />
      <input ref={ref} {...props} disabled={disabled} className={cn('relative z-10 h-full w-full min-w-0 rounded-r-[9px] bg-transparent pl-1 pr-2 text-[16px] font-medium text-[#27272c] outline-none placeholder:text-[13px] placeholder:font-normal placeholder:text-[#626e78] disabled:opacity-60 sm:text-[14px]', className)} />
      <span aria-hidden className="phone-focus-line pointer-events-none absolute inset-x-3 bottom-0 h-px" />
    </div>
  )
}
