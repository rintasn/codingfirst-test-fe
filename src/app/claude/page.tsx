// app/claude/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { usePreferences } from '@/contexts/preferences-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatInput } from './../_components/claude-chat/chat-input';
import { ChatMessages } from './../_components/claude-chat/chat-messages';
import { v4 as uuidv4 } from 'uuid';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'claude';
  timestamp: Date;
}

export default function ClaudePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { refreshPreferences } = usePreferences();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      content: 'Hello! I\'m Claude. I can help you manage your preferences. Try asking me to change your theme, language, or notification settings.',
      sender: 'claude',
      timestamp: new Date(),
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      // Send message to Claude API
      const response = await api.sendMessageToClaude(content);
      
      // Add Claude's response to chat
      const claudeMessage: Message = {
        id: uuidv4(),
        content: response.message,
        sender: 'claude',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, claudeMessage]);
      
      // If preferences were updated, refresh them
      if (response.preferences) {
        await refreshPreferences();
      }
    } catch (error) {
      console.error('Error sending message to Claude:', error);
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        content: 'Sorry, I encountered an error processing your request.',
        sender: 'claude',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chat with Claude</CardTitle>
          <CardDescription>
            Ask Claude to help you manage your preferences using natural language
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChatMessages messages={messages} />
          <ChatInput onSendMessage={handleSendMessage} disabled={isSending} />
        </CardContent>
      </Card>
    </div>
  );
}