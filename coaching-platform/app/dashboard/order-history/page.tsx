"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth-context"
import { getUserTransactions, getUserProducts, getUserCoachingPrograms } from "@/lib/firebase/firestore"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ChevronLeft, 
  Calendar, 
  Search,
  Download,
  Filter,
  ChevronDown,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Loader2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Types for order data
interface OrderItem {
  id: string
  date: string
  product: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  invoice: string
  type: 'transaction'
  originalData?: any
}

// Helper function to format dates
const formatDate = (dateString: string | Date | any) => {
  let date: Date
  if (typeof dateString === 'string') {
    date = new Date(dateString)
  } else if (dateString && typeof dateString === 'object' && 'toDate' in dateString) {
    // Handle Firestore Timestamp
    date = dateString.toDate()
  } else {
    date = new Date(dateString)
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Helper function to format currency
const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: currency.toUpperCase() === 'JPY' ? 0 : 2
  }).format(amount)
}

// Order status component with appropriate colors
const OrderStatus = ({ status }: { status: string }) => {
  const statusMap: Record<string, { color: string, icon: React.ReactNode }> = {
    'completed': { 
      color: 'bg-green-500/10 text-green-500 border-green-500/20', 
      icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />
    },
    'pending': { 
      color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', 
      icon: <Clock className="h-3.5 w-3.5 mr-1" />
    },
    'cancelled': { 
      color: 'bg-red-500/10 text-red-500 border-red-500/20', 
      icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />
    },
    'processing': { 
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', 
      icon: <HelpCircle className="h-3.5 w-3.5 mr-1" />
    }
  }

  const { color, icon } = statusMap[status.toLowerCase()] || statusMap['processing']

  return (
    <Badge variant="outline" className={`${color} flex items-center`}>
      {icon}
      <span>{status}</span>
    </Badge>
  )
}

export default function OrderHistoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentMonth, setCurrentMonth] = useState("March")
  const [sortOrder, setSortOrder] = useState("newest")
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch order history from Firebase
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user?.uid) return
      
      try {
        setLoading(true)
        setError(null)
        
        // Fetch transactions from Firebase
        const transactionsResult = await getUserTransactions(user.uid, 100) // Get up to 100 transactions
        
        if (transactionsResult.success && transactionsResult.data) {
          // Transform transaction data to OrderItem format
          const transformedOrders: OrderItem[] = transactionsResult.data.map((transaction: any) => ({
            id: transaction.transactionId || transaction.id || 'N/A',
            date: transaction.timestamp || transaction.createdAt || new Date().toISOString(),
            product: transaction.productTitle || 'Unknown Product',
            amount: transaction.amount || 0,
            currency: transaction.currency || 'USD',
            status: transaction.status === 'successful' ? 'Completed' : 
                   transaction.status === 'failed' ? 'Failed' : 
                   transaction.status || 'Processing',
            paymentMethod: transaction.paymentMethod === 'razorpay' ? 'Razorpay' :
                          transaction.paymentMethod === 'stripe' ? 'Stripe' :
                          transaction.paymentMethod === 'free' ? 'Free' :
                          transaction.paymentMethod || 'Unknown',
            invoice: `INV-${transaction.transactionId?.slice(-8) || 'UNKNOWN'}`,
            type: 'transaction' as const,
            originalData: transaction
          }))
          
          setOrders(transformedOrders)
        } else {
          console.error('Failed to fetch transactions:', transactionsResult.error)
          setError('Failed to load order history')
        }
      } catch (err) {
        console.error('Error fetching order history:', err)
        setError('An error occurred while loading your order history')
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrderHistory()
  }, [user?.uid])

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.invoice.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      filterStatus === "all" || 
      order.status.toLowerCase() === filterStatus.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  // Sort orders based on date
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB
  })



  return (
    <div className="container py-5 bg-black text-white min-h-screen">
      {/* Back button and status */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="mr-1" size={20} />
          <span className="text-lg font-medium">Order History</span>
        </button>
      </div>
      
      {/* Filters and search */}
      <Card className="bg-zinc-900 border border-zinc-800 shadow-xl mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-auto flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search orders..."
                className="pl-10 bg-zinc-800 border-zinc-700 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px] bg-zinc-800 border-zinc-700">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full md:w-[180px] bg-zinc-800 border-zinc-700">
                  <div className="flex items-center">
                    <ChevronDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by date" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Orders list */}
      <div className="space-y-4">
        {loading ? (
          <Card className="bg-zinc-900 border border-zinc-800 shadow-xl p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
              <h3 className="text-xl font-medium">Loading your order history...</h3>
              <p className="text-gray-400">Please wait while we fetch your orders</p>
            </div>
          </Card>
        ) : error ? (
          <Card className="bg-zinc-900 border border-zinc-800 shadow-xl p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h3 className="text-xl font-medium text-red-400">Error Loading Orders</h3>
              <p className="text-gray-400 max-w-md">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </Card>
        ) : sortedOrders.length > 0 ? (
          sortedOrders.map((order) => (
            <Card key={order.id} className="bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden hover:border-zinc-700 transition-all duration-200">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{order.product}</h3>
                        <OrderStatus status={order.status} />
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="mr-4">Transaction ID: {order.id}</span>
                        <span>Date: {formatDate(order.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-semibold">{formatCurrency(order.amount, order.currency)}</div>
                        <div className="text-sm text-gray-400">{order.paymentMethod}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-zinc-900 border border-zinc-800 shadow-xl p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <FileText className="h-12 w-12 text-gray-500" />
              <h3 className="text-xl font-medium">No orders found</h3>
              <p className="text-gray-400 max-w-md">
                {searchQuery || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria" 
                  : "You haven't placed any orders yet"}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
