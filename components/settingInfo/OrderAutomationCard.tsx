'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useEnableOrderType, useDisableOrderType } from '@/hooks/use-automation-query'
import type { OrderAutomationType } from '@/lib/services/automation.service'
import { ApiClientError } from '@/lib/api/client'
import { extractErrorMessage } from '@/lib/utils/error-handling'

export interface OrderAutomationCardProps {
  isFormDisabled?: boolean
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function OrderAutomationCard({
  isFormDisabled = false,
  onSuccess,
  onError,
}: OrderAutomationCardProps) {
  const enableOrderMutation = useEnableOrderType()
  const disableOrderMutation = useDisableOrderType()
  const [orderTypeEnabled, setOrderTypeEnabled] = useState<Record<OrderAutomationType, boolean>>({
    buy: false,
    sell: false,
    both: false,
  })
  const isPending = enableOrderMutation.isPending || disableOrderMutation.isPending

  const handleToggle = (type: OrderAutomationType, checked: boolean) => {
    if (checked) {
      enableOrderMutation.mutate(type, {
        onSuccess: (res) => {
          setOrderTypeEnabled({ buy: false, sell: false, both: false, [type]: true })
          onSuccess(res.message)
        },
        onError: (error) => {
          const msg =
            error instanceof ApiClientError
              ? error.message
              : extractErrorMessage(error, 'Failed to enable order automation')
          onError(msg)
        },
      })
    } else {
      disableOrderMutation.mutate(undefined, {
        onSuccess: (res) => {
          setOrderTypeEnabled({ buy: false, sell: false, both: false })
          onSuccess(res.message)
        },
        onError: (error) => {
          const msg =
            error instanceof ApiClientError
              ? error.message
              : extractErrorMessage(error, 'Failed to disable order automation')
          onError(msg)
        },
      })
    }
  }

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Order automation type</h3>
      <p className="text-muted-foreground mb-6">Choose which order types to automate: buy, sell, or both</p>

      <div className="space-y-6">
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex-1">
            <p className="text-foreground font-medium">Automate buy orders</p>
            <p className="text-muted-foreground text-sm">Enable automation for buy orders only</p>
          </div>
          <Switch
            checked={orderTypeEnabled.buy}
            onCheckedChange={(checked) => handleToggle('buy', checked)}
            disabled={isFormDisabled || isPending}
          />
        </div>
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex-1">
            <p className="text-foreground font-medium">Automate sell orders</p>
            <p className="text-muted-foreground text-sm">Enable automation for sell orders only</p>
          </div>
          <Switch
            checked={orderTypeEnabled.sell}
            onCheckedChange={(checked) => handleToggle('sell', checked)}
            disabled={isFormDisabled || isPending}
          />
        </div>
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex-1">
            <p className="text-foreground font-medium">Automate buy and sell</p>
            <p className="text-muted-foreground text-sm">Enable automation for both buy and sell orders</p>
          </div>
          <Switch
            checked={orderTypeEnabled.both}
            onCheckedChange={(checked) => handleToggle('both', checked)}
            disabled={isFormDisabled || isPending}
          />
        </div>
      </div>
    </Card>
  )
}
