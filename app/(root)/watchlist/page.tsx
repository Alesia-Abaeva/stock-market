import { WatchlistNews, WatchlistTable } from '@/components/widgets/Watchlist'
import { getSessionAction } from '@/lib/actions/auth.actions'

export default async function Wishlist() {
  const user = await getSessionAction()

  if (!user?.user?.email) {
    return (
      <div className="flex min-h-screen  home-wrapper">Please sign in to view your watchlist.</div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="watchlist-container">
        {/* Left Column (2/3 width on large screens) */}
        <div className="watchlist">
          <WatchlistTable />
        </div>

        {/* Right Column (1/3 width on large screens) */}
        {/* {news && news.length > 0 && (
          <div className="watchlist-alerts">
            <WatchlistNews news={news} />
          </div>
        )} */}
      </div>

      <section className="grid w-full gap-8">
        <WatchlistNews />
      </section>
    </div>
  )
}
