'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, ProjectProfile, User, Match } from '@/lib/types';
import { ChatBubble } from '@/components/ChatBubble';
import { TaskManager } from '@/components/TaskManager';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { db } from '@/lib/database';
import { cn } from '@/lib/utils';
import { Send, ArrowLeft, MoreVertical, MessageCircle, CheckSquare } from 'lucide-react';

interface ChatViewProps {
  projectId: string;
  currentUserId: string;
  onBack: () => void;
  className?: string;
}

export function ChatView({ projectId, currentUserId, onBack, className }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [match, setMatch] = useState<Match | null>(null);
  const [project, setProject] = useState<ProjectProfile | null>(null);
  const [projectOwner, setProjectOwner] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks'>('chat');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load data and initialize chat
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load project
        const projectData = await db.getProject(projectId);
        if (!projectData) {
          console.error('Project not found');
          return;
        }
        setProject(projectData);

        // Load project owner
        const ownerData = await db.getUser(projectData.userId);
        if (!ownerData) {
          console.error('Project owner not found');
          return;
        }
        setProjectOwner(ownerData);

        // Load current user
        const userData = await db.getUser(currentUserId);
        if (!userData) {
          console.error('Current user not found');
          return;
        }
        setCurrentUser(userData);

        // Find the match between current user and project
        // This is a simplified approach - in reality you'd need to track matches properly
        const userProjects = await db.getProjectsByUser(currentUserId);
        let foundMatch = null;

        for (const userProject of userProjects) {
          // Check if there's a match involving both projects
          const matches = await db.getMatchesByUser(currentUserId);
          for (const m of matches) {
            if ((m.projectProfile1Id === projectId && m.projectProfile2Id === userProject.projectId) ||
                (m.projectProfile1Id === userProject.projectId && m.projectProfile2Id === projectId)) {
              foundMatch = m;
              break;
            }
          }
          if (foundMatch) break;
        }

        if (foundMatch) {
          setMatch(foundMatch);

          // Load existing messages
          const chatMessages = await db.getChatMessages(foundMatch.matchId);
          setMessages(chatMessages);
        } else {
          // Create a temporary match for demo purposes
          // In a real app, this would only happen after a proper match
          const tempMatch: Match = {
            matchId: `temp-match-${projectId}-${currentUserId}`,
            projectProfile1Id: projectId,
            projectProfile2Id: userProjects[0]?.projectId || 'unknown',
            createdAt: new Date(),
            status: 'active',
          };
          setMatch(tempMatch);

          // Add welcome message
          const welcomeMessage: ChatMessage = {
            messageId: `welcome-${Date.now()}`,
            matchId: tempMatch.matchId,
            senderUserId: 'system',
            content: `You matched with ${ownerData.displayName} on "${projectData.title}"!`,
            timestamp: new Date(),
            type: 'system',
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Error loading chat data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [projectId, currentUserId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !match) return;

    try {
      const message = await db.createChatMessage({
        matchId: match.matchId,
        senderUserId: currentUserId,
        content: newMessage.trim(),
        type: 'text',
      });

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // In a real app, you'd send a notification to the other user
      // For demo purposes, we'll simulate a response
      setTimeout(async () => {
        if (projectOwner) {
          const responses = [
            "That sounds great! When would be a good time to discuss this further?",
            "I love your enthusiasm! Let me share some more details about the project.",
            "Perfect! I think your skills would be a great fit for this project.",
            "Thanks for reaching out! I'm excited to potentially work together.",
            "That's exactly what I was looking for! Let's set up a call soon.",
          ];

          const response = await db.createChatMessage({
            matchId: match.matchId,
            senderUserId: projectOwner.userId,
            content: responses[Math.floor(Math.random() * responses.length)],
            type: 'text',
          });

          setMessages(prev => [...prev, response]);
        }
      }, 1500 + Math.random() * 1000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-textSecondary">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!project || !projectOwner || !currentUser) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <p className="text-textSecondary">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full bg-bg', className)}>
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 bg-surface border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <Avatar
          src={projectOwner.avatar}
          name={projectOwner.displayName}
          size="sm"
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-textPrimary truncate">
            {projectOwner.displayName}
          </h3>
          <p className="text-sm text-textSecondary truncate">
            {project.title}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-surface">
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
            activeTab === 'chat'
              ? 'text-primary border-b-2 border-primary'
              : 'text-textSecondary hover:text-textPrimary'
          )}
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
            activeTab === 'tasks'
              ? 'text-primary border-b-2 border-primary'
              : 'text-textSecondary hover:text-textPrimary'
          )}
        >
          <CheckSquare className="w-4 h-4" />
          Tasks
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {messages.map((message) => (
                <ChatBubble
                  key={message.messageId}
                  message={message}
                  variant={message.senderUserId === currentUserId ? 'sent' : 'received'}
                  senderName={
                    message.senderUserId === currentUserId
                      ? currentUser.displayName
                      : projectOwner.displayName
                  }
                  senderAvatar={
                    message.senderUserId === currentUserId
                      ? currentUser.avatar
                      : projectOwner.avatar
                  }
                  showAvatar={false}
                />
              ))}

              <div ref={messagesEndRef} />
            </div>
          </>
        ) : (
          /* Tasks */
          <div className="flex-1 overflow-y-auto p-4">
            {match && (
              <TaskManager
                match={match}
                currentUserId={currentUserId}
              />
            )}
          </div>
        )}
      </div>

      {/* Message Input - Only show on chat tab */}
      {activeTab === 'chat' && (
        <div className="p-4 bg-surface border-t border-gray-200">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="resize-none"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
              className="px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
