'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import { Save, X } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: {
    title: string;
    description?: string;
    assignedTo?: string;
    dueDate?: Date;
  }) => void;
  onCancel: () => void;
  className?: string;
}

export function TaskForm({ task, onSubmit, onCancel, className }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    assignedTo: task?.assignedTo || '',
    dueDate: task?.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        assignedTo: formData.assignedTo.trim() || undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      };

      onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting task:', error);
      setErrors({ submit: 'Failed to save task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('bg-surface rounded-lg p-4 border border-gray-200', className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Task Title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="What needs to be done?"
          error={errors.title}
          maxLength={100}
          required
        />

        {/* Description */}
        <Textarea
          label="Description (optional)"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Add more details about this task..."
          error={errors.description}
          maxLength={500}
          rows={3}
        />

        {/* Assignment */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">
              Assign to
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => handleInputChange('assignedTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Unassigned</option>
              <option value="current-user">Me</option>
              <option value="collaborator">Collaborator</option>
            </select>
          </div>

          {/* Due Date */}
          <Input
            label="Due Date (optional)"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <p className="text-sm text-red-600">{errors.submit}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </div>
  );
}

