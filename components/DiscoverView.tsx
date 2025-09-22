'use client';

import { useState, useEffect } from 'react';
import { ProjectProfile, User, SwipeDirection } from '@/lib/types';
import { SwipeableCard } from '@/components/SwipeableCard';
import { SwipeButton } from '@/components/SwipeButton';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/database';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface DiscoverViewProps {
  onMatch: (projectId: string) => void;
  className?: string;
}

export function DiscoverView({ onMatch, className }: DiscoverViewProps) {
  const { appUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projects, setProjects] = useState<ProjectProfile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentProject = projects[currentIndex];
  const currentUser = users.find(u => u.userId === currentProject?.userId);

  // Load projects and users
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load all active projects
        const activeProjects = await db.getAllActiveProjects();

        // Filter out user's own projects
        const otherProjects = activeProjects.filter(p => p.userId !== appUser?.userId);

        setProjects(otherProjects);

        // Load all users (we'll need them for project owners)
        // In a real app, you'd load users associated with the projects
        const allUsers = new Map<string, User>();
        for (const project of otherProjects) {
          if (!allUsers.has(project.userId)) {
            const user = await db.getUser(project.userId);
            if (user) {
              allUsers.set(project.userId, user);
            }
          }
        }
        setUsers(Array.from(allUsers.values()));
      } catch (error) {
        console.error('Error loading discover data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (appUser) {
      loadData();
    }
  }, [appUser]);

  const handleSwipe = async (direction: SwipeDirection) => {
    if (!currentProject || !appUser) return;

    try {
      // Create swipe record
      await db.createSwipe({
        swiperUserId: appUser.userId,
        swipedProjectId: currentProject.projectId,
        swipeDirection: direction,
      });

      if (direction === 'right') {
        // Check for mutual match
        const projectOwnerSwipes = await db.getSwipesByUser(currentProject.userId);
        const mutualSwipe = projectOwnerSwipes.find(s =>
          s.swipedProjectId && s.swipeDirection === 'right'
        );

        if (mutualSwipe) {
          // Check if the owner swiped on one of our projects
          const userProjects = await db.getProjectsByUser(appUser.userId);
          const matchingProject = userProjects.find(p => p.projectId === mutualSwipe.swipedProjectId);

          if (matchingProject) {
            // Create match
            await db.createMatch({
              projectProfile1Id: currentProject.projectId,
              projectProfile2Id: matchingProject.projectId,
            });

            onMatch(currentProject.projectId);
          }
        }
      }
    } catch (error) {
      console.error('Error processing swipe:', error);
    }

    // Move to next project
    setCurrentIndex(prev => prev + 1);
  };

  const handleButtonSwipe = (direction: SwipeDirection) => {
    handleSwipe(direction);
  };

  const resetStack = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentIndex(0);
      setIsRefreshing(false);
    }, 500);
  };

  const hasMoreProjects = currentIndex < projects.length;

  if (isLoading || isRefreshing) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-textSecondary">
            {isRefreshing ? 'Refreshing projects...' : 'Loading projects...'}
          </p>
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
