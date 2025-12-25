interface ErrorAlertProps {
  error: string | null
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null

  return (
    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md" role="alert">
      <p className="text-sm text-destructive">{error}</p>
    </div>
  )
}

