import { type HTMLAttributes, type ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevated?: boolean;
  padding?: boolean;
}

export function Card({
  children,
  elevated = false,
  padding = true,
  className = '',
  ...props
}: CardProps) {
  const cardClass = elevated ? 'card-elevated' : 'card';
  const paddingClass = padding ? 'p-6' : '';

  return (
    <div className={`${cardClass} ${paddingClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`border-b border-warm-gray-200 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return <h3 className={`text-xl font-semibold text-cmc-navy ${className}`}>{children}</h3>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`border-t border-warm-gray-200 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  );
}
