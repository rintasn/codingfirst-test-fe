
// components/claude-desktop/claude-interface.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { usePreferences } from '@/contexts/preferences-context';
import { api } from '@/lib/api';
import { UserPreferences } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Settings, BellRing, Moon, Sun, Languages } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from "sonner"


interface Message {
  id: string;
  content: string;
  sender: 'user' | 'claude';
  timestamp: Date;
  action?: string;
}

interface ClaudeInterfaceProps {
  className?: string;
}

export function ClaudeInterface({ className }: ClaudeInterfaceProps) {
  const { preferences, refreshPreferences } = usePreferences();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        id: uuidv4(),
        content: "Hello! I'm Claude, your AI assistant. I can help you manage your preferences. Try asking me to change your theme, language, or notification settings.",
        sender: 'claude',
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Scroll to the bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.sendMessageToClaude(userMessage.content);
      
      const claudeMessage: Message = {
        id: uuidv4(),
        content: response.message,
        sender: 'claude',
        timestamp: new Date(),
        action: response.action,
      };

      setMessages((prev) => [...prev, claudeMessage]);
      
      // If the preferences have been updated, refresh them
      if (response.action && (
        response.action === 'theme_updated' || 
        response.action === 'language_updated' || 
        response.action === 'notifications_updated'
      )) {
        await refreshPreferences();
        
        // Show toast notification for preference updates
        if (response.action === 'theme_updated') {
          toast.success(`Theme updated to ${response.preferences?.theme} mode`);
        } else if (response.action === 'language_updated') {
          toast.success(`Language updated to ${response.preferences?.language}`);
        } else if (response.action === 'notifications_updated') {
          toast.success(`Notifications ${response.preferences?.notifications ? 'enabled' : 'disabled'}`);
        }
      }
    } catch (error) {
      console.error('Error communicating with Claude:', error);
      
      // Add an error message from Claude
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          content: "I'm sorry, I encountered an error processing your request. Please try again later.",
          sender: 'claude',
          timestamp: new Date(),
        },
      ]);
      
      toast.error('Failed to communicate with Claude');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate suggested quick commands
  const suggestedCommands = [
    { 
      text: 'Change to dark theme', 
      icon: <Moon className="h-4 w-4" />,
      action: () => setInputMessage('Change my theme to dark mode') 
    },
    { 
      text: 'Change to light theme', 
      icon: <Sun className="h-4 w-4" />,
      action: () => setInputMessage('Change my theme to light mode') 
    },
    { 
      text: 'Switch language', 
      icon: <Languages className="h-4 w-4" />,
      action: () => setInputMessage('Change my language to Spanish') 
    },
    { 
      text: 'Toggle notifications', 
      icon: <BellRing className="h-4 w-4" />,
      action: () => setInputMessage('Turn off notifications') 
    },
    { 
      text: 'Show my preferences', 
      icon: <Settings className="h-4 w-4" />,
      action: () => setInputMessage('What are my current preferences?') 
    },
  ];

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-full">C</div>
          </Avatar>
          <CardTitle className="text-lg">Claude Assistant</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-lg max-w-[80%] p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground ml-12'
                  : 'bg-muted mr-12'
              }`}
            >
              <p>{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user'
                  ? 'text-primary-foreground/70'
                  : 'text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      
      {/* Suggested commands section */}
      <div className="px-4 py-3 border-t flex gap-2 overflow-x-auto">
        {suggestedCommands.map((command, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="flex items-center whitespace-nowrap"
            onClick={command.action}
          >
            {command.icon}
            <span className="ml-1">{command.text}</span>
          </Button>
        ))}
      </div>
      
      {/* Input section */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Claude to change your preferences..."
            className="resize-none min-h-[60px]"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!inputMessage.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
      <Toaster />
    </Card>
  );
}