'use client'

import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  useOrderRules,
  useStartAutomation,
  useStopAutomation,
  useUpdateOrderRules,
} from '@/hooks/use-automation-query'
import { useToast } from '@/components/ui/use-toast'
import { ApiClientError } from '@/lib/api/client'
import { extractErrorMessage } from '@/lib/utils/error-handling'
import type { OrderRulesResponse } from '@/lib/services/automation.service'
import { Button } from '@/components/ui/button'

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

function mapOrderRulesToSettings(rules: OrderRulesResponse | undefined): AutomationSettings {
  if (!rules) return DEFAULT_AUTOMATION_SETTINGS
  return {
    ...DEFAULT_AUTOMATION_SETTINGS,
    autoPayEnabled: rules.autoPayEnabled ?? DEFAULT_AUTOMATION_SETTINGS.autoPayEnabled,
    autoReleaseEnabled: rules.autoReleaseEnabled ?? DEFAULT_AUTOMATION_SETTINGS.autoReleaseEnabled,
    requireAmountMatch: rules.requireAmountMatch ?? DEFAULT_AUTOMATION_SETTINGS.requireAmountMatch,
    notifyOnAutomation: rules.notifyOnAutomation ?? DEFAULT_AUTOMATION_SETTINGS.notifyOnAutomation,
    notifyOnManualReview: rules.notifyOnManualReview ?? DEFAULT_AUTOMATION_SETTINGS.notifyOnManualReview,
    notifyOnErrors: rules.notifyOnErrors ?? DEFAULT_AUTOMATION_SETTINGS.notifyOnErrors,
    amountTolerance: rules.amountTolerance ?? DEFAULT_AUTOMATION_SETTINGS.amountTolerance,
    minPaymentConfirmationTime:
      rules.minPaymentConfirmationTime ?? DEFAULT_AUTOMATION_SETTINGS.minPaymentConfirmationTime,
  }
}

export function Automation() {
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const { data: orderRules, isLoading: isLoadingRules, isError: isRulesError } = useOrderRules(isAuthenticated)
  const startMutation = useStartAutomation()
  const stopMutation = useStopAutomation()
  const updateMutation = useUpdateOrderRules()

  const [automationSettings, setAutomationSettings] = useState<AutomationSettings>(DEFAULT_AUTOMATION_SETTINGS)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    if (orderRules == null || hasHydrated) return
    setAutomationSettings(mapOrderRulesToSettings(orderRules))
    setHasHydrated(true)
  }, [orderRules, hasHydrated])

  const isEnableAutomationPending = startMutation.isPending || stopMutation.isPending

  const automationEnabled = orderRules?.automationEnabled ?? false

  const handleToggleChange = (key: keyof AutomationSettings | 'enableAutomation') => {
    if (key === 'enableAutomation') {
      const nextEnabled = !automationEnabled
      if (nextEnabled) {
        startMutation.mutate(undefined, {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Automation started successfully' })
          },
          onError: (error) => {
            const msg = error instanceof ApiClientError ? error.message : extractErrorMessage(error, 'Failed to start automation')
            toast({ title: 'Error', description: msg, variant: 'destructive' })
          },
        })
      } else {
        stopMutation.mutate(undefined, {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Automation stopped successfully' })
          },
          onError: (error) => {
            const msg = error instanceof ApiClientError ? error.message : extractErrorMessage(error, 'Failed to stop automation')
            toast({ title: 'Error', description: msg, variant: 'destructive' })
          },
        })
      }
      return
    }
    setAutomationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleNumberInputChange = (key: keyof AutomationSettings, value: number) => {
    if (key === 'amountTolerance' && value < 0) return
    setAutomationSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = () => {
    updateMutation.mutate(
      {
        autoPayEnabled: automationSettings.autoPayEnabled,
        autoReleaseEnabled: automationSettings.autoReleaseEnabled,
        requireAmountMatch: automationSettings.requireAmountMatch,
        amountTolerance: automationSettings.amountTolerance,
        minPaymentConfirmationTime: automationSettings.minPaymentConfirmationTime,
        notifyOnAutomation: automationSettings.notifyOnAutomation,
        notifyOnManualReview: automationSettings.notifyOnManualReview,
        notifyOnErrors: automationSettings.notifyOnErrors,
      },
      {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Settings saved successfully' })
        },
        onError: (error) => {
          const msg = error instanceof ApiClientError ? error.message : extractErrorMessage(error, 'Failed to save settings')
          toast({ title: 'Error', description: msg, variant: 'destructive' })
        },
      }
    )
  }

  const isFormDisabled = isLoadingRules || isRulesError
  const isSaving = updateMutation.isPending

  return (
    <>
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Automated Payment Settings</h3>
        <p className="text-muted-foreground mb-6">Control how automated payments and releases are processed</p>

        {isRulesError && (
          <p className="text-destructive text-sm mb-4">Failed to load automation settings. Please refresh the page.</p>
        )}

        <div className="space-y-6">
          {/* Enable Automation */}
          <div className="flex items-start justify-between pb-4 border-b border-border">
            <div className="flex-1">
              <p className="text-foreground font-medium">Enable Automation</p>
              <p className="text-muted-foreground text-sm">Start or stop the automation runner (order and ad polling)</p>
            </div>
            <Switch
              checked={automationEnabled}
              onCheckedChange={() => handleToggleChange('enableAutomation')}
              disabled={isFormDisabled || isEnableAutomationPending}
            />
          </div>
          {/* Auto Pay Enabled */}
          <div className="flex items-start justify-between pb-4 border-b border-border">
            <div className="flex-1">
              <p className="text-foreground font-medium">Automatic Payment Processing</p>
              <p className="text-muted-foreground text-sm">Automatically process incoming payments without manual review</p>
            </div>
            <Switch
              checked={automationSettings.autoPayEnabled}
              onCheckedChange={() => handleToggleChange('autoPayEnabled')}
              disabled={isFormDisabled}
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
              onCheckedChange={() => handleToggleChange('autoReleaseEnabled')}
              disabled={isFormDisabled}
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
              onCheckedChange={() => handleToggleChange('requireAmountMatch')}
              disabled={isFormDisabled}
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
                onChange={(e) => handleNumberInputChange('amountTolerance', parseInt(e.target.value, 10) || 0)}
                className="w-20 px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                disabled={isFormDisabled}
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
                onChange={(e) => handleNumberInputChange('minPaymentConfirmationTime', parseInt(e.target.value, 10) || 0)}
                className="w-24 px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                disabled={isFormDisabled}
              />
              <span className="text-muted-foreground text-sm">sec</span>
            </div>
          </div>

          <Button
            onClick={handleSaveSettings}
            disabled={isFormDisabled || isSaving}
            className="mt-2"
          >
            {isSaving ? 'Saving…' : 'Save payment settings'}
          </Button>
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
              onCheckedChange={() => handleToggleChange('notifyOnAutomation')}
              disabled={isFormDisabled}
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
              onCheckedChange={() => handleToggleChange('notifyOnManualReview')}
              disabled={isFormDisabled}
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
              onCheckedChange={() => handleToggleChange('notifyOnErrors')}
              disabled={isFormDisabled}
            />
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-4">Notification preferences are saved with the &quot;Save payment settings&quot; button above.</p>
      </Card>
    </>
  )
}
