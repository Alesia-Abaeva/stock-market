'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { SearchCommand } from '@/components/widgets/SearchCommand'
import { NAV_ITEMS } from '@/shared/const/navigation'
import { StockWithWatchlistStatus } from '@/shared/types/global'

type NavItemsProps = {
  initialStocks: StockWithWatchlistStatus[]
}

export default function NavItems({ initialStocks }: NavItemsProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
      {NAV_ITEMS.map(({ href, label }) => {
        if (href === '/search') {
          return (
            <li key="search-trigger">
              <SearchCommand renderAs="text" label={label} initialStocks={initialStocks} />
            </li>
          )
        }

        return (
          <li key={href}>
            <Link
              href={href}
              className={`hover:text-yellow-500 transition-colors ${isActive(href) ? 'text-gray-100' : ''}`}
            >
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
