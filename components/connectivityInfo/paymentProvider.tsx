'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { PaymentProviderName, UserPaymentProvider } from '@/lib/services/payment.service'
import { getProviderId } from '@/lib/services/payment.service'
import { SUPPORTED_BANKS } from '../../lib/types/bankApiCard.types'

export interface PaymentProviderListProps {
    /** Connected providers from parent (no duplicate fetches) */
    providers: UserPaymentProvider[]
    /** Currently primary provider id */
    primaryProviderId: PaymentProviderName | null
    /** Callback when user sets a provider as primary */
    onSetPrimary: (name: PaymentProviderName) => void
    /** Callback when user wants to update a provider (selects it in parent form) */
    onSelectForUpdate: (name: PaymentProviderName) => void
    /** True when set-primary request is in flight */
    isSettingPrimary: boolean
}

export default function PaymentProvider({
    providers,
    primaryProviderId,
    onSetPrimary,
    onSelectForUpdate,
    isSettingPrimary,
}: PaymentProviderListProps) {
    if (!providers?.length) return null

    const validProviders = providers.filter((p) => getProviderId(p))

    if (validProviders.length === 0) return null

    return (
        <Card className="bg-card border-border p-6 mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Connected providers</h3>
            <div className="space-y-3">
                {validProviders.map((provider) => {
                    const id = getProviderId(provider)!
                    const label = SUPPORTED_BANKS.find((b) => b.value === id)?.label ?? id
                    const isPrimary = primaryProviderId === id

                    return (
                        <div
                            key={id}
                            className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-secondary/30"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-foreground">{label}</span>
                                {isPrimary && (
                                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                                        Primary
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {!isPrimary && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onSetPrimary(id)}
                                        disabled={isSettingPrimary}
                                    >
                                        {isSettingPrimary ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            'Set as primary'
                                        )}
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onSelectForUpdate(id)}
                                >
                                    Update
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}
