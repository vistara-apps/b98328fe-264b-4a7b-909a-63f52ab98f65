'use client';

import { Task } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Check, Clock, User } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  variant?: 'pending' | 'completed';
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  className?: string;
}

export function TaskItem({ 
  task, 
  variant, 
  onStatusChange, 
  className 
}: TaskItemProps) {
  const isCompleted = task.status === 'completed';
  const isPending = task.status === 'pending';
  const isInProgress = task.status === 'in-progress';

  const handleStatusToggle = () => {
    if (!onStatusChange) return;
    
    const newStatus: Task['status'] = isCompleted ? 'pending' : 'completed';
    onStatusChange(task.taskId, newStatus);
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <div className={cn(
      'flex items-start gap-3 p-4 bg-surface rounded-lg border border-gray-200',
      isCompleted && 'opacity-75',
      className
    )}>
      {/* Status checkbox */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleStatusToggle}
        className={cn(
          'w-6 h-6 p-0 rounded-full border-2 flex-shrink-0 mt-0.5',
          isCompleted 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'border-gray-300 hover:border-primary'
        )}
      >
        {isCompleted && <Check className="w-3 h-3" />}
      </Button>

      {/* Task content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn(
            'font-medium text-textPrimary',
            isCompleted && 'line-through text-textSecondary'
          )}>
            {task.title}
          </h4>
          
          <Badge 
            variant="secondary" 
            className={cn('text-xs', statusColors[task.status])}
          >
            {task.status.replace('-', ' ')}
          </Badge>
        </div>

        {task.description && (
          <p className={cn(
            'text-sm text-textSecondary',
            isCompleted && 'line-through'
          )}>
            {task.description}
          </p>
        )}

        {/* Task meta */}
        <div className="flex items-center gap-4 text-xs text-textSecondary">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Created {formatDate(task.createdAt)}</span>
          </div>
          
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Due {formatDate(task.dueDate)}</span>
            </div>
          )}
          
          {task.assignedTo && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>Assigned</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
