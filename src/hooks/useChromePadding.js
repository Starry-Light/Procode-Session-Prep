import { useEffect } from 'react'

/**
 * Dynamically adjusts the container's padding-top to match the fixed chrome
 * (header + tab navigation) height, preventing content overlap.
 */
function useChromePadding(chromeRef, containerRef, isWelcomeTab) {
  useEffect(() => {
    const chrome = chromeRef.current
    const container = containerRef.current
    if (!chrome || !container) return

    const updatePadding = () => {
      if (!isWelcomeTab) {
        container.style.paddingTop = `${chrome.offsetHeight}px`
      } else {
        container.style.paddingTop = ''
      }
    }

    updatePadding()
    const observer = new ResizeObserver(updatePadding)
    observer.observe(chrome)
    return () => observer.disconnect()
  }, [chromeRef, containerRef, isWelcomeTab])
}

export default useChromePadding
