"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { ArrowUpRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SetupOverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  walletSetup: boolean
  bybitConnected: boolean
  onWalletSetupComplete: () => void
  onBybitConnect: () => void
  onSkip: () => void
}

export function SetupOverlay({
  open,
  onOpenChange,
  walletSetup,
  bybitConnected,
  onWalletSetupComplete,
  onBybitConnect,
  onSkip,
}: SetupOverlayProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) onSkip()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md animate-in fade-in" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none">
          <div className="w-full max-w-2xl">
            <div className="relative rounded-2xl border border-primary/20 shadow-2xl overflow-hidden bg-linear-to-br from-card via-card/80 to-card/60 p-8 animate-in zoom-in-95">
              <div className="mb-6">
                <Dialog.Title className="text-2xl font-bold text-foreground mb-2">Complete Your Setup</Dialog.Title>
                <Dialog.Description className="text-muted-foreground">
                  Connect your wallet and link your Bybit account to get started with Doolf automation.
                </Dialog.Description>
              </div>

              <div className="space-y-4 mb-8">
                <div
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    walletSetup
                      ? "border-primary/50 bg-primary/10"
                      : "border-border bg-secondary/30 hover:border-primary/30 hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                        walletSetup ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {walletSetup ? "✓" : "1"}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${walletSetup ? "text-primary" : "text-foreground"}`}>
                        Set Up Your Wallet
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Create and verify your NGN Wallet for seamless transactions.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    bybitConnected
                      ? "border-primary/50 bg-primary/10"
                      : "border-border bg-secondary/30 hover:border-primary/30 hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                        bybitConnected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {bybitConnected ? "✓" : "2"}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${bybitConnected ? "text-primary" : "text-foreground"}`}>
                        Connect Bybit Account
                      </h4>
                      <p className="text-sm text-muted-foreground">Link your Bybit API keys to enable automated trading.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {!walletSetup && (
                  <Link href="/dashboard/wallet" onClick={onWalletSetupComplete}>
                    <Button className="w-full py-5 font-semibold">
                      Set Up Wallet <ArrowUpRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                )}
                {!bybitConnected && (
                  <Link href="/dashboard/connectivity" onClick={onBybitConnect}>
                    <Button variant="outline" className="w-full py-5 font-semibold">
                      Link Bybit Account <ArrowUpRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>

              <Dialog.Close asChild>
                <button
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm transition"
                  aria-label="Close setup dialog"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div className="text-center mt-4">
              <Dialog.Close asChild>
                <button
                  className="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1 transition"
                  aria-label="Skip setup for now"
                >
                  Skip for now →
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
