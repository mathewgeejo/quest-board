'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface XPHistoryEntry {
  date: string
  xp: number
}

interface XPChartProps {
  data: XPHistoryEntry[]
  className?: string
}

export function XPChart({ data, className }: XPChartProps) {
  if (!data.length) return null
  
  const maxXP = Math.max(...data.map((d) => d.xp), 1)
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">XP History (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1 h-32">
          {data.map((entry, index) => {
            const height = (entry.xp / maxXP) * 100
            const isToday = index === data.length - 1
            
            return (
              <div
                key={entry.date}
                className="relative flex-1 group"
              >
                {/* Bar */}
                <div
                  className={cn(
                    'w-full rounded-t transition-all duration-200',
                    isToday ? 'bg-primary' : 'bg-primary/40 group-hover:bg-primary/70'
                  )}
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-popover text-popover-foreground px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                    <p className="font-medium">{entry.xp} XP</p>
                    <p className="text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>
            {new Date(data[0]?.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span>
            {new Date(data[data.length - 1]?.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Total XP (30d)</p>
            <p className="font-semibold">
              {data.reduce((sum, d) => sum + d.xp, 0).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Daily Average</p>
            <p className="font-semibold">
              {Math.round(
                data.reduce((sum, d) => sum + d.xp, 0) / data.length
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
