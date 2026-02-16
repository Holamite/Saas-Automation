/**
 * Helpers for mapping automation API responses to UI state
 */

import type { OrderRulesResponse } from '@/lib/services/automation.service'
import type { AutomationSettings } from '@/lib/types/automation.types'
import { DEFAULT_AUTOMATION_SETTINGS } from '@/lib/types/automation.types'

export function mapOrderRulesToSettings(
  rules: OrderRulesResponse | undefined
): AutomationSettings {
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
