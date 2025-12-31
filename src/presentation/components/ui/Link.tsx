import NextLink from 'next/link';
import { AnchorHTMLAttributes, ComponentProps, ReactNode } from 'react';
import clsx from 'clsx';
import { UrlObject } from 'url';

type NextLinkHref = ComponentProps<typeof NextLink>['href'];

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: NextLinkHref | `/${string}` | UrlObject;
  variant?: 'text' | 'button' | 'unstyled';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const textStyles = 'text-blue-600 hover:text-blue-800';

const buttonStyles = {
  sm: 'bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700',
  md: 'bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700',
  lg: 'bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700',
};

const focusStyles = 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none';

export default function Link({
  href,
  variant = 'text',
  size = 'md',
  children,
  className = '',
  ...props
}: LinkProps) {
  return (
    <NextLink
      href={href as NextLinkHref}
      className={clsx(
        'rounded',
        focusStyles,
        variant === 'text' && textStyles,
        variant === 'button' && buttonStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
}
