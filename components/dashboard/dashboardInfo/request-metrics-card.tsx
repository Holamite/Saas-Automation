"use client"

import { Activity, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function RequestMetricsCard() {
  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">Request Metrics</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-foreground">1,245</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Failed Requests</p>
          <p className="text-2xl font-bold text-red-500">18</p>
        </div>
        <div>
          <Tooltip>
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground mb-1">Successful</p>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of successful API requests</p>
              </TooltipContent>
            </div>
            <p className="text-2xl font-bold text-primary">1,227</p>
          </Tooltip>
        </div>
        <div>
          <Tooltip>
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Percentage of successful requests out of total requests</p>
              </TooltipContent>
            </div>
            <p className="text-2xl font-bold text-foreground">98.6%</p>
          </Tooltip>
        </div>
      </div>
      <div>
        <Tooltip>
          <div className="flex justify-between text-sm mb-2">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Computation Units</span>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Monthly computation power usage for API operations</p>
              </TooltipContent>
            </div>
            <span className="text-foreground font-medium">180,000 / 200,000 ops</span>
          </div>
        </Tooltip>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <div className="h-full w-[90%] bg-primary rounded-full transition-all duration-300" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">20,000 ops remaining (10%)</p>
      </div>
    </Card>
  )
}
