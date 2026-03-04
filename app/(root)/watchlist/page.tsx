import { PriceAlert } from '@/components/widgets/PriceAlert'
import { AlertList } from '@/components/widgets/PriceAlert/AlertList'
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
      <div>
        <h3 className="watchlist-title">Watchlist</h3>
        <p className="pb-8 text-gray-500">Track your favorite stocks and manage alerts.</p>
      </div>
      <div className="watchlist-container">
        {/* Left Column (2/3 width on large screens) */}
        <div className="watchlist">
          <WatchlistTable />
        </div>

        <PriceAlert />
        {/* Right Column (1/3 width on large screens) */}

        <div className="watchlist-alerts">
          <AlertList />
        </div>
      </div>

      <section className="grid w-full gap-8">
        <WatchlistNews />
      </section>
    </div>
  )
}
