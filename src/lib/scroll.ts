import type Lenis from 'lenis'

/*
  The page's one Lenis instance, so parts of the page can pause smooth scrolling (the phone
  menu holds the page still while it is open). Null when reduced motion turns Lenis off.
*/
let lenis: Lenis | null = null

export const setLenis = (l: Lenis | null) => {
  lenis = l
}

/** Hold the page still (true) or let it scroll again (false). Safe to call repeatedly. */
export function lockScroll(locked: boolean) {
  const v = locked ? 'hidden' : ''
  document.documentElement.style.overflow = v
  document.body.style.overflow = v
  if (locked) lenis?.stop()
  else lenis?.start()
}
