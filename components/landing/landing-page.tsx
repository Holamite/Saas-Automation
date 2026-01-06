"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Check, TrendingUp, Shield, Zap, Users, BarChart3, Lock, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface LandingPageProps {
  onGetStarted: () => void
  onSignIn: () => void
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

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
    current: true,
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

  const handlePrevPlan = () => {
    setCurrentPlanIndex((prev) => (prev === 0 ? Math.max(0, plans.length - 3) : prev - 1))
  }

  const handleNextPlan = () => {
    setCurrentPlanIndex((prev) => (prev >= plans.length - 3 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">D</span>
            </div>
            <span className="text-2xl font-bold text-primary">Doolf</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={onSignIn}>
              Sign In
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onGetStarted}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
              Automate Your Crypto Trading <span className="text-primary">& Payouts</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Doolf is the complete automation platform for Nigerian merchants. Trade on Bybit, manage payouts in NGN,
              and scale your business with intelligent risk management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onGetStarted}
              >
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={onSignIn}>
                Sign In
              </Button>
            </div>
            <div className="flex gap-8 pt-8">
              <div>
                <p className="text-2xl font-bold text-primary">₦2.5B+</p>
                <p className="text-sm text-muted-foreground">Traded Volume</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">5000+</p>
                <p className="text-sm text-muted-foreground">Active Merchants</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-3xl" />
            <Card className="relative border-primary/30 bg-card/50 backdrop-blur p-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <p className="font-semibold">Account Balance</p>
                  <p className="text-primary text-lg font-bold">₦2,450,000</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">BTC/USDT</span>
                    <span className="text-primary font-semibold">+₦85,200</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-primary rounded-full" />
                  </div>
                </div>
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ETH/USDT</span>
                    <span className="text-primary font-semibold">+₦32,100</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-primary rounded-full" />
                  </div>
                </div>
                <div className="pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Daily P&L</p>
                  <p className="text-2xl font-bold text-primary">+₦117,300</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/20 border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Doolf?</h2>
            <p className="text-xl text-muted-foreground">Everything you need to trade smart and scale fast</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border bg-card/50 backdrop-blur p-8 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Automated Trading</h3>
              <p className="text-muted-foreground">
                Execute buy/sell orders on Bybit with AI-powered risk management and profit optimization.
              </p>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur p-8 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
              <p className="text-muted-foreground">
                Track performance metrics, P&L, and risk exposure with live dashboards and detailed reports.
              </p>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur p-8 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Bank-grade encryption, 2FA, API key management, and full audit logs for compliance.
              </p>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur p-8 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">NGN Payouts</h3>
              <p className="text-muted-foreground">
                Instantly withdraw to Nigerian bank accounts with zero hidden fees and transparent rates.
              </p>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur p-8 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multi-Account</h3>
              <p className="text-muted-foreground">
                Manage multiple Bybit accounts and distribute trades across portfolios efficiently.
              </p>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur p-8 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Dedicated support team available round the clock to help you succeed with Doolf.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Flexible Plans for Every Merchant</h2>
          <p className="text-xl text-muted-foreground">
            Start small, scale fast with plans designed for Nigerian traders
          </p>
        </div>

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
                  <p className="text-sm text-primary font-semibold">{plan.computationPower}</p>

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
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Trading Smarter?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of Nigerian merchants who are automating their crypto trading and scaling their business with
            Doolf.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onGetStarted}>
            Start Your Free Trial Now <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">D</span>
                </div>
                <span className="font-bold text-primary">Doolf</span>
              </div>
              <p className="text-sm text-muted-foreground">The automation platform for Nigerian crypto traders.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 Doolf. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-foreground transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
