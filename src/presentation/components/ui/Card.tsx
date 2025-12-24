import { ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered';
  shadow?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  children: ReactNode;
}

const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  variant = 'default',
  shadow = 'md',
  padding = 'md',
  clickable = false,
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg bg-white',
        variant === 'bordered' && 'border border-gray-200',
        shadows[shadow],
        paddings[padding],
        clickable && 'cursor-pointer transition-shadow hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
