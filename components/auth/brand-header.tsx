interface BrandHeaderProps {
  title?: string
  subtitle?: string
}

export function BrandHeader({ title = 'Doolf', subtitle }: BrandHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xl">D</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      </div>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

