'use client';

import { useState, useEffect } from 'react';
import { Match, ProjectProfile, User } from '@/lib/types';
import { ProfileCard } from '@/components/ProfileCard';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/database';
import { cn, formatDate } from '@/lib/utils';
import { MessageCircle, Calendar } from 'lucide-react';

interface MatchesViewProps {
  onStartChat: (projectId: string) => void;
  className?: string;
}

export function MatchesView({ onStartChat, className }: MatchesViewProps) {
  const { appUser } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchedProjects, setMatchedProjects] = useState<ProjectProfile[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load matches and related data
  useEffect(() => {
    const loadMatches = async () => {
      if (!appUser) return;

      try {
        setIsLoading(true);

        // Load user's matches
        const userMatches = await db.getMatchesByUser(appUser.userId);
        setMatches(userMatches);

        // Load matched projects and users
        const projects: ProjectProfile[] = [];
        const users: User[] = [];

        for (const match of userMatches) {
          // Get the other project in the match
          const userProjects = await db.getProjectsByUser(appUser.userId);
          const otherProjectId = match.projectProfile1Id === userProjects[0]?.projectId
            ? match.projectProfile2Id
            : match.projectProfile1Id;

          if (otherProjectId) {
            const project = await db.getProject(otherProjectId);
            if (project) {
              projects.push(project);

              // Load project owner
              const owner = await db.getUser(project.userId);
              if (owner && !users.find(u => u.userId === owner.userId)) {
                users.push(owner);
              }
            }
          }
        }

        setMatchedProjects(projects);
        setMatchedUsers(users);
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, [appUser]);

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center h-full p-4', className)}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-textSecondary">Loading your matches...</p>
        </div>
      </div>
    );
  }

  if (matchedProjects.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-full p-4', className)}>
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-10 h-10 text-pink-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-textPrimary">No matches yet</h3>
            <p className="text-textSecondary">
              Start swiping to find projects that match your interests and skills. When you both swipe right, you'll see them here!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-4 bg-surface border-b border-gray-200">
        <h2 className="text-xl font-bold text-textPrimary">Your Matches</h2>
        <p className="text-sm text-textSecondary">
          {matchedProjects.length} project{matchedProjects.length !== 1 ? 's' : ''} matched with you
        </p>
      </div>

      {/* Matches List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {matchedProjects.map((project) => {
            const user = matchedUsers.find(u => u.userId === project.userId);
            const isSelected = selectedMatch === project.projectId;

            return (
              <div
                key={project.projectId}
                className={cn(
                  'relative transition-all cursor-pointer',
                  isSelected && 'ring-2 ring-primary ring-offset-2'
                )}
                onClick={() => setSelectedMatch(
                  isSelected ? null : project.projectId
                )}
              >
                <ProfileCard
                  project={project}
                  user={user}
                  variant="compact"
                  className="hover:shadow-lg"
                />

                {/* Match indicator */}
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  ✨ Match!
                </div>

                {/* Expanded actions */}
                {isSelected && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-sm text-textSecondary">
                      <Calendar className="w-4 h-4" />
                      <span>Matched on {formatDate(project.createdAt)}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartChat(project.projectId);
                        }}
                        className="flex-1"
                        size="sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Chat
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // View full project details
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="p-4 bg-surface border-t border-gray-200">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              // Filter matches or sort
            }}
          >
            Filter Matches
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              // Export or share matches
            }}
          >
            Share Matches
          </Button>
        </div>
      </div>
    </div>
  );
}
