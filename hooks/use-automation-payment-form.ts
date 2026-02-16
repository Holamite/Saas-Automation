/**
 * Hook for payment settings and notifications form state.
 * Shared by PaymentSettingsCard and AutomationNotificationsCard.
 */

import { useState, useEffect } from 'react'
import {
  useOrderRules,
  useStartAutomation,
  useStopAutomation,
  useUpdateOrderRules,
} from '@/hooks/use-automation-query'
import { mapOrderRulesToSettings } from '@/lib/utils/automation'
import { ApiClientError } from '@/lib/api/client'
import { extractErrorMessage } from '@/lib/utils/error-handling'
import type { AutomationSettings } from '@/lib/types/automation.types'

export interface AutomationPaymentFormCallbacks {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

export function useAutomationPaymentForm(
  enabled: boolean,
  callbacks?: AutomationPaymentFormCallbacks
) {
  const { data: orderRules, isLoading: isLoadingRules, isError: isRulesError } = useOrderRules(enabled)
  const startMutation = useStartAutomation()
  const stopMutation = useStopAutomation()
  const updateMutation = useUpdateOrderRules()

  const [automationSettings, setAutomationSettings] = useState<AutomationSettings>(
    mapOrderRulesToSettings(undefined)
  )
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    if (orderRules == null || hasHydrated) return
    setAutomationSettings(mapOrderRulesToSettings(orderRules))
    setHasHydrated(true)
  }, [orderRules, hasHydrated])

  const automationEnabled = orderRules?.automationEnabled ?? false
  const isFormDisabled = isLoadingRules || isRulesError
  const isEnableAutomationPending = startMutation.isPending || stopMutation.isPending
  const isSaving = updateMutation.isPending

  const handleToggleChange = (key: keyof AutomationSettings | 'enableAutomation') => {
    if (key === 'enableAutomation') {
      const nextEnabled = !automationEnabled
      if (nextEnabled) {
        startMutation.mutate(undefined, {
          onSuccess: () => callbacks?.onSuccess?.('Automation started successfully'),
          onError: (err) =>
            callbacks?.onError?.(
              err instanceof ApiClientError ? err.message : extractErrorMessage(err, 'Failed to start automation')
            ),
        })
      } else {
        stopMutation.mutate(undefined, {
          onSuccess: () => callbacks?.onSuccess?.('Automation stopped successfully'),
          onError: (err) =>
            callbacks?.onError?.(
              err instanceof ApiClientError ? err.message : extractErrorMessage(err, 'Failed to stop automation')
            ),
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
        onSuccess: () => callbacks?.onSuccess?.('Settings saved successfully'),
        onError: (err) =>
          callbacks?.onError?.(
            err instanceof ApiClientError ? err.message : extractErrorMessage(err, 'Failed to save settings')
          ),
      }
    )
  }

  return {
    orderRules,
    automationSettings,
    automationEnabled,
    isFormDisabled,
    isSaving,
    isEnableAutomationPending,
    isRulesError,
    handleToggleChange,
    handleNumberInputChange,
    handleSaveSettings,
  }
}
