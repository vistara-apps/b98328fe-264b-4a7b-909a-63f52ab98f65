'use client';

import { useState } from 'react';
import { ProjectProfile } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { SKILL_CATEGORIES, WORK_STYLES, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '@/lib/constants';
import { generateId, cn } from '@/lib/utils';
import { X, Plus } from 'lucide-react';

interface CreateProjectViewProps {
  onProjectCreated: (project: ProjectProfile) => void;
  onCancel: () => void;
  className?: string;
}

export function CreateProjectView({ onProjectCreated, onCancel, className }: CreateProjectViewProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vision: '',
    workStyle: 'Remote' as string,
    skillsRequired: [] as string[],
    customSkill: '',
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

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.includes(skill)
        ? prev.skillsRequired.filter(s => s !== skill)
        : [...prev.skillsRequired, skill]
    }));
  };

  const handleAddCustomSkill = () => {
    const skill = formData.customSkill.trim();
    if (skill && !formData.skillsRequired.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skill],
        customSkill: '',
      }));
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(s => s !== skill)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title must be ${MAX_TITLE_LENGTH} characters or less`;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`;
    }

    if (!formData.vision.trim()) {
      newErrors.vision = 'Project vision is required';
    }

    if (formData.skillsRequired.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newProject: ProjectProfile = {
        projectId: generateId(),
        userId: 'current-user', // In real app, get from auth
        title: formData.title.trim(),
        description: formData.description.trim(),
        vision: formData.vision.trim(),
        workStyle: formData.workStyle,
        skillsRequired: formData.skillsRequired,
        createdAt: new Date(),
        status: 'active',
      };

      onProjectCreated(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ submit: 'Failed to create project. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('flex flex-col h-full bg-bg', className)}>
      {/* Header */}
      <div className="p-4 bg-surface border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-textPrimary">Create Project</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-sm text-textSecondary mt-1">
          Share your project idea and find the perfect collaborator
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Project Title */}
          <Input
            label="Project Title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., AI-Powered Recipe App"
            error={errors.title}
            maxLength={MAX_TITLE_LENGTH}
          />

          {/* Project Description */}
          <Textarea
            label="Project Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your project, what you're building, and what you need help with..."
            error={errors.description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={4}
          />

          {/* Project Vision */}
          <Textarea
            label="Project Vision"
            value={formData.vision}
            onChange={(e) => handleInputChange('vision', e.target.value)}
            placeholder="What's your long-term vision for this project?"
            error={errors.vision}
            rows={2}
          />

          {/* Work Style */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textPrimary">
              Work Style
            </label>
            <div className="flex flex-wrap gap-2">
              {WORK_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleInputChange('workStyle', style)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    formData.workStyle === style
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-textPrimary hover:bg-gray-200'
                  )}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Required */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-textPrimary">
                Skills Required
              </label>
              {errors.skills && (
                <p className="text-sm text-red-600">{errors.skills}</p>
              )}
            </div>

            {/* Selected Skills */}
            {formData.skillsRequired.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skillsRequired.map((skill) => (
                  <Badge
                    key={skill}
                    variant="default"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:bg-blue-700 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Skill Categories */}
            <div className="flex flex-wrap gap-2">
              {SKILL_CATEGORIES.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    formData.skillsRequired.includes(skill)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-textPrimary hover:bg-gray-200'
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2">
              <Input
                value={formData.customSkill}
                onChange={(e) => handleInputChange('customSkill', e.target.value)}
                placeholder="Add custom skill..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddCustomSkill}
                disabled={!formData.customSkill.trim()}
                size="sm"
                className="px-3"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="p-4 bg-surface border-t border-gray-200">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
