'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { usePreferences } from '@/contexts/preferences-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings, MessageSquare, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { preferences } = usePreferences();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated || !user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Welcome, {user.username}!</h1>
        <p className="text-muted-foreground mt-2">Manage your preferences and enjoy your personalized experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Preferences</CardTitle>
            <CardDescription>Current settings for your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Theme</span>
              <span className="font-medium capitalize">{preferences?.theme || 'Loading...'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Language</span>
              <span className="font-medium capitalize">{preferences?.language || 'Loading...'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Notifications</span>
              <span className="font-medium">{preferences?.notifications ? 'Enabled' : 'Disabled'}</span>
            </div>
            <Button asChild className="w-full mt-4">
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Manage Settings
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claude Desktop</CardTitle>
            <CardDescription>Chat with Claude to manage your preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You can ask Claude to help you update your preferences using natural language commands.
            </p>
            <p className="text-sm text-muted-foreground">
              For example, try saying:
              <ul className="list-disc list-inside mt-2">
                <li>Change my theme to dark mode</li>
                <li>Switch my language to Spanish</li>
                <li>Turn off notifications</li>
              </ul>
            </p>
            <Button asChild className="w-full mt-4">
              <Link href="/claude">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat with Claude
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}