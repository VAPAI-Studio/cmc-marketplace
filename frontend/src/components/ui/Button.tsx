import { type ButtonHTMLAttributes, type ReactNode } from 'react';
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
  primary: 'bg-cmc-navy text-white hover:bg-cmc-navy-700 focus:ring-cmc-navy-500',
  secondary: 'border-2 border-cmc-navy text-cmc-navy bg-white hover:bg-cmc-navy-50 focus:ring-cmc-navy-500',
  gold: 'bg-cmc-gold text-cmc-navy hover:bg-cmc-gold-700 focus:ring-cmc-gold-500',
  ghost: 'text-cmc-navy hover:bg-cmc-navy-50 focus:ring-cmc-navy-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const baseButtonClasses = 'px-4 py-2 rounded font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

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
      className={`${baseButtonClasses} ${variantClass} ${sizeClass} ${className}`}
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
