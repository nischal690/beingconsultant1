"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/firebase/auth-context"
import { collection, query, orderBy, limit, getDocs, Timestamp, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { formatDistanceToNow } from "date-fns"

type Notification = {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: Date
  type: "info" | "success" | "warning" | "error"
  link?: string
  time?: string
  heading?: string
  body?: string
}

export function NotificationDropdown() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.uid) return

      try {
        setLoading(true)
        console.log("Fetching notifications for user:", user.uid)
        
        // Fetch notifications from the user's notification subcollection
        const notificationsRef = collection(db, "users", user.uid, "notifications")
        console.log("Notifications collection path:", `users/${user.uid}/notifications`)
        
        const q = query(notificationsRef, orderBy("time", "desc"), limit(5))
        const querySnapshot = await getDocs(q)
        
        console.log("Query snapshot size:", querySnapshot.size)
        
        const notificationData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Notification document data:", data)
          return {
            id: doc.id,
            title: data.heading || "Notification",
            message: data.body || "",
            read: data.read || false,
            createdAt: data.time instanceof Timestamp ? data.time.toDate() : new Date(),
            type: data.type || "info",
            link: data.link || "/dashboard",
            // Store original fields as well
            time: data.time,
            heading: data.heading,
            body: data.body
          }
        }) as Notification[];
        
        console.log("Processed notifications:", notificationData);
        
        setNotifications(notificationData)
        setUnreadCount(notificationData.filter(n => !n.read).length)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setLoading(false)
        
        // Fallback to mock data if there's an error
        const mockNotifications: Notification[] = [
          {
            id: "1",
            title: "New coaching session available",
            message: "Your next coaching session is now available for booking.",
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            type: "info",
            link: "/dashboard/coaching"
          },
          {
            id: "2",
            title: "Payment successful",
            message: "Your payment for Premium Coaching has been processed successfully.",
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            type: "success",
            link: "/dashboard/order-history"
          }
        ]

        setNotifications(mockNotifications)
        setUnreadCount(mockNotifications.filter(n => !n.read).length)
      }
    }

    fetchNotifications()
    
    // Set up a refresh interval to check for new notifications every 5 minutes
    const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [user])

  const markAsRead = async (id: string) => {
    if (!user?.uid) return;
    
    try {
      // Update the notification in Firestore
      const notificationRef = doc(db, "users", user.uid, "notifications", id);
      await updateDoc(notificationRef, {
        read: true
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Still update UI even if Firestore update fails
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative rounded-full bg-transparent border-white hover:bg-white hover:border-white hover:text-black transition-colors duration-200 header-icon-button"
        >
          <Bell className="h-4 w-4 text-white group-hover:text-black transition-colors duration-200 [.header-icon-button:hover_&]:text-black" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                {unreadCount} new
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
              onClick={() => markAsRead(notification.id)}
              asChild
            >
              <a href={notification.link || "#"}>
                <div className="flex w-full gap-2">
                  <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${getNotificationIcon(notification.type)}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-primary' : ''}`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </a>
            </DropdownMenuItem>
          ))
        )}
        {/* "View all notifications" link removed as requested */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
