'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { StatusTracker } from '@/components/status-tracker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, Lock, Palette, Database } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    analysisAlerts: true,
    exportReminders: true,
    darkMode: true,
    autoExport: false,
    retentionDays: '90',
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and system preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="border-b border-border/50 w-full justify-start bg-transparent p-0">
          <TabsTrigger
            value="notifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent"
          >
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent"
          >
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="data"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent"
          >
            <Database className="w-4 h-4 mr-2" />
            Data
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="email-notif"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked as boolean })
                    }
                  />
                  <label htmlFor="email-notif" className="text-sm cursor-pointer">
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive email alerts</p>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="analysis-alerts"
                    checked={settings.analysisAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, analysisAlerts: checked as boolean })
                    }
                  />
                  <label htmlFor="analysis-alerts" className="text-sm cursor-pointer">
                    <p className="font-medium">Analysis Alerts</p>
                    <p className="text-xs text-muted-foreground">When analysis completes</p>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="export-reminders"
                    checked={settings.exportReminders}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, exportReminders: checked as boolean })
                    }
                  />
                  <label htmlFor="export-reminders" className="text-sm cursor-pointer">
                    <p className="font-medium">Export Reminders</p>
                    <p className="text-xs text-muted-foreground">Before exports expire</p>
                  </label>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Processing Status */}
          <StatusTracker />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Current Password</label>
                <Input type="password" className="bg-input border-border/50" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">New Password</label>
                <Input type="password" className="bg-input border-border/50" />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Theme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, darkMode: checked as boolean })
                  }
                />
                <label htmlFor="dark-mode" className="text-sm cursor-pointer font-medium">
                  Dark Mode (Enabled)
                </label>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Theme
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Data Retention (days)
                </label>
                <Input
                  type="number"
                  value={settings.retentionDays}
                  onChange={(e) =>
                    setSettings({ ...settings, retentionDays: e.target.value })
                  }
                  className="bg-input border-border/50"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Older photos will be automatically archived
                </p>
              </div>
              <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                <Checkbox
                  id="auto-export"
                  checked={settings.autoExport}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoExport: checked as boolean })
                  }
                />
                <label htmlFor="auto-export" className="text-sm cursor-pointer flex-1">
                  <p className="font-medium">Auto-Export</p>
                  <p className="text-xs text-muted-foreground">Automatically export reports weekly</p>
                </label>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
