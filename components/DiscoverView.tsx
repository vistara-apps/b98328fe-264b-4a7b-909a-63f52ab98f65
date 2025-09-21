'use client';

import { useState, useEffect } from 'react';
import { ProjectProfile, User, SwipeDirection } from '@/lib/types';
import { SwipeableCard } from '@/components/SwipeableCard';
import { SwipeButton } from '@/components/SwipeButton';
import { SAMPLE_PROJECTS, SAMPLE_USERS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface DiscoverViewProps {
  onMatch: (projectId: string) => void;
  className?: string;
}

export function DiscoverView({ onMatch, className }: DiscoverViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projects] = useState<ProjectProfile[]>(SAMPLE_PROJECTS);
  const [users] = useState<User[]>(SAMPLE_USERS);
  const [isLoading, setIsLoading] = useState(false);

  const currentProject = projects[currentIndex];
  const currentUser = users.find(u => u.userId === currentProject?.userId);

  const handleSwipe = (direction: SwipeDirection) => {
    if (direction === 'right' && currentProject) {
      // Simulate match (in real app, this would check if the other user also swiped right)
      const isMatch = Math.random() > 0.5; // 50% chance of match for demo
      if (isMatch) {
        onMatch(currentProject.projectId);
      }
    }

    // Move to next project
    setCurrentIndex(prev => prev + 1);
  };

  const handleButtonSwipe = (direction: SwipeDirection) => {
    handleSwipe(direction);
  };

  const resetStack = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentIndex(0);
      setIsLoading(false);
    }, 500);
  };

  const hasMoreProjects = currentIndex < projects.length;

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-textSecondary">Loading new projects...</p>
        </div>
      </div>
    );
  }

  if (!hasMoreProjects) {
    return (
      <div className={cn('flex items-center justify-center h-full p-4', className)}>
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <RefreshCw className="w-10 h-10 text-textSecondary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-textPrimary">No more projects!</h3>
            <p className="text-textSecondary">
              You've seen all available projects. Check back later for new opportunities or create your own project.
            </p>
          </div>
          <button
            onClick={resetStack}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Card Stack */}
      <div className="flex-1 relative overflow-hidden">
        {/* Show current and next card for stack effect */}
        {projects.slice(currentIndex, currentIndex + 2).map((project, index) => {
          const user = users.find(u => u.userId === project.userId);
          const isTop = index === 0;
          
          return (
            <div
              key={`${project.projectId}-${currentIndex + index}`}
              className={cn(
                'absolute inset-0',
                !isTop && 'scale-95 opacity-50 pointer-events-none'
              )}
              style={{
                zIndex: isTop ? 10 : 5,
              }}
            >
              {isTop ? (
                <SwipeableCard
                  project={project}
                  user={user}
                  onSwipe={handleSwipe}
                />
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <div className="transform scale-95">
                    {/* Static preview of next card */}
                    <div className="bg-surface rounded-lg shadow-card p-4 max-w-md">
                      <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                      <p className="text-textSecondary text-sm">
                        {project.description.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-8 p-6 bg-surface border-t border-gray-200">
        <SwipeButton
          variant="dislike"
          onClick={() => handleButtonSwipe('left')}
          disabled={!currentProject}
        />
        <SwipeButton
          variant="like"
          onClick={() => handleButtonSwipe('right')}
          disabled={!currentProject}
        />
      </div>

      {/* Progress indicator */}
      <div className="px-6 pb-2">
        <div className="flex items-center justify-center gap-1">
          {projects.map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index < currentIndex 
                  ? 'bg-primary' 
                  : index === currentIndex 
                    ? 'bg-primary' 
                    : 'bg-gray-200'
              )}
            />
          ))}
        </div>
        <p className="text-center text-xs text-textSecondary mt-2">
          {currentIndex + 1} of {projects.length}
        </p>
      </div>
    </div>
  );
}
