'use client';
import { useActionState, type ReactNode } from 'react';
import { mutate, type Result } from '@/app/actions';
export function ActionForm({
  children,
  label = 'Kaydet',
  className = '',
  confirm,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
  confirm?: string;
}) {
  const [state, action, pending] = useActionState<Result, FormData>(mutate, {});
  return (
    <form
      action={action}
      className={`form ${className}`}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {children}
      <button className="button" disabled={pending}>
        {pending ? 'Kaydediliyor…' : label}
      </button>
      {state.error && (
        <p role="alert" className="notice error">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="notice">
          {state.success}
        </p>
      )}
    </form>
  );
}
