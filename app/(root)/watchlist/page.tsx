import { TradingView } from '@/components/widgets/TradingView'
import { WatchlistNews } from '@/components/widgets/Watchlist'
import { getSessionAction } from '@/lib/actions/auth.actions'
import { getNews } from '@/lib/actions/finnhub.actions'
import { getWatchlistSymbolsByEmail } from '@/lib/actions/watchlist.actions'
import { GET_WATCH_LIST_WIDGET_CONFIG } from '@/shared/const/trading'

export default async function Wishlist() {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`

  const user = await getSessionAction()

  if (!user?.user?.email) {
    return (
      <div className="flex min-h-screen  home-wrapper">Please sign in to view your watchlist.</div>
    )
  }

  const data = await getWatchlistSymbolsByEmail(user?.user.email)

  const news = await getNews(data)

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
        </div>

        {/* Right Column (1/3 width on large screens) */}
        {/* {news && news.length > 0 && (
          <div className="col-span-1 space-y-6">
            <WatchlistNews news={news} />
          </div>
        )} */}
      </div>

      <section className="grid w-full gap-8">
        {news && news.length > 0 && <WatchlistNews news={news} />}
      </section>
    </div>
  )
}
