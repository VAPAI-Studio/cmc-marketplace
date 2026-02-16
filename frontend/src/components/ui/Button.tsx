import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
  icon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  gold: 'btn-gold',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  icon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];

  return (
    <button
      className={`${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
