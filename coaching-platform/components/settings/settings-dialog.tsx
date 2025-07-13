"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Moon, Sun, Globe, Lock, Eye, MessageSquare, Mail, Phone, Volume2, Zap, Shield, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SettingsDialogProps {
  trigger: React.ReactNode;
}

export function SettingsDialog({ trigger }: SettingsDialogProps) {
  const [notifications, setNotifications] = useState({
    all: true,
    email: true,
    push: true,
    sms: false,
    inApp: true,
  })

  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    allowMessaging: true,
  })

  const [appearance, setAppearance] = useState({
    theme: "system",
    reducedMotion: false,
  })

  const saveSettings = () => {
    toast.success("Settings saved successfully")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] backdrop-blur-md bg-black/70 border border-white/10 shadow-xl rounded-xl overflow-hidden">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white/80 to-white bg-clip-text text-transparent">
            Settings
          </DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-white/10">
                <Lock className="h-4 w-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-white/10">
                <Eye className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="notifications" className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">All Notifications</p>
                      <p className="text-xs text-muted-foreground">Master toggle for all notifications</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.all} 
                    onCheckedChange={(checked) => setNotifications({...notifications, all: checked})}
                  />
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    disabled={!notifications.all}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive notifications in browser</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push} 
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    disabled={!notifications.all}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Whatsapp Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.sms} 
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                    disabled={!notifications.all}
                  />
                </div>
                
                
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10">
                      <Eye className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Show Online Status</p>
                      <p className="text-xs text-muted-foreground">Let others see when you're online</p>
                    </div>
                  </div>
                  <Switch 
                    checked={privacy.showOnlineStatus} 
                    onCheckedChange={(checked) => setPrivacy({...privacy, showOnlineStatus: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Allow Messaging</p>
                      <p className="text-xs text-muted-foreground">Control who can message you</p>
                    </div>
                  </div>
                  <Switch 
                    checked={privacy.allowMessaging} 
                    onCheckedChange={(checked) => setPrivacy({...privacy, allowMessaging: checked})}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                {/* Theme selection option removed as requested */}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10">
                      <Volume2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Reduced Motion</p>
                      <p className="text-xs text-muted-foreground">Reduce motion effects</p>
                    </div>
                  </div>
                  <Switch 
                    checked={appearance.reducedMotion} 
                    onCheckedChange={(checked) => setAppearance({...appearance, reducedMotion: checked})}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-between border-t border-white/10 pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={saveSettings} className="bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/10">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
