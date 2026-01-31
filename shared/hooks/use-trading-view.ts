'use client'

import React from 'react'

const useTradingView = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height: number = 600
) => {
  const container = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!container.current) return

    if (container.current.dataset.loaded) return

    container.current.innerHTML = `<div class="tradingview-widget-container__widget" style="width: 100%; height: ${height}px;"></div>`

    const script = document.createElement('script')
    script.src = scriptUrl
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify(config)

    container.current?.appendChild(script)
    container.current.dataset.loaded = 'true'

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
        // eslint-disable-next-line react-hooks/exhaustive-deps
        delete container.current.dataset.loaded
      }
    }
  }, [config, height, scriptUrl])

  return container
}

export default useTradingView
