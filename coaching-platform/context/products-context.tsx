"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/config"

export interface Product {
  id: string
  [key: string]: any
}

interface ProductsContextType {
  products: Product[]
  loading: boolean
  refresh: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAndCache = async () => {
    console.log("[ProductsProvider] Fetching products from Firestore…")
    try {
      const snap = await getDocs(collection(db, "products"))
      const data: Product[] = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      console.log(`[ProductsProvider] Fetched ${data.length} products`)
      setProducts(data)
      console.log("[ProductsProvider] Writing productsCache to localStorage")
      localStorage.setItem("productsCache", JSON.stringify(data))
      localStorage.setItem("productsCacheTime", Date.now().toString())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("[ProductsProvider] Checking for productsCache in localStorage")
    const cached = localStorage.getItem("productsCache")
    if (cached) {
      try {
        console.log("[ProductsProvider] Hydrating products from localStorage cache")
        setProducts(JSON.parse(cached))
        setLoading(false)
      } catch {
        // ignore JSON parse errors
      }
    }
    // always refresh in background to keep data fresh
    fetchAndCache()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ProductsContext.Provider value={{ products, loading, refresh: fetchAndCache }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider")
  return ctx
}
