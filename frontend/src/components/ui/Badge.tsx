import { type ReactNode } from 'react';

export type BadgeVariant = 'navy' | 'gold' | 'success' | 'warning' | 'danger' | 'default';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  navy: 'badge-navy',
  gold: 'badge-gold',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  default: 'bg-warm-gray-100 text-warm-gray-700',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({ children, variant = 'navy', size = 'md', className = '' }: BadgeProps) {
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantClass} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
}
