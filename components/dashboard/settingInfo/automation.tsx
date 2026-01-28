import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'

interface AutomationSettings {
  autoPayEnabled: boolean
  autoReleaseEnabled: boolean
  requireAmountMatch: boolean
  notifyOnAutomation: boolean
  notifyOnManualReview: boolean
  notifyOnErrors: boolean
  amountTolerance: number
  minPaymentConfirmationTime: number
}

const DEFAULT_AUTOMATION_SETTINGS: AutomationSettings = {
  autoPayEnabled: true,
  autoReleaseEnabled: true,
  requireAmountMatch: true,
  notifyOnAutomation: false,
  notifyOnManualReview: true,
  notifyOnErrors: true,
  amountTolerance: 5,
  minPaymentConfirmationTime: 300,
}
export function Automation() {
  const [automationSettings, setAutomationSettings] = useState<AutomationSettings>(DEFAULT_AUTOMATION_SETTINGS)

  const handleToggleChange = (key: keyof AutomationSettings) => {
    setAutomationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleNumberInputChange = (key: keyof AutomationSettings, value: number) => {
    if (key === "amountTolerance" && value < 0) return
    setAutomationSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }
    
  return (
      <>
           <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Automated Payment Settings</h3>
            <p className="text-muted-foreground mb-6">Control how automated payments and releases are processed</p>

            <div className="space-y-6">
              {/* Auto Pay Enabled */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div className="flex-1">
                  <p className="text-foreground font-medium">Automatic Payment Processing</p>
                  <p className="text-muted-foreground text-sm">Automatically process incoming payments without manual review</p>
                </div>
                <Switch
                  checked={automationSettings.autoPayEnabled}
                  onCheckedChange={() => handleToggleChange("autoPayEnabled")}
                />
              </div>

              {/* Auto Release Enabled */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div className="flex-1">
                  <p className="text-foreground font-medium">Automatic Fund Release</p>
                  <p className="text-muted-foreground text-sm">Automatically release funds to connected accounts upon payment confirmation</p>
                </div>
                <Switch
                  checked={automationSettings.autoReleaseEnabled}
                  onCheckedChange={() => handleToggleChange("autoReleaseEnabled")}
                />
              </div>

              {/* Require Amount Match */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div className="flex-1">
                  <p className="text-foreground font-medium">Require Exact Amount Match</p>
                  <p className="text-muted-foreground text-sm">Only process payments that match the expected amount exactly (within tolerance)</p>
                </div>
                <Switch
                  checked={automationSettings.requireAmountMatch}
                  onCheckedChange={() => handleToggleChange("requireAmountMatch")}
                />
              </div>

              {/* Amount Tolerance */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div className="flex-1">
                  <p className="text-foreground font-medium">Amount Tolerance</p>
                  <p className="text-muted-foreground text-sm">NGN variance allowed when matching payment amounts</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={automationSettings.amountTolerance}
                    onChange={(e) => handleNumberInputChange("amountTolerance", parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-muted-foreground text-sm">₦</span>
                </div>
              </div>

              {/* Min Payment Confirmation Time */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div className="flex-1">
                  <p className="text-foreground font-medium">Minimum Payment Confirmation Time</p>
                  <p className="text-muted-foreground text-sm">Wait time before automatically processing confirmed payments (in seconds)</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="3600"
                    value={automationSettings.minPaymentConfirmationTime}
                    onChange={(e) => handleNumberInputChange("minPaymentConfirmationTime", parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-muted-foreground text-sm">sec</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Automation Notifications</h3>
            <p className="text-muted-foreground mb-6">Choose which automation events trigger notifications</p>

            <div className="space-y-6">
              {/* Notify on Automation */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div className="flex-1">
                  <p className="text-foreground font-medium">Notify on Successful Automation</p>
                  <p className="text-muted-foreground text-sm">Receive alerts when automated payments and releases complete successfully</p>
                </div>
                <Switch
                  checked={automationSettings.notifyOnAutomation}
                  onCheckedChange={() => handleToggleChange("notifyOnAutomation")}
                />
              </div>

              {/* Notify on Manual Review */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div className="flex-1">
                  <p className="text-foreground font-medium">Notify on Manual Review Required</p>
                  <p className="text-muted-foreground text-sm">Alert when a transaction requires manual intervention or review</p>
                </div>
                <Switch
                  checked={automationSettings.notifyOnManualReview}
                  onCheckedChange={() => handleToggleChange("notifyOnManualReview")}
                />
              </div>

              {/* Notify on Errors */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-foreground font-medium">Notify on Automation Errors</p>
                  <p className="text-muted-foreground text-sm">Alert when automation encounters errors or fails to process</p>
                </div>
                <Switch
                  checked={automationSettings.notifyOnErrors}
                  onCheckedChange={() => handleToggleChange("notifyOnErrors")}
                />
              </div>
            </div>
          </Card>   
      </>
  )
}
