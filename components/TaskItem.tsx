'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Check, Edit2, Trash2, User, Calendar } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  currentUserId: string;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  onEdit: () => void;
  className?: string;
}

export function TaskItem({
  task,
  currentUserId,
  onUpdate,
  onDelete,
  onEdit,
  className
}: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      onUpdate({ status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const isAssignedToCurrentUser = task.assignedTo === currentUserId;

  return (
    <div className={cn(
      'bg-surface rounded-lg p-4 border transition-all',
      task.status === 'completed' ? 'border-green-200 bg-green-50' : 'border-gray-200',
      isOverdue && 'border-red-200 bg-red-50',
      className
    )}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleStatusToggle}
          disabled={isUpdating}
          className={cn(
            'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
            task.status === 'completed'
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-primary'
          )}
        >
          {task.status === 'completed' && <Check className="w-3 h-3" />}
          {isUpdating && (
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={cn(
                'font-medium text-textPrimary',
                task.status === 'completed' && 'line-through text-textSecondary'
              )}>
                {task.title}
              </h4>

              {task.description && (
                <p className={cn(
                  'text-sm text-textSecondary mt-1',
                  task.status === 'completed' && 'line-through'
                )}>
                  {task.description}
                </p>
              )}

              {/* Task Metadata */}
              <div className="flex items-center gap-4 mt-2 text-xs text-textSecondary">
                {task.assignedTo && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className={cn(
                      isAssignedToCurrentUser && 'font-medium text-primary'
                    )}>
                      {isAssignedToCurrentUser ? 'Assigned to you' : 'Assigned to collaborator'}
                    </span>
                  </div>
                )}

                {task.dueDate && (
                  <div className={cn(
                    'flex items-center gap-1',
                    isOverdue && 'text-red-600 font-medium'
                  )}>
                    <Calendar className="w-3 h-3" />
                    <span>Due {formatDate(task.dueDate)}</span>
                  </div>
                )}

                <span>Created {formatDate(task.createdAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="p-1 h-8 w-8"
              >
                <Edit2 className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

