'use client';

import { useState } from 'react';
import { Match, ProjectProfile, User } from '@/lib/types';
import { ProfileCard } from '@/components/ProfileCard';
import { Button } from '@/components/ui/Button';
import { SAMPLE_PROJECTS, SAMPLE_USERS } from '@/lib/constants';
import { cn, formatDate } from '@/lib/utils';
import { MessageCircle, Calendar } from 'lucide-react';

interface MatchesViewProps {
  matches: string[]; // Array of project IDs that matched
  onStartChat: (projectId: string) => void;
  className?: string;
}

export function MatchesView({ matches, onStartChat, className }: MatchesViewProps) {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  // Get matched projects and users
  const matchedProjects = SAMPLE_PROJECTS.filter(project => 
    matches.includes(project.projectId)
  );
  const matchedUsers = SAMPLE_USERS.filter(user => 
    matchedProjects.some(project => project.userId === user.userId)
  );

  if (matches.length === 0) {
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
          {matches.length} project{matches.length !== 1 ? 's' : ''} matched with you
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
