'use client'

import React, { useCallback } from 'react'

export function useDebounce(callback: () => void | Promise<void>, delay: number) {
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(() => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    timeOutRef.current = setTimeout(() => {
      void callback()
    }, delay)
  }, [callback, delay])
}
