import Image from 'next/image'
import Link from 'next/link'

import { NavItems } from './NavItems'
import { UserDropDown } from './UserDropDown'

export default function Header() {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image src="/assets/icons/logo.svg" width={140} height={32} alt="signalist logo" />
        </Link>

        <nav className="hidden sm:block">
          <NavItems />
        </nav>
        <UserDropDown />
      </div>
    </header>
  )
}
