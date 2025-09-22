'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function AuthGuard({ children, fallback, className }: AuthGuardProps) {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center min-h-screen', className)}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-textSecondary">Connecting to Farcaster...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={cn('flex items-center justify-center min-h-screen p-4', className)}>
        <div className="text-center space-y-6 max-w-sm">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-textPrimary">Welcome to CollabFlow</h1>
            <p className="text-textSecondary">
              Connect with your Farcaster account to start discovering creative projects and building amazing collaborations.
            </p>
          </div>

          <Button
            onClick={login}
            className="w-full bg-primary text-white hover:bg-blue-600"
          >
            Connect with Farcaster
          </Button>

          <div className="text-xs text-textSecondary">
            <p>By connecting, you agree to share your basic profile information.</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

