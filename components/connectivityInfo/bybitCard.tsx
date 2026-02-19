'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useBybitKeyStatus, useAddBybitKey, useUpdateBybitKey, useRemoveBybitKey } from '@/hooks/use-bybit-query'
import { ApiClientError } from '@/lib/api/client'

export interface BybitCardProps {
  isAuthenticated: boolean
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function BybitCard({ isAuthenticated, onSuccess, onError }: BybitCardProps) {
  const { data: bybitStatus, isLoading: isCheckingStatus } = useBybitKeyStatus(isAuthenticated)
  const addKeyMutation = useAddBybitKey()
  const updateKeyMutation = useUpdateBybitKey()
  const removeKeyMutation = useRemoveBybitKey()

  const [bybitApiKey, setBybitApiKey] = useState('')
  const [bybitApiSecret, setBybitApiSecret] = useState('')

  const isConnected = bybitStatus?.hasKey ?? false
  const isPending = addKeyMutation.isPending || updateKeyMutation.isPending || removeKeyMutation.isPending

  const clearFields = () => {
    setBybitApiKey('')
    setBybitApiSecret('')
  }

  const handleAddKey = () => {
    if (!bybitApiKey.trim() || !bybitApiSecret.trim()) {
      onError('Please enter both API Key and API Secret')
      return
    }

    addKeyMutation.mutate(
      { apiKey: bybitApiKey.trim(), apiSecret: bybitApiSecret.trim() },
      {
        onSuccess: (response) => {
          onSuccess(response.message || 'Bybit API key added successfully')
          clearFields()
        },
        onError: (error) => {
          if (error instanceof ApiClientError) {
            onError(error.message || 'Failed to add Bybit API key')
          } else {
            onError('An unexpected error occurred')
          }
        },
      }
    )
  }

  const handleUpdateKey = () => {
    if (!bybitApiKey.trim() || !bybitApiSecret.trim()) {
      onError('Please enter both API Key and API Secret')
      return
    }

    updateKeyMutation.mutate(
      { apiKey: bybitApiKey.trim(), apiSecret: bybitApiSecret.trim() },
      {
        onSuccess: (response) => {
          onSuccess(response.message || 'Bybit API key updated successfully')
          clearFields()
        },
        onError: (error) => {
          if (error instanceof ApiClientError) {
            onError(error.message || 'Failed to update Bybit API key')
          } else {
            onError('An unexpected error occurred')
          }
        },
      }
    )
  }

  const handleRemoveKey = () => {
    removeKeyMutation.mutate(undefined, {
      onSuccess: (response) => {
        onSuccess(response.message || 'Bybit API key removed successfully')
        clearFields()
      },
      onError: (error) => {
        if (error instanceof ApiClientError) {
          onError(error.message || 'Failed to remove Bybit API key')
        } else {
          onError('An unexpected error occurred')
        }
      },
    })
  }

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Bybit API</h2>
          <p className="text-muted-foreground text-sm mt-1">Automate your cryptocurrency trading</p>
        </div>
        {isCheckingStatus ? (
          <div className="flex items-center gap-2 bg-muted/20 text-muted-foreground px-3 py-2 rounded-lg">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Checking...</span>
          </div>
        ) : isConnected ? (
          <div className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Connected</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-500 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Not Connected</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">API Key</label>
          <Input
            placeholder="Enter your Bybit API key"
            type="password"
            value={bybitApiKey}
            onChange={(e) => setBybitApiKey(e.target.value)}
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">API Secret</label>
          <Input
            placeholder="Enter your Bybit API secret"
            type="password"
            value={bybitApiSecret}
            onChange={(e) => setBybitApiSecret(e.target.value)}
            disabled={isPending}
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={isConnected ? handleUpdateKey : handleAddKey}
            disabled={isPending}
          >
            {(addKeyMutation.isPending || updateKeyMutation.isPending) ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isConnected ? 'Updating...' : 'Connecting...'}
              </>
            ) : (
              isConnected ? 'Update' : 'Enable'
            )}
          </Button>
          {isConnected && (
            <Button
              variant="ghost"
              onClick={handleRemoveKey}
              disabled={isPending}
            >
              {removeKeyMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
