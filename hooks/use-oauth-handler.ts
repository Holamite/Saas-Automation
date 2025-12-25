import { useToast } from '@/hooks/use-toast'
import { initiateGoogleAuth } from '@/lib/auth'

/**
 * Hook to handle OAuth initiation with error handling
 */
export function useOAuthHandler() {
  const { toast } = useToast()

  const handleOAuth = () => {
    try {
      initiateGoogleAuth()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      toast({
        title: 'Error',
        description: error.message || 'Failed to initiate Google sign-in',
        variant: 'destructive',
      })
    }
  }

  return { handleOAuth }
}

