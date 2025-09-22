'use client';

import { useState, useEffect } from 'react';
import { ViewMode, ProjectProfile } from '@/lib/types';
import { Navigation } from '@/components/Navigation';
import { DiscoverView } from '@/components/DiscoverView';
import { MatchesView } from '@/components/MatchesView';
import { ChatView } from '@/components/ChatView';
import { CreateProjectView } from '@/components/CreateProjectView';
import { ProfileView } from '@/components/ProfileView';
import { AuthGuard } from '@/components/AuthGuard';
import { APP_CONFIG } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

function HomePageContent() {
  const { appUser } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('discover');

  const [currentChatProject, setCurrentChatProject] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // Hide welcome message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleMatch = (projectId: string) => {
    // Show match notification (in real app, this would be a toast/modal)
    console.log(`🎉 New match with project: ${projectId}`);
    // Match is now handled in DiscoverView via API
  };

  const currentUserId = appUser?.userId || '';

  const handleStartChat = (projectId: string) => {
    setCurrentChatProject(projectId);
    setCurrentView('chat');
  };

  const handleBackFromChat = () => {
    setCurrentChatProject(null);
    setCurrentView('matches');
  };

  const handleProjectCreated = async (project: ProjectProfile) => {
    // Project is already saved via API in CreateProjectView
    console.log('Project created:', project);
    setCurrentView('profile');
  };

  const handleViewChange = (view: ViewMode) => {
    if (view === 'chat') return; // Chat view is handled separately
    setCurrentView(view);
    setCurrentChatProject(null);
  };

  const renderCurrentView = () => {
    if (currentView === 'chat' && currentChatProject) {
      return (
        <ChatView
          projectId={currentChatProject}
          currentUserId={currentUserId}
          onBack={handleBackFromChat}
        />
      );
    }

    switch (currentView) {
      case 'discover':
        return <DiscoverView onMatch={handleMatch} />;
      
      case 'matches':
        return <MatchesView onStartChat={handleStartChat} />;
      
      case 'create':
        return (
          <CreateProjectView
            onProjectCreated={handleProjectCreated}
            onCancel={() => setCurrentView('discover')}
          />
        );
      
      case 'profile':
        return <ProfileView user={appUser} />;
      
      default:
        return <DiscoverView onMatch={handleMatch} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-primary to-accent text-white p-4 text-center animate-fade-in">
          <h1 className="text-lg font-bold">{APP_CONFIG.tagline}</h1>
          <p className="text-sm opacity-90">{APP_CONFIG.description}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </div>

      {/* Navigation */}
      {currentView !== 'chat' && (
        <Navigation
          currentView={currentView}
          onViewChange={handleViewChange}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomePageContent />
    </AuthGuard>
  );
}
