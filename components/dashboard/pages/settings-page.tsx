"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and notifications</p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="bg-secondary border-b border-border rounded-none">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Critical Notifications</h3>
            <p className="text-muted-foreground text-sm mb-4">Events requiring immediate attention</p>
            <div className="space-y-4">
              {[
                { label: "Merchant Payment Failed", desc: "When a merchant fails to complete payment" },
                { label: "Appeal Triggered", desc: "When a dispute or appeal is initiated" },
                { label: "API Failure", desc: "When API connections encounter errors" },
                { label: "Fraud Suspicion", desc: "When suspicious activity is detected" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground font-medium">{item.label}</p>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Warning Notifications</h3>
            <p className="text-muted-foreground text-sm mb-4">Non-critical alerts to keep you informed</p>
            <div className="space-y-4">
              {[
                { label: "Low Account Balance", desc: "When account balance falls below threshold" },
                { label: "High Risk Exposure", desc: "When risk exposure exceeds safe levels" },
                { label: "Computation Power Low", desc: "When subscription computation power is running low" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground font-medium">{item.label}</p>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Informational Notifications</h3>
            <p className="text-muted-foreground text-sm mb-4">General system updates and reminders</p>
            <div className="space-y-4">
              {[
                { label: "Successful Automation Events", desc: "Notifications for completed automated trades" },
                { label: "Completed Payouts", desc: "Confirmation of successful payout transfers" },
                { label: "Subscription Reminders", desc: "Reminders about upcoming subscription renewals" },
                { label: "General Updates", desc: "New features and platform improvements" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground font-medium">{item.label}</p>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </Card>
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
        <TabsContent value="automation" className="mt-6">
          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Automation Settings</h3>
            <p className="text-muted-foreground mb-6">Configure automated trading rules and strategies</p>

            <div className="space-y-4 text-center py-8">
              <p className="text-muted-foreground">Automation configuration coming soon</p>
              <p className="text-sm text-muted-foreground">
                Auto buy/sell rules, stop-loss/take-profit settings, and risk configuration will be available shortly
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
