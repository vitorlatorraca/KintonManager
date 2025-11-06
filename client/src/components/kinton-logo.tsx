import { UtensilsCrossed } from "lucide-react";

interface KintonLogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function KintonLogo({ variant = 'full', size = 'md', className = '' }: KintonLogoProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  if (variant === 'icon') {
    return (
      <div className={`flex items-center ${className}`}>
        <UtensilsCrossed className={`${sizeClasses[size]} text-accent`} />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <UtensilsCrossed className={`${sizeClasses[size]} text-accent`} />
      <span className={`${textSizeClasses[size]} font-bold text-text-primary`}>
        Kinton Ramen
      </span>
    </div>
  );
}