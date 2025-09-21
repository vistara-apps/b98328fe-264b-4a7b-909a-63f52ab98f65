'use client';

import { ChatMessage } from '@/lib/types';
import { cn, formatTime } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

interface ChatBubbleProps {
  message: ChatMessage;
  variant: 'sent' | 'received';
  senderName?: string;
  senderAvatar?: string;
  showAvatar?: boolean;
  className?: string;
}

export function ChatBubble({ 
  message, 
  variant, 
  senderName, 
  senderAvatar,
  showAvatar = true,
  className 
}: ChatBubbleProps) {
  const isSent = variant === 'sent';
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className={cn('flex justify-center my-4', className)}>
        <div className="bg-gray-100 text-textSecondary text-sm px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex gap-2 mb-4',
      isSent ? 'justify-end' : 'justify-start',
      className
    )}>
      {/* Avatar for received messages */}
      {!isSent && showAvatar && (
        <Avatar
          src={senderAvatar}
          name={senderName}
          size="sm"
          className="mt-auto"
        />
      )}

      <div className={cn(
        'max-w-[70%] space-y-1',
        isSent ? 'items-end' : 'items-start'
      )}>
        {/* Sender name for received messages */}
        {!isSent && senderName && (
          <p className="text-xs text-textSecondary px-3">{senderName}</p>
        )}

        {/* Message bubble */}
        <div className={cn(
          'px-4 py-2 rounded-2xl break-words',
          isSent 
            ? 'bg-primary text-white rounded-br-md' 
            : 'bg-gray-100 text-textPrimary rounded-bl-md'
        )}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {/* Timestamp */}
        <p className={cn(
          'text-xs text-textSecondary px-3',
          isSent ? 'text-right' : 'text-left'
        )}>
          {formatTime(message.timestamp)}
        </p>
      </div>

      {/* Avatar for sent messages */}
      {isSent && showAvatar && (
        <Avatar
          src={senderAvatar}
          name={senderName}
          size="sm"
          className="mt-auto"
        />
      )}
    </div>
  );
}
