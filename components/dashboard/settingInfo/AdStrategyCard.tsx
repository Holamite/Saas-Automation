'use client'

import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useAdStrategy, useUpdateAdStrategy, useResetVolumeTracking } from '@/hooks/use-automation-query'
import { ApiClientError } from '@/lib/api/client'
import { extractErrorMessage } from '@/lib/utils/error-handling'

export interface AdStrategyCardProps {
  isAuthenticated?: boolean
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function AdStrategyCard({
  isAuthenticated = true,
  onSuccess,
  onError,
}: AdStrategyCardProps) {
  const { data: adStrategy, isLoading: isLoadingAd, isError: isAdError } = useAdStrategy(isAuthenticated)
  const updateAdMutation = useUpdateAdStrategy()
  const resetVolumeMutation = useResetVolumeTracking()

  const isPending = updateAdMutation.isPending || resetVolumeMutation.isPending

  const buyAdEnabled = adStrategy?.buyAdEnabled ?? false
  const sellAdEnabled = adStrategy?.sellAdEnabled ?? false

  const handleResetVolume = () => {
    resetVolumeMutation.mutate(undefined, {
      onSuccess: (res) => onSuccess(res.message),
      onError: (error) => {
        const msg =
          error instanceof ApiClientError
            ? error.message
            : extractErrorMessage(error, 'Failed to reset volume tracking')
        onError(msg)
      },
    })
  }

  const handleToggleAd = (field: 'buyAdEnabled' | 'sellAdEnabled', value: boolean) => {
    updateAdMutation.mutate(
      { [field]: value },
      {
        onSuccess: () => onSuccess('Ad strategy updated'),
        onError: (error) => {
          const msg =
            error instanceof ApiClientError
              ? error.message
              : extractErrorMessage(error, 'Failed to update ad strategy')
          onError(msg)
        },
      }
    )
  }

  const isFormDisabled = isLoadingAd || isAdError

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Ad strategy</h3>
      <p className="text-muted-foreground mb-6">Configure ad automation: buy ads, sell ads, and volume tracking</p>

      {isAdError && (
        <p className="text-destructive text-sm mb-4">Failed to load ad strategy. Please refresh the page.</p>
      )}

      <div className="space-y-6">
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex-1">
            <p className="text-foreground font-medium">Buy ad enabled</p>
            <p className="text-muted-foreground text-sm">Automatically manage buy-side ads</p>
          </div>
          <Switch
            checked={buyAdEnabled}
            onCheckedChange={(checked) => handleToggleAd('buyAdEnabled', checked)}
            disabled={isFormDisabled || isPending}
          />
        </div>
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex-1">
            <p className="text-foreground font-medium">Sell ad enabled</p>
            <p className="text-muted-foreground text-sm">Automatically manage sell-side ads</p>
          </div>
          <Switch
            checked={sellAdEnabled}
            onCheckedChange={(checked) => handleToggleAd('sellAdEnabled', checked)}
            disabled={isFormDisabled || isPending}
          />
        </div>
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex-1">
            <p className="text-foreground font-medium">Reset volume tracking</p>
            <p className="text-muted-foreground text-sm">Reset ad volume tracking counters</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetVolume}
            disabled={isFormDisabled || isPending}
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  )
}
