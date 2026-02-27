import Image from 'next/image'
import Link from 'next/link'

import { searchStocks } from '@/lib/actions/finnhub.actions'
import { User } from '@/shared/types/global'

import { NavItems } from './NavItems'
import { UserDropDown } from './UserDropDown'

type HeaderProps = {
  user?: User
}

export default async function Header({ user }: HeaderProps) {
  const initialStocks = await searchStocks(null)

  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image src="/assets/icons/logo.svg" width={140} height={32} alt="signalist logo" />
        </Link>

        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} />
        </nav>
        {user && <UserDropDown user={user} initialStocks={initialStocks} />}
      </div>
    </header>
  )
}
