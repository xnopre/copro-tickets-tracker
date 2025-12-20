import { ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  variant?: 'blue' | 'yellow' | 'green' | 'gray' | 'red' | 'gray-light' | 'gray-dark';
  size?: 'xs' | 'sm';
  rounded?: boolean;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

const variants = {
  blue: 'bg-blue-100 text-blue-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  gray: 'bg-gray-100 text-gray-800',
  red: 'bg-red-100 text-red-800',
  'gray-light': 'bg-gray-200 text-gray-700',
  'gray-dark': 'bg-gray-600 text-white',
};

const sizes = {
  xs: 'px-3 py-1 text-xs',
  sm: 'px-4 py-2 text-sm',
};

export default function Badge({
  variant = 'blue',
  size = 'xs',
  rounded = true,
  children,
  className = '',
  'aria-label': ariaLabel,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'font-medium',
        rounded ? 'rounded-full' : 'rounded',
        variants[variant],
        sizes[size],
        className
      )}
      aria-label={ariaLabel}
    >
      {children}
    </span>
  );
}
