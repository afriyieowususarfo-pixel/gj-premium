import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Seed from the viewport at mount instead of setting state inside the
  // effect: the value cannot change between render and the first effect run.
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    typeof window === "undefined"
      ? false
      : window.innerWidth < MOBILE_BREAKPOINT,
  )

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
