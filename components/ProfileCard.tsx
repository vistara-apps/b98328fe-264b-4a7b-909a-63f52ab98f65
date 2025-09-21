'use client';

import { ProjectProfile, User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { cn, truncateText } from '@/lib/utils';
import { MapPin, Clock, Users } from 'lucide-react';

interface ProfileCardProps {
  project: ProjectProfile;
  user?: User;
  variant?: 'default' | 'compact';
  className?: string;
  onSwipe?: (direction: 'left' | 'right') => void;
}

export function ProfileCard({ 
  project, 
  user, 
  variant = 'default', 
  className,
  onSwipe 
}: ProfileCardProps) {
  const isCompact = variant === 'compact';

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-transform hover:scale-[1.02]',
        isCompact ? 'max-w-sm' : 'max-w-md w-full',
        className
      )}
    >
      {/* Project Image */}
      {project.imageUrl && (
        <div className={cn(
          'relative overflow-hidden',
          isCompact ? 'h-32' : 'h-48'
        )}>
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <CardContent className="p-4 space-y-3">
        {/* Header with user info */}
        {user && (
          <div className="flex items-center gap-3">
            <Avatar
              src={user.avatar}
              name={user.displayName}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.displayName}</p>
              <p className="text-xs text-textSecondary truncate">{user.bio}</p>
            </div>
          </div>
        )}

        {/* Project Title */}
        <div>
          <h3 className={cn(
            'font-bold text-textPrimary',
            isCompact ? 'text-lg' : 'text-xl'
          )}>
            {truncateText(project.title, isCompact ? 40 : 60)}
          </h3>
        </div>

        {/* Project Description */}
        <p className={cn(
          'text-textSecondary leading-relaxed',
          isCompact ? 'text-sm' : 'text-base'
        )}>
          {truncateText(project.description, isCompact ? 100 : 150)}
        </p>

        {/* Skills Required */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-textPrimary">Skills Needed:</p>
          <div className="flex flex-wrap gap-1.5">
            {project.skillsRequired.slice(0, isCompact ? 2 : 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {project.skillsRequired.length > (isCompact ? 2 : 4) && (
              <Badge variant="outline" className="text-xs">
                +{project.skillsRequired.length - (isCompact ? 2 : 4)} more
              </Badge>
            )}
          </div>
        </div>

        {/* Project Meta */}
        <div className="flex items-center gap-4 text-xs text-textSecondary">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{project.workStyle}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span className="capitalize">{project.status}</span>
          </div>
        </div>

        {/* Vision */}
        {!isCompact && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-textSecondary italic">
              "{truncateText(project.vision, 80)}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
