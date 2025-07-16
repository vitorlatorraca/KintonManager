interface KintonLogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PigIcon = () => (
  <svg 
    viewBox="0 0 100 60" 
    className="w-8 h-5"
    fill="currentColor"
  >
    <path d="M15 25 Q15 15 25 15 L75 15 Q85 15 85 25 L85 35 Q85 45 75 45 L25 45 Q15 45 15 35 Z"/>
    <circle cx="30" cy="25" r="2"/>
    <circle cx="70" cy="25" r="2"/>
    <ellipse cx="50" cy="30" rx="3" ry="2"/>
    <path d="M20 20 Q15 15 10 20"/>
    <path d="M80 20 Q85 15 90 20"/>
    <path d="M35 40 Q40 42 45 40"/>
    <path d="M55 40 Q60 42 65 40"/>
    <circle cx="85" cy="15" r="2"/>
  </svg>
);

const RamenBowlIcon = () => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-8 h-8"
    fill="currentColor"
  >
    <ellipse cx="50" cy="70" rx="40" ry="25"/>
    <ellipse cx="50" cy="65" rx="35" ry="20" fill="rgba(0,0,0,0.2)"/>
    <path d="M20 45 Q25 35 30 45 Q35 55 40 45 Q45 35 50 45 Q55 55 60 45 Q65 35 70 45 Q75 55 80 45" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="35" cy="50" r="2"/>
    <circle cx="65" cy="55" r="2"/>
    <path d="M45 55 L55 50" stroke="currentColor" strokeWidth="2"/>
    <path d="M30 60 L40 55" stroke="currentColor" strokeWidth="2"/>
    <path d="M60 60 L70 55" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export default function KintonLogo({ variant = 'full', size = 'md', className = '' }: KintonLogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  if (variant === 'icon') {
    return (
      <div className={`kinton-logo ${sizeClasses[size]} ${className}`}>
        <PigIcon />
      </div>
    );
  }

  return (
    <div className={`kinton-logo ${sizeClasses[size]} ${className} kinton-glow`}>
      <PigIcon />
      <span>KINTON RAMEN</span>
    </div>
  );
}