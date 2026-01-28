import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import React from 'react'   


const Notification = () => {
  return (
      <>
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
      </>
  )
}

export default Notification