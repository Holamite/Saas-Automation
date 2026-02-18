'use client'

import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'
import { useAutomationPaymentForm } from '@/hooks/use-automation-payment-form'
import { OrderAutomationCard } from '@/components/dashboard/settingInfo/OrderAutomationCard'
import { AdStrategyCard } from '@/components/dashboard/settingInfo/AdStrategyCard'
import { PaymentSettingsCard } from '@/components/dashboard/settingInfo/PaymentSettingsCard'
import { AutomationNotificationsCard } from '@/components/dashboard/settingInfo/AutomationNotificationsCard'

export function Automation() {
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const paymentForm = useAutomationPaymentForm(isAuthenticated, {
    onSuccess: (msg) => toast({ title: 'Success', description: msg }),
    onError: (msg) => toast({ title: 'Error', description: msg, variant: 'destructive' }),
  })

  return (
    <>
      <PaymentSettingsCard
        automationSettings={paymentForm.automationSettings}
        automationEnabled={paymentForm.automationEnabled}
        isFormDisabled={paymentForm.isFormDisabled}
        isSaving={paymentForm.isSaving}
        isEnableAutomationPending={paymentForm.isEnableAutomationPending}
        isRulesError={paymentForm.isRulesError}
        onToggleChange={paymentForm.handleToggleChange}
        onNumberInputChange={paymentForm.handleNumberInputChange}
        onSaveSettings={paymentForm.handleSaveSettings}
      />
      <AutomationNotificationsCard
        automationSettings={paymentForm.automationSettings}
        isFormDisabled={paymentForm.isFormDisabled}
        onToggleChange={paymentForm.handleToggleChange}
      />
      <OrderAutomationCard
        isFormDisabled={paymentForm.isFormDisabled}
        onSuccess={(msg) => toast({ title: 'Success', description: msg })}
        onError={(msg) => toast({ title: 'Error', description: msg, variant: 'destructive' })}
      />
      <AdStrategyCard
        isAuthenticated={isAuthenticated}
        onSuccess={(msg) => toast({ title: 'Success', description: msg })}
        onError={(msg) => toast({ title: 'Error', description: msg, variant: 'destructive' })}
      />
    </>
  )
}
