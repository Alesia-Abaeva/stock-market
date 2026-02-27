import { TradingView } from '@/components/widgets/TradingView'
import { getSessionAction } from '@/lib/actions/auth.actions'
import { getWatchlistSymbolsByEmail } from '@/lib/actions/watchlist.actions'
import {
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  GET_WATCH_LIST_WIDGET_CONFIG,
} from '@/shared/const/trading'

export default async function Wishlist() {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`

  const user = await getSessionAction()

  if (!user?.user?.email) {
    return (
      <div className="flex min-h-screen  home-wrapper">Please sign in to view your watchlist.</div>
    )
  }

  const data = await getWatchlistSymbolsByEmail(user?.user.email)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (2/3 width on large screens) */}
        <div className="col-span-1 xl:col-span-2 space-y-6">
          <TradingView
            scriptUrl={`${scriptUrl}market-quotes.js`}
            config={GET_WATCH_LIST_WIDGET_CONFIG(data)}
            height={600}
            title="Watchlist"
          />
          {/* <TradingView
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            height={600}
          />
          <TradingView
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            height={600}
          /> */}
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="col-span-1 space-y-6">
          {/* <WatchlistButton symbol={symbol} /> */}

          {/* {/* <TradingView
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            height={400}
          /> */}
          <TradingView
            scriptUrl={`${scriptUrl}symbol-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG('symbol')}
            height={440}
          />
          <TradingView
            scriptUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG('symbol')}
            height={460}
          />
        </div>
      </div>
    </div>
  )
}
