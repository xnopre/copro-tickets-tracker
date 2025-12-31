import clsx from 'clsx';

type ContainerSize = 'sm' | 'md' | 'lg';

interface ContainerProps {
  size?: ContainerSize;
  children: React.ReactNode;
  className?: string;
}

const sizes: Record<ContainerSize, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-7xl',
};

export default function Container({ size = 'md', children, className }: ContainerProps) {
  return <div className={clsx('mx-auto', sizes[size], className)}>{children}</div>;
}
