'use client';
import { useActionState, useState } from 'react';
import { authenticate, type Result } from '@/app/actions';
export function AuthForm({ enabled }: { enabled: boolean }) {
  const [role, setRole] = useState('teacher');
  const [mode, setMode] = useState('login');
  const [state, action, pending] = useActionState<Result, FormData>(authenticate, {});
  return (
    <form action={action} className="form">
      <div className="tabs" aria-label="Hesap türü">
        <button type="button" aria-pressed={role === 'teacher'} onClick={() => setRole('teacher')}>
          Öğretmen
        </button>
        <button type="button" aria-pressed={role === 'parent'} onClick={() => setRole('parent')}>
          Veli
        </button>
      </div>
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="mode" value={mode} />
      {mode === 'register' && (
        <label>
          Ad soyad
          <input name="name" required minLength={2} maxLength={100} autoComplete="name" />
        </label>
      )}
      <label>
        E-posta
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="adiniz@okul.com"
        />
      </label>
      <label>
        Şifre
        <input
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={128}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
      </label>
      <button className="button" disabled={pending || !enabled}>
        {pending ? 'Lütfen bekleyin…' : mode === 'login' ? 'Denizine giriş yap' : 'Hesap oluştur'}
      </button>
      {state.error && (
        <p className="notice error" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="notice" role="status">
          {state.success}
        </p>
      )}
      <button
        className="text-button"
        type="button"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
      >
        {mode === 'login'
          ? 'İlk kez mi geliyorsun? Hesap oluştur'
          : 'Zaten hesabın var mı? Giriş yap'}
      </button>
      <p className="muted small">Öğrenci hesabı gerekmez. Öğrenci profillerini öğretmen yönetir.</p>
    </form>
  );
}
