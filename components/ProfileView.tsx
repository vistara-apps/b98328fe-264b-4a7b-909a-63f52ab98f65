'use client';

import { useState } from 'react';
import { User, ProjectProfile } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar } from '@/components/ui/Avatar';
import { ProfileCard } from '@/components/ProfileCard';
import { SAMPLE_USERS, SAMPLE_PROJECTS, MAX_BIO_LENGTH } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Edit2, Save, X, Settings, LogOut } from 'lucide-react';

interface ProfileViewProps {
  userId: string;
  className?: string;
}

export function ProfileView({ userId, className }: ProfileViewProps) {
  const [user, setUser] = useState<User>(
    SAMPLE_USERS.find(u => u.userId === userId) || SAMPLE_USERS[0]
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: user.displayName,
    bio: user.bio,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Get user's projects
  const userProjects = SAMPLE_PROJECTS.filter(p => p.userId === userId);

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    if (editData.bio.length > MAX_BIO_LENGTH) {
      newErrors.bio = `Bio must be ${MAX_BIO_LENGTH} characters or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUser(prev => ({
        ...prev,
        displayName: editData.displayName.trim(),
        bio: editData.bio.trim(),
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      displayName: user.displayName,
      bio: user.bio,
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className={cn('flex flex-col h-full bg-bg', className)}>
      {/* Header */}
      <div className="p-4 bg-surface border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-textPrimary">Profile</h2>
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className="p-4 bg-surface border-b border-gray-200">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                src={user.avatar}
                name={user.displayName}
                size="lg"
              />
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-3">
              {isEditing ? (
                <>
                  <Input
                    value={editData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    placeholder="Display name"
                    error={errors.displayName}
                  />
                  <Textarea
                    value={editData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell others about yourself..."
                    error={errors.bio}
                    maxLength={MAX_BIO_LENGTH}
                    rows={3}
                  />
                  {errors.submit && (
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      disabled={isSaving}
                      className="flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-bold text-textPrimary">
                      {user.displayName}
                    </h3>
                    <p className="text-textSecondary text-sm">
                      {user.bio || 'No bio yet'}
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 bg-surface border-b border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-textPrimary">{userProjects.length}</p>
              <p className="text-sm text-textSecondary">Projects</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-textPrimary">0</p>
              <p className="text-sm text-textSecondary">Matches</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-textPrimary">0</p>
              <p className="text-sm text-textSecondary">Collaborations</p>
            </div>
          </div>
        </div>

        {/* My Projects */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-textPrimary mb-4">My Projects</h3>
          
          {userProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-textSecondary mb-4">You haven't created any projects yet</p>
              <Button variant="outline" size="sm">
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userProjects.map((project) => (
                <ProfileCard
                  key={project.projectId}
                  project={project}
                  user={user}
                  variant="compact"
                />
              ))}
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="p-4 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              // Handle account settings
            }}
          >
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              // Handle logout
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
