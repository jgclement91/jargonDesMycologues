'use client';

import { useActionState } from 'react';
import { login } from '../actions/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="flex flex-grow items-center justify-center bg-slate-50">
      <div className="bg-white rounded-lg border border-slate-200 p-8 w-full max-w-sm shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Administration</h1>
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Mot de passe
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              placeholder="••••••••"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  );
}
