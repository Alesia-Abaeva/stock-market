import Image from 'next/image'
import Link from 'next/link'

import { searchStocks } from '@/lib/actions/finnhub.actions'
import { getWatchlistSymbolsByEmail } from '@/lib/actions/watchlist.actions'
import { User } from '@/shared/types/global'

import { NavItems } from './NavItems'
import { UserDropDown } from './UserDropDown'

type HeaderProps = {
  user?: User
}

export default async function Header({ user }: HeaderProps) {
  const watchlistSymbols = await getWatchlistSymbolsByEmail(user?.email)

  const initialStocks = await searchStocks({ watchlistSymbols })

  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image src="/assets/icons/logo.svg" width={140} height={32} alt="signalist logo" />
        </Link>

        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} watchlistSymbols={watchlistSymbols} />
        </nav>
        {user && (
          <UserDropDown
            user={user}
            initialStocks={initialStocks}
            watchlistSymbols={watchlistSymbols}
          />
        )}
      </div>
    </header>
  )
}
