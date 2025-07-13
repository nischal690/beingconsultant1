"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Moon, Sun, Globe, Lock, Eye, MessageSquare, Mail, Phone, Volume2, Zap, Shield } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    all: true,
    email: true,
    push: true,
    sms: false,
    inApp: true,
    marketing: false,
    updates: true,
    events: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    activityVisibility: "connections",
    showOnlineStatus: true,
    allowMessaging: true,
    dataCollection: true,
  })

  const [appearance, setAppearance] = useState({
    theme: "system",
    reducedMotion: false,
    highContrast: false,
    fontSize: "medium",
  })

  const saveSettings = () => {
    toast.success("Settings saved successfully")
  }

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white/80 to-white bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
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
          
          <TabsContent value="notifications" className="space-y-6">
            <Card className="backdrop-blur-md bg-black/60 border border-white/10 shadow-lg">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">All Notifications</p>
                        <p className="text-sm text-muted-foreground">Master toggle for all notifications</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.all} 
                      onCheckedChange={(checked) => setNotifications({...notifications, all: checked})}
                    />
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.email} 
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                      disabled={!notifications.all}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.push} 
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                      disabled={!notifications.all}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.sms} 
                      onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                      disabled={!notifications.all}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">In-App Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.inApp} 
                      onCheckedChange={(checked) => setNotifications({...notifications, inApp: checked})}
                      disabled={!notifications.all}
                    />
                  </div>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notification Types</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing</p>
                      <p className="text-sm text-muted-foreground">Receive marketing notifications</p>
                    </div>
                    <Switch 
                      checked={notifications.marketing} 
                      onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                      disabled={!notifications.all}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Updates</p>
                      <p className="text-sm text-muted-foreground">Receive update notifications</p>
                    </div>
                    <Switch 
                      checked={notifications.updates} 
                      onCheckedChange={(checked) => setNotifications({...notifications, updates: checked})}
                      disabled={!notifications.all}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Events</p>
                      <p className="text-sm text-muted-foreground">Receive event notifications</p>
                    </div>
                    <Switch 
                      checked={notifications.events} 
                      onCheckedChange={(checked) => setNotifications({...notifications, events: checked})}
                      disabled={!notifications.all}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/10 pt-6">
                <Button onClick={saveSettings} className="ml-auto bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/10">
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <Card className="backdrop-blur-md bg-black/60 border border-white/10 shadow-lg">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage your privacy and security preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                      </div>
                    </div>
                    <select 
                      className="bg-black/60 border border-white/20 rounded-md p-2 text-sm"
                      value={privacy.profileVisibility}
                      onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                    >
                      <option value="public">Public</option>
                      <option value="connections">Connections Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <Eye className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Activity Visibility</p>
                        <p className="text-sm text-muted-foreground">Control who can see your activity</p>
                      </div>
                    </div>
                    <select 
                      className="bg-black/60 border border-white/20 rounded-md p-2 text-sm"
                      value={privacy.activityVisibility}
                      onChange={(e) => setPrivacy({...privacy, activityVisibility: e.target.value})}
                    >
                      <option value="public">Public</option>
                      <option value="connections">Connections Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Allow Messaging</p>
                        <p className="text-sm text-muted-foreground">Control who can message you</p>
                      </div>
                    </div>
                    <Switch 
                      checked={privacy.allowMessaging} 
                      onCheckedChange={(checked) => setPrivacy({...privacy, allowMessaging: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Data Collection</p>
                        <p className="text-sm text-muted-foreground">Allow data collection for service improvement</p>
                      </div>
                    </div>
                    <Switch 
                      checked={privacy.dataCollection} 
                      onCheckedChange={(checked) => setPrivacy({...privacy, dataCollection: checked})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/10 pt-6">
                <Button onClick={saveSettings} className="ml-auto bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/10">
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card className="backdrop-blur-md bg-black/60 border border-white/10 shadow-lg">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how the application looks and feels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Theme selection option removed as requested */}
                  
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <Volume2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Reduced Motion</p>
                        <p className="text-sm text-muted-foreground">Reduce motion effects</p>
                      </div>
                    </div>
                    <Switch 
                      checked={appearance.reducedMotion} 
                      onCheckedChange={(checked) => setAppearance({...appearance, reducedMotion: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <Eye className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">High Contrast</p>
                        <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                      </div>
                    </div>
                    <Switch 
                      checked={appearance.highContrast} 
                      onCheckedChange={(checked) => setAppearance({...appearance, highContrast: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/5 border border-white/10">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Font Size</p>
                        <p className="text-sm text-muted-foreground">Adjust the font size</p>
                      </div>
                    </div>
                    <select 
                      className="bg-black/60 border border-white/20 rounded-md p-2 text-sm"
                      value={appearance.fontSize}
                      onChange={(e) => setAppearance({...appearance, fontSize: e.target.value})}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/10 pt-6">
                <Button onClick={saveSettings} className="ml-auto bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/10">
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
