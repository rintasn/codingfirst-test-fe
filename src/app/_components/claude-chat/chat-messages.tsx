// components/claude-chat/chat-messages.tsx
'use client';

import { useRef, useEffect } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'claude';
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  className?: string;
}

export function ChatMessages({ messages, className }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea className={cn('h-[500px] pr-4', className)}>
      <div className="space-y-4 pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-start gap-3',
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.sender === 'claude' && (
              <Avatar className="h-8 w-8 border">
                <div className="flex h-full w-full items-center justify-center bg-primary text-white">C</div>
              </Avatar>
            )}
            <div
              className={cn(
                'rounded-lg p-3 max-w-[80%]',
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <p className="text-sm">{message.content}</p>
              <div 
                className={cn(
                  'text-xs mt-1',
                  message.sender === 'user'
                    ? 'text-primary-foreground/80' 
                    : 'text-muted-foreground'
                )}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {message.sender === 'user' && (
              <Avatar className="h-8 w-8 border">
                <div className="flex h-full w-full items-center justify-center bg-muted">U</div>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}