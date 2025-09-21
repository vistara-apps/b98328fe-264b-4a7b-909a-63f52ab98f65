'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, ProjectProfile, User } from '@/lib/types';
import { ChatBubble } from '@/components/ChatBubble';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { SAMPLE_PROJECTS, SAMPLE_USERS } from '@/lib/constants';
import { generateId, cn } from '@/lib/utils';
import { Send, ArrowLeft, MoreVertical } from 'lucide-react';

interface ChatViewProps {
  projectId: string;
  currentUserId: string;
  onBack: () => void;
  className?: string;
}

export function ChatView({ projectId, currentUserId, onBack, className }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get project and user data
  const project = SAMPLE_PROJECTS.find(p => p.projectId === projectId);
  const projectOwner = SAMPLE_USERS.find(u => u.userId === project?.userId);
  const currentUser = SAMPLE_USERS.find(u => u.userId === currentUserId) || SAMPLE_USERS[0];

  // Initialize with welcome message
  useEffect(() => {
    if (project && projectOwner) {
      const welcomeMessage: ChatMessage = {
        messageId: generateId(),
        matchId: `match-${projectId}`,
        senderUserId: 'system',
        content: `You matched with ${projectOwner.displayName} on "${project.title}"!`,
        timestamp: new Date(),
        type: 'system',
      };

      const initialMessage: ChatMessage = {
        messageId: generateId(),
        matchId: `match-${projectId}`,
        senderUserId: project.userId,
        content: `Hi! Thanks for showing interest in ${project.title}. I'd love to discuss how we could collaborate!`,
        timestamp: new Date(Date.now() + 1000),
        type: 'text',
      };

      setMessages([welcomeMessage, initialMessage]);
    }
  }, [project, projectOwner, projectId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      messageId: generateId(),
      matchId: `match-${projectId}`,
      senderUserId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "That sounds great! When would be a good time to discuss this further?",
        "I love your enthusiasm! Let me share some more details about the project.",
        "Perfect! I think your skills would be a great fit for this project.",
        "Thanks for reaching out! I'm excited to potentially work together.",
        "That's exactly what I was looking for! Let's set up a call soon.",
      ];

      const response: ChatMessage = {
        messageId: generateId(),
        matchId: `match-${projectId}`,
        senderUserId: project?.userId || '',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!project || !projectOwner) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <p className="text-textSecondary">Project not found</p>
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

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 mb-4">
            <Avatar
              src={projectOwner.avatar}
              name={projectOwner.displayName}
              size="sm"
            />
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-textSecondary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
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
    </div>
  );
}
