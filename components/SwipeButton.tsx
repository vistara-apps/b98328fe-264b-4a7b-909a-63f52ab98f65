'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Heart, X } from 'lucide-react';

interface SwipeButtonProps {
  variant: 'like' | 'dislike';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function SwipeButton({ variant, onClick, disabled, className }: SwipeButtonProps) {
  const isLike = variant === 'like';

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={isLike ? 'primary' : 'outline'}
      size="lg"
      className={cn(
        'rounded-full w-16 h-16 p-0 shadow-lg transition-all hover:scale-110',
        isLike 
          ? 'bg-green-500 hover:bg-green-600 text-white' 
          : 'bg-white hover:bg-red-50 text-red-500 border-red-200',
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
        className
      )}
    >
      {isLike ? (
        <Heart className="w-8 h-8 fill-current" />
      ) : (
        <X className="w-8 h-8" />
      )}
    </Button>
  );
}
