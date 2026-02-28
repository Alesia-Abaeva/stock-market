import { TradingView } from '@/components/widgets/TradingView'
import { WatchlistNews, WatchlistTable } from '@/components/widgets/Watchlist'
import { getSessionAction } from '@/lib/actions/auth.actions'
import { getNews, getStockDetails } from '@/lib/actions/finnhub.actions'
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

  const stockDetails = await getStockDetails(data)

  const news = await getNews(data)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="watchlist-container">
        {/* Left Column (2/3 width on large screens) */}
        <div className="watchlist">
          <WatchlistTable stocks={stockDetails} />
        </div>

        {/* Right Column (1/3 width on large screens) */}
        {/* {news && news.length > 0 && (
          <div className="watchlist-alerts">
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
