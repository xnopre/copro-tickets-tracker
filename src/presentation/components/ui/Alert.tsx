import { ReactNode } from 'react';
import clsx from 'clsx';

interface AlertProps {
  variant?: 'error' | 'success' | 'info' | 'warning';
  children: ReactNode;
  className?: string;
  id?: string;
}

const variants = {
  error: 'border-red-400 bg-red-100 text-red-700',
  success: 'border-green-400 bg-green-100 text-green-700',
  info: 'border-blue-400 bg-blue-100 text-blue-700',
  warning: 'border-yellow-400 bg-yellow-100 text-yellow-700',
};

const roles = {
  error: 'alert',
  success: 'status',
  info: 'status',
  warning: 'alert',
};

const ariaLive = {
  error: 'assertive' as const,
  success: 'polite' as const,
  info: 'polite' as const,
  warning: 'assertive' as const,
};

export default function Alert({ variant = 'info', children, className = '', id }: AlertProps) {
  return (
    <div
      id={id}
      className={clsx('mb-4 rounded-md border p-3 text-sm', variants[variant], className)}
      role={roles[variant]}
      aria-live={ariaLive[variant]}
    >
      {children}
    </div>
  );
}
