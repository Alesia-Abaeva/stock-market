import React from 'react'

import { Header } from '@/components/layout'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="min-h-screen text-gray-400">
      <Header />
      <div className="container py-10">{children}</div>
    </main>
  )
}
