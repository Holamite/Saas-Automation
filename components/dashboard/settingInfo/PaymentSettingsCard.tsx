'use client'

import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import type { AutomationSettings } from '@/lib/types/automation.types'

export interface PaymentSettingsCardProps {
  automationSettings: AutomationSettings
  automationEnabled: boolean
  isFormDisabled: boolean
  isSaving: boolean
  isEnableAutomationPending: boolean
  isRulesError: boolean
  onToggleChange: (key: keyof AutomationSettings | 'enableAutomation') => void
  onNumberInputChange: (key: keyof AutomationSettings, value: number) => void
  onSaveSettings: () => void
}

export function PaymentSettingsCard({
  automationSettings,
  automationEnabled,
  isFormDisabled,
  isSaving,
  isEnableAutomationPending,
  isRulesError,
  onToggleChange,
  onNumberInputChange,
  onSaveSettings,
}: PaymentSettingsCardProps) {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Automated Payment Settings</h3>
      <p className="text-muted-foreground mb-6">Control how automated payments and releases are processed</p>

      {isRulesError && (
        <p className="text-destructive text-sm mb-4">Failed to load automation settings. Please refresh the page.</p>
      )}

      <div className="space-y-6">
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex-1">
            <p className="text-foreground font-medium">Enable Automation</p>
            <p className="text-muted-foreground text-sm">Start or stop the automation runner (order and ad polling)</p>
          </div>
          <Switch
            checked={automationEnabled}
            onCheckedChange={() => onToggleChange('enableAutomation')}
            disabled={isFormDisabled || isEnableAutomationPending}
          />
        </div>
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex-1">
            <p className="text-foreground font-medium">Automatic Payment Processing</p>
            <p className="text-muted-foreground text-sm">Automatically process incoming payments without manual review</p>
          </div>
          <Switch
            checked={automationSettings.autoPayEnabled}
            onCheckedChange={() => onToggleChange('autoPayEnabled')}
            disabled={isFormDisabled}
          />
        </div>

        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex-1">
            <p className="text-foreground font-medium">Automatic Fund Release</p>
            <p className="text-muted-foreground text-sm">Automatically release funds to connected accounts upon payment confirmation</p>
          </div>
          <Switch
            checked={automationSettings.autoReleaseEnabled}
            onCheckedChange={() => onToggleChange('autoReleaseEnabled')}
            disabled={isFormDisabled}
          />
        </div>

        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex-1">
            <p className="text-foreground font-medium">Require Exact Amount Match</p>
            <p className="text-muted-foreground text-sm">Only process payments that match the expected amount exactly (within tolerance)</p>
          </div>
          <Switch
            checked={automationSettings.requireAmountMatch}
            onCheckedChange={() => onToggleChange('requireAmountMatch')}
            disabled={isFormDisabled}
          />
        </div>

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
              onChange={(e) => onNumberInputChange('amountTolerance', parseInt(e.target.value, 10) || 0)}
              className="w-20 px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              disabled={isFormDisabled}
            />
            <span className="text-muted-foreground text-sm">₦</span>
          </div>
        </div>

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
              onChange={(e) => onNumberInputChange('minPaymentConfirmationTime', parseInt(e.target.value, 10) || 0)}
              className="w-24 px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              disabled={isFormDisabled}
            />
            <span className="text-muted-foreground text-sm">sec</span>
          </div>
        </div>

        <Button onClick={onSaveSettings} disabled={isFormDisabled || isSaving} className="mt-2">
          {isSaving ? 'Saving…' : 'Save payment settings'}
        </Button>
      </div>
    </Card>
  )
}
