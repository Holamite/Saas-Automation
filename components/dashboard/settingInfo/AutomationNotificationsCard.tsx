'use client'

import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import type { AutomationSettings } from '@/lib/types/automation.types'

export interface AutomationNotificationsCardProps {
  automationSettings: AutomationSettings
  isFormDisabled: boolean
  onToggleChange: (key: keyof AutomationSettings) => void
}

export function AutomationNotificationsCard({
  automationSettings,
  isFormDisabled,
  onToggleChange,
}: AutomationNotificationsCardProps) {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Automation Notifications</h3>
      <p className="text-muted-foreground mb-6">Choose which automation events trigger notifications</p>

      <div className="space-y-6">
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex-1">
            <p className="text-foreground font-medium">Notify on Successful Automation</p>
            <p className="text-muted-foreground text-sm">Receive alerts when automated payments and releases complete successfully</p>
          </div>
          <Switch
            checked={automationSettings.notifyOnAutomation}
            onCheckedChange={() => onToggleChange('notifyOnAutomation')}
            disabled={isFormDisabled}
          />
        </div>

        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex-1">
            <p className="text-foreground font-medium">Notify on Manual Review Required</p>
            <p className="text-muted-foreground text-sm">Alert when a transaction requires manual intervention or review</p>
          </div>
          <Switch
            checked={automationSettings.notifyOnManualReview}
            onCheckedChange={() => onToggleChange('notifyOnManualReview')}
            disabled={isFormDisabled}
          />
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-foreground font-medium">Notify on Automation Errors</p>
            <p className="text-muted-foreground text-sm">Alert when automation encounters errors or fails to process</p>
          </div>
          <Switch
            checked={automationSettings.notifyOnErrors}
            onCheckedChange={() => onToggleChange('notifyOnErrors')}
            disabled={isFormDisabled}
          />
        </div>
      </div>
      <p className="text-muted-foreground text-sm mt-4">
        Notification preferences are saved with the &quot;Save payment settings&quot; button above.
      </p>
    </Card>
  )
}
