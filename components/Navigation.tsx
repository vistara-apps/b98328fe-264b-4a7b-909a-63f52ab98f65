'use client';

import { ViewMode } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart, MessageCircle, User, Plus, Search } from 'lucide-react';

interface NavigationProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  matchCount?: number;
  className?: string;
}

export function Navigation({ 
  currentView, 
  onViewChange, 
  matchCount = 0, 
  className 
}: NavigationProps) {
  const navItems = [
    {
      id: 'discover' as ViewMode,
      icon: Search,
      label: 'Discover',
    },
    {
      id: 'matches' as ViewMode,
      icon: Heart,
      label: 'Matches',
      badge: matchCount > 0 ? matchCount : undefined,
    },
    {
      id: 'create' as ViewMode,
      icon: Plus,
      label: 'Create',
    },
    {
      id: 'profile' as ViewMode,
      icon: User,
      label: 'Profile',
    },
  ];

  return (
    <nav className={cn(
      'bg-surface border-t border-gray-200 px-4 py-2',
      className
    )}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'relative flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
                isActive 
                  ? 'text-primary bg-blue-50' 
                  : 'text-textSecondary hover:text-textPrimary hover:bg-gray-50'
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
