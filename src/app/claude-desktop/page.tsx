// app/claude-desktop/page.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ClaudeInterface } from '../_components/claude-desktop/claude-interface';

export default function ClaudeDesktopPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Claude Desktop</h1>
        <p className="text-muted-foreground mt-2">
          Interact with Claude to manage your preferences using natural language
        </p>
      </div>

      <ClaudeInterface />

      <div className="mt-8 mx-auto max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Example Commands</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">Theme Management</h3>
            <ul className="space-y-2 text-sm">
              <li>"Change my theme to dark mode"</li>
              <li>"Switch to light mode please"</li>
              <li>"What theme am I currently using?"</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">Language Preferences</h3>
            <ul className="space-y-2 text-sm">
              <li>"Change language to Spanish"</li>
              <li>"Set my language to English"</li>
              <li>"What language is set right now?"</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">Notification Settings</h3>
            <ul className="space-y-2 text-sm">
              <li>"Turn off notifications"</li>
              <li>"Enable notifications please"</li>
              <li>"Are my notifications on or off?"</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">General Preferences</h3>
            <ul className="space-y-2 text-sm">
              <li>"What are all my current settings?"</li>
              <li>"Show me my preferences"</li>
              <li>"Help me customize my experience"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}