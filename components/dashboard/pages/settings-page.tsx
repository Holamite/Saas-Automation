"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Automation } from "@/components/dashboard/settingInfo/automation"
import Notification from "../settingInfo/Notification"

export function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and notifications</p>
      </div>

      <Tabs defaultValue="notifications" className="w-full ">
        <TabsList className="bg-secondary border-b border-border rounded-none cursor-pointer">
          <TabsTrigger className="cursor-pointer" value="notifications">Notifications</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="management">Management</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="automation">Automation</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Notification/>
        </TabsContent>

        {/* Management Tab */}
        <TabsContent value="management" className="mt-6">
          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Management Settings</h3>
            <p className="text-muted-foreground mb-6">Configure team access and account management</p>

            <div className="space-y-4 text-center py-8">
              <p className="text-muted-foreground">Management features coming soon</p>
              <p className="text-sm text-muted-foreground">
                Role management, merchant onboarding, and data export will be available shortly
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="mt-6 space-y-6">
            <Automation/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
