// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { PreferencesProvider } from '@/contexts/preferences-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'User Preferences App',
  description: 'An application to manage user preferences',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PreferencesProvider>
            {children}
          </PreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}