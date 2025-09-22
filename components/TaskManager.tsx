'use client';

import { useState, useEffect } from 'react';
import { Task, Match } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { TaskItem } from '@/components/TaskItem';
import { TaskForm } from '@/components/TaskForm';
import { db } from '@/lib/database';
import { cn } from '@/lib/utils';
import { Plus, CheckSquare } from 'lucide-react';

interface TaskManagerProps {
  match: Match;
  currentUserId: string;
  className?: string;
}

export function TaskManager({ match, currentUserId, className }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load tasks for this match
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const matchTasks = await db.getTasksByMatch(match.matchId);
        setTasks(matchTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [match.matchId]);

  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    assignedTo?: string;
    dueDate?: Date;
  }) => {
    try {
      const newTask = await db.createTask({
        matchId: match.matchId,
        ...taskData,
        status: 'pending',
      });

      setTasks(prev => [...prev, newTask]);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await db.updateTask(taskId, updates);
      if (updatedTask) {
        setTasks(prev => prev.map(t => t.taskId === taskId ? updatedTask : t));
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const deleted = await db.deleteTask(taskId);
      if (deleted) {
        setTasks(prev => prev.filter(t => t.taskId !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-textPrimary">Tasks</h3>
          {totalTasks > 0 && (
            <span className="text-sm text-textSecondary">
              ({completedTasks}/{totalTasks} completed)
            </span>
          )}
        </div>

        <Button
          onClick={() => setShowTaskForm(true)}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Task Form */}
      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {/* Edit Task Form */}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={(data) => handleUpdateTask(editingTask.taskId, data)}
          onCancel={() => setEditingTask(null)}
        />
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-textSecondary mb-2">No tasks yet</p>
          <p className="text-sm text-textSecondary">
            Create your first task to start organizing your collaboration
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.taskId}
              task={task}
              currentUserId={currentUserId}
              onUpdate={(updates) => handleUpdateTask(task.taskId, updates)}
              onDelete={() => handleDeleteTask(task.taskId)}
              onEdit={() => setEditingTask(task)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

