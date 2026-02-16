/**
 * Shared types for automation settings UI
 */

export interface AutomationSettings {
  autoPayEnabled: boolean
  autoReleaseEnabled: boolean
  requireAmountMatch: boolean
  notifyOnAutomation: boolean
  notifyOnManualReview: boolean
  notifyOnErrors: boolean
  amountTolerance: number
  minPaymentConfirmationTime: number
}

export const DEFAULT_AUTOMATION_SETTINGS: AutomationSettings = {
  autoPayEnabled: true,
  autoReleaseEnabled: true,
  requireAmountMatch: true,
  notifyOnAutomation: false,
  notifyOnManualReview: true,
  notifyOnErrors: true,
  amountTolerance: 5,
  minPaymentConfirmationTime: 300,
}
