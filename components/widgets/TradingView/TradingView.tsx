'use client'

// TradingViewWidget.jsx
import React from 'react'

import { cn } from '@/lib/utils'
import useTradingView from '@/shared/hooks/use-trading-view'

type TradingViewWidgetProps = {
  className?: string
  title?: string
  config: Record<string, unknown>
  height?: number
  scriptUrl: string
}

const TradingViewWidget = ({
  config,
  scriptUrl,
  className,
  height,
  title,
}: TradingViewWidgetProps) => {
  const container = useTradingView(scriptUrl, config, height)

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-2xl text-gray-100 mb-5">{title}</h3>}
      <div className={cn('tradingview-widget-container', className)} ref={container}>
        <div
          className="tradingview-widget-container__widget"
          style={{ height, width: '100%' }}
        ></div>
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/symbols/NASDAQ-AAPL/"
            rel="noopener nofollow"
            target="_blank"
          >
            <span className="blue-text">AAPL stock chart</span>
          </a>
          <span className="trademark"> by TradingView</span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(TradingViewWidget)
