import { ReactNode } from 'react';

export type BadgeVariant = 'navy' | 'gold' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  navy: 'badge-navy',
  gold: 'badge-gold',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
};

export function Badge({ children, variant = 'navy', className = '' }: BadgeProps) {
  const variantClass = variantClasses[variant];

  return <span className={`${variantClass} ${className}`}>{children}</span>;
}
