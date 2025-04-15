"use client";

import { LoginForm } from "@/components/auth/LoginForm";

export function LoginContent() {
  return (
    <div className="w-full max-w-md space-y-8 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
      <LoginForm />
    </div>
  );
} 