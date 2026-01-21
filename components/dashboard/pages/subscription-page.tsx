"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "/month",
    volumeCapacity: "1,000 vc/month",
    features: [
      "Up to 2 trading accounts",
      "50 orders per month",
      "Basic reporting",
      "Email support",
      "Single user access",
    ],
  },
  {
    name: "Pro",
    price: "₦14,999",
    period: "/month",
    volumeCapacity: "50,000 vc/month",
    features: [
      "Up to 10 trading accounts",
      "Unlimited orders",
      "Advanced reporting",
      "Priority support",
      "Team access (3 users)",
      "Custom webhooks",
    ],
  },
 
  {
    name: "Custom",
    price: "Contact",
    period: "/custom pricing",
    volumeCapacity: "Custom vc/month",
    features: [
      "White-label solution",
      "Enterprise support",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated infrastructure",
    ],
  },
]

const topUpPackages = [
  { name: "Starter Pack", vc: "5,000 vc", price: "₦999"},
  { name: "Growth Pack", vc: "20,000 vc", price: "₦2,999"},
  { name: "Pro Pack", vc: "50,000 vc", price: "₦6,999"},
  { name: "Enterprise Pack", vc: "100,000 vc", price: "₦12,999"},
]

export function SubscriptionPage() {
  const [showTopUp, setShowTopUp] = useState(false)
  const { user } = useAuth()
  
  // Extract subscription data from user
  const subscriptionStatus = user?.subscription?.subscriptionStatus || 'Free'
  const nextBillingDate = user?.subscription?.nextBillingDate 
    ? new Date(user.subscription.nextBillingDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'N/A'
  
  // Extract volume capacity data from user
  const usedVC = user?.volumeCapacity?.usedVC || 0
  const monthlyVC = user?.volumeCapacity?.monthlyVC || 0
  const usagePercentage = user?.volumeCapacity?.usagePercentage || 0

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Subscription</h1>
        <p className="text-muted-foreground mt-2">Manage your subscription plan and billing</p>
      </div>

      {/* Current Plan Info */}
      <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-primary/20 p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
            <h2 className="text-3xl font-bold text-primary mb-2">{subscriptionStatus}</h2>
            <p className="text-muted-foreground">Next billing: {nextBillingDate}</p>
            <p className="text-sm text-foreground mt-3">
              <span className="font-semibold">Volume Capacity:</span> {usedVC.toLocaleString()} / {monthlyVC.toLocaleString()} vc used
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-4 md:mt-0">
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="tertiary">Upgrade</Button>
              <Button variant="tertiary" onClick={() => setShowTopUp(!showTopUp)}>
                Top-up
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {showTopUp && (
        <Card className="bg-primary/5 border-primary/30 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Add Volume Capacity</h3>
          </div>
          <p className="text-muted-foreground mb-6">Extend your volume capacity before the month ends</p>
          <div className="grid md:grid-cols-4 gap-4">
            {topUpPackages.map((pkg) => (
              <Card key={pkg.name} className="border-border bg-card p-4 hover:border-primary transition-colors">
                <h4 className="font-semibold text-foreground mb-2">{pkg.name}</h4>
                <p className="text-2xl font-bold text-primary mb-1">{pkg.vc}</p>
                <div className="mb-4">
                  <p className="text-primary font-bold">{pkg.price}</p>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Add to Plan</Button>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Subscription Plans */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">All Plans</h3>
        <div
          className="relative" 
        >
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
            >
              {plans.map((plan) => {
                const isCurrentPlan = plan.name.toLowerCase() === subscriptionStatus.toLowerCase()
                return (
                  <Card
                    key={plan.name}
                    className={`flex-shrink-0 w-full md:w-[calc(33.333%-16px)] p-8 border ${
                      isCurrentPlan ? "bg-primary/10 border-primary" : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-foreground mb-4">{plan.name}</h3>
                     {isCurrentPlan && (
                      <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-6 w-fit">
                        Current Plan
                      </div>
                    )}
                    </div>
                    <div className="mb-3">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                    </div>
                    <p className="text-sm text-primary font-semibold">{plan.volumeCapacity}</p>

                    <Button
                      className={`w-full py-6 ${
                        isCurrentPlan
                          ? "bg-secondary hover:bg-secondary/90"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      }`}
                    >
                      {isCurrentPlan ? "Current Plan" : plan.name === "Custom" ? "Contact Sales" : "Choose Plan"}
                    </Button>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                  </Card>
                )
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
