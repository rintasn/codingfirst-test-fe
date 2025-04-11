// app/(auth)/login/page.tsx
import { LoginForm } from '../../_components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">Sign in to access your account and preferences</p>
      </div>
      <LoginForm />
    </div>
  );
}