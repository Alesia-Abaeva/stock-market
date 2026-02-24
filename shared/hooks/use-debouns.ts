'use client'

import React, { useCallback } from 'react'

export function useDebounce(callback: () => void, delay: number) {
  // eslint-disable-next-line no-undef
  const timeOutRef = React.useRef<NodeJS.Timeout | null>(null)

  return useCallback(() => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    timeOutRef.current = setTimeout(callback, delay)
  }, [callback, delay])
}
