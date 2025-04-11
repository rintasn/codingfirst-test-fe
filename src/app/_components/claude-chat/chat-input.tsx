// components/claude-chat/chat-input.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <Textarea
          placeholder="Ask Claude to change your preferences..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[80px] resize-none"
          disabled={disabled}
        />
      </div>
      <Button type="submit" size="icon" disabled={!message.trim() || disabled}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}