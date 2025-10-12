import type { ReactNode } from 'react';
import clsx from 'clsx';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /**
   * Container size constraint
   * - sm: max-w-screen-sm (640px)
   * - md: max-w-screen-md (768px)
   * - lg: max-w-screen-lg (1024px)
   * - xl: max-w-screen-xl (1280px)
   * - 2xl: max-w-screen-2xl (1536px)
   * - full: no max-width
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /**
   * Horizontal padding
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Center the container
   */
  center?: boolean;
}

/**
 * Responsive container component with configurable constraints
 */
export function Container({
  children,
  className,
  size = 'xl',
  padding = 'md',
  center = true,
}: ContainerProps) {
  const sizeClasses: Record<NonNullable<ContainerProps['size']>, string> = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const paddingClasses: Record<NonNullable<ContainerProps['padding']>, string> = {
    none: 'px-0',
    sm: 'px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
  };

  return (
    <div
      className={clsx(
        'w-full',
        sizeClasses[size],
        paddingClasses[padding],
        center && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}
