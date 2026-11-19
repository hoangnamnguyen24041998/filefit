import React from 'react';

interface BrandLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  variant?: 'mark' | 'mark-16' | 'auto';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 24,
  showWordmark = false,
  className = '',
  variant = 'auto',
}) => {
  const isMicro = variant === 'mark-16' || (variant === 'auto' && size <= 20);

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {isMicro ? (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
          aria-label="FileFit Logo"
        >
          <rect
            x="0.5"
            y="0.5"
            width="15"
            height="15"
            rx="3.5"
            fill="#0F172A"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.8"
          />
          <path
            d="M 3.5 5.8 V 4.2 C 3.5 3.8 3.8 3.5 4.2 3.5 H 5.8"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 3.5 10.2 V 11.8 C 3.5 12.2 3.8 12.5 4.2 12.5 H 5.8"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 10.2 12.5 H 11.8 C 12.2 12.5 12.5 12.2 12.5 11.8 V 10.2"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M 5.5 11.5 H 10.5" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M 8 11.5 V 6" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
          <path
            d="M 5.8 7.8 L 8 5.6 L 10.2 7.8"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12.2" cy="3.8" r="2.2" fill="#0F172A" />
          <circle cx="12.2" cy="3.8" r="1.5" fill="#10B981" />
        </svg>
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
          aria-label="FileFit Logo"
        >
          <defs>
            <linearGradient id="ff-logo-grad" x1="64" y1="4" x2="64" y2="124" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="ff-logo-border" x1="64" y1="4" x2="64" y2="124" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="120" height="120" rx="32" fill="url(#ff-logo-grad)" />
          <rect x="4.75" y="4.75" width="118.5" height="118.5" rx="31.25" stroke="url(#ff-logo-border)" strokeWidth="1.5" />
          <path d="M 38 7 Q 64 9.5 90 7" stroke="rgba(255,255,255,0.3)" strokeWidth="1.25" strokeLinecap="round" />
          <g stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 34 50 V 38 C 34 35.79 35.79 34 38 34 H 50" />
            <path d="M 34 78 V 90 C 34 92.21 35.79 94 38 94 H 50" />
            <path d="M 78 94 H 90 C 92.21 94 94 92.21 94 90 V 78" />
            <path d="M 76 34 H 80" />
            <path d="M 94 48 V 52" />
          </g>
          <path d="M 48 80 H 80" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M 64 80 V 48" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M 52 60 L 64 48 L 76 60" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 38 64 H 42" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <path d="M 86 64 H 90" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <circle cx="94" cy="34" r="10.5" fill="#0F172A" />
          <circle cx="94" cy="34" r="7.5" fill="#10B981" />
          <circle cx="92" cy="32" r="2.2" fill="#FFFFFF" fillOpacity="0.5" />
        </svg>
      )}

      {showWordmark && (
        <span className="font-semibold text-zinc-950 tracking-tight leading-none text-[15px] flex items-center">
          FileFit
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1.5" />
        </span>
      )}
    </div>
  );
};
