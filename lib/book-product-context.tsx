'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Product } from '@/lib/payments/catalog'

type BookProductContextType = {
  product: Product | null
  loading: boolean
}

const BookProductContext = createContext<BookProductContextType>({
  product: null,
  loading: true,
})

export function BookProductProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/book/pricing')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.product) setProduct(d.product)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <BookProductContext.Provider value={{ product, loading }}>
      {children}
    </BookProductContext.Provider>
  )
}

export const useBookProduct = () => useContext(BookProductContext)
