'use client'

interface LoadingProps {
  message?: string
  fullScreen?: boolean
}

export function Loading({ message = 'Loading...', fullScreen = true }: LoadingProps) {
  const containerClass = fullScreen
    ? 'min-h-screen bg-background flex items-center justify-center'
    : 'flex items-center justify-center p-4'

  return (
    <div className={containerClass}>
      <div className="text-muted-foreground">{message}</div>
    </div>
  )
}

