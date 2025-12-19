"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "/month",
    computationPower: "1,000 ops/month",
    features: [
      "Up to 2 trading accounts",
      "50 orders per month",
      "Basic reporting",
      "Email support",
      "Single user access",
    ],
  },
  {
    name: "Starter",
    price: "₦4,999",
    period: "/month",
    computationPower: "10,000 ops/month",
    features: [
      "Up to 5 trading accounts",
      "200 orders per month",
      "Basic reporting",
      "Email support",
      "Single user access",
    ],
  },
  {
    name: "Pro",
    price: "₦14,999",
    period: "/month",
    computationPower: "50,000 ops/month",
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
    name: "Premium",
    price: "₦49,999",
    period: "/month",
    computationPower: "200,000 ops/month",
    features: [
      "Unlimited trading accounts",
      "Unlimited orders",
      "Advanced reporting & analytics",
      "24/7 phone support",
      "Unlimited team access",
      "Custom API endpoints",
      "Dedicated account manager",
    ],
    current: true,
  },
  {
    name: "Custom",
    price: "Contact",
    period: "/custom pricing",
    computationPower: "Custom ops/month",
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
  { name: "Starter Pack", ops: "5,000 ops", price: "₦999", valid: "7 days" },
  { name: "Growth Pack", ops: "20,000 ops", price: "₦2,999", valid: "30 days" },
  { name: "Pro Pack", ops: "50,000 ops", price: "₦6,999", valid: "30 days" },
  { name: "Enterprise Pack", ops: "100,000 ops", price: "₦12,999", valid: "60 days" },
]

export function SubscriptionPage() {
  const [showTopUp, setShowTopUp] = useState(false)
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const handlePrevPlan = () => {
    setCurrentPlanIndex((prev) => (prev === 0 ? Math.max(0, plans.length - 3) : prev - 1))
  }

  const handleNextPlan = () => {
    setCurrentPlanIndex((prev) => (prev >= plans.length - 3 ? 0 : prev + 1))
  }

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
            <h2 className="text-3xl font-bold text-primary mb-2">Premium</h2>
            <p className="text-muted-foreground">Next billing: December 31, 2025</p>
            <p className="text-sm text-foreground mt-3">
              <span className="font-semibold">Computation Power:</span> 180,000 / 200,000 ops used
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-4 md:mt-0">
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full w-[90%] bg-primary rounded-full" />
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
            <h3 className="text-xl font-semibold text-foreground">Add Computation Power</h3>
          </div>
          <p className="text-muted-foreground mb-6">Extend your computation power before the month ends</p>
          <div className="grid md:grid-cols-4 gap-4">
            {topUpPackages.map((pkg) => (
              <Card key={pkg.name} className="border-border bg-card p-4 hover:border-primary transition-colors">
                <h4 className="font-semibold text-foreground mb-2">{pkg.name}</h4>
                <p className="text-2xl font-bold text-primary mb-1">{pkg.ops}</p>
                <p className="text-sm text-muted-foreground mb-3">Valid: {pkg.valid}</p>
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
          onMouseEnter={() => {
            setShowLeftArrow(true)
            setShowRightArrow(true)
          }}
          onMouseLeave={() => {
            setShowLeftArrow(false)
            setShowRightArrow(false)
          }}
        >
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentPlanIndex * 34}%)` }}
            >
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`flex-shrink-0 w-full md:w-[calc(33.333%-16px)] p-8 border ${
                    plan.current ? "bg-primary/10 border-primary" : "bg-card border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground mb-4">{plan.name}</h3>
                   {plan.current && (
                    <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-6 w-fit">
                      Current Plan
                    </div>
                  )}
                  </div>
                  <div className="mb-3">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-primary font-semibold mb-8">{plan.computationPower}</p>

                  <Button
                    className={`w-full py-6 ${
                      plan.current
                        ? "bg-secondary hover:bg-secondary/90"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                  >
                    {plan.current ? "Current Plan" : plan.name === "Custom" ? "Contact Sales" : "Choose Plan"}
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
              ))}
            </div>
          </div>

          <button
            onClick={handlePrevPlan}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-card border border-border rounded-full p-3 hover:bg-primary hover:border-primary transition-all shadow-lg ${
              showLeftArrow ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Previous plans"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={handleNextPlan}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-card border border-border rounded-full p-3 hover:bg-primary hover:border-primary transition-all shadow-lg ${
              showRightArrow ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Next plans"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>

      {/* Payment History */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-muted-foreground font-medium">Date</th>
                <th className="text-left py-3 text-muted-foreground font-medium">Description</th>
                <th className="text-left py-3 text-muted-foreground font-medium">Amount</th>
                <th className="text-left py-3 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-secondary">
                <td className="py-3">2025-12-01</td>
                <td className="py-3">Premium Plan - Monthly</td>
                <td className="py-3">₦49,999</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">Paid</span>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary">
                <td className="py-3">2025-11-15</td>
                <td className="py-3">Top-up: Pro Pack</td>
                <td className="py-3">₦6,999</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">Paid</span>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary">
                <td className="py-3">2025-11-01</td>
                <td className="py-3">Premium Plan - Monthly</td>
                <td className="py-3">₦49,999</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">Paid</span>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary">
                <td className="py-3">2025-10-30</td>
                <td className="py-3">Premium Plan - Monthly</td>
                <td className="py-3">₦49,999</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">Paid</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
