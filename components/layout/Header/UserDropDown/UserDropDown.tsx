import Image from 'next/image'
import Link from 'next/link'

export default function UserDropDown() {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image src="/assets/icons/logo.svg" width={140} height={32} alt="signalist logo" />
        </Link>

        <nav className="hidden sm:block"></nav>
      </div>
    </header>
  )
}
