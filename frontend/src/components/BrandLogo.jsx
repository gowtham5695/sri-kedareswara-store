import React from 'react';

/**
 * Premium Brand Logo Component for SRI KEDARESWARA ENTERPRISES
 * Combining Plumbing (Water Drop / Pipe) & Electrical (Lightning Bolt)
 */
export default function BrandLogo({ 
  variant = 'full', // 'full' | 'horizontal' | 'vertical' | 'icon'
  theme = 'dark',   // 'dark' | 'light' | 'white'
  size = 'md',      // 'sm' | 'md' | 'lg' | 'xl'
  className = ''
}) {
  const getScale = () => {
    switch (size) {
      case 'sm': return { icon: 34, text: 0.85 };
      case 'lg': return { icon: 52, text: 1.25 };
      case 'xl': return { icon: 72, text: 1.6 };
      default: return { icon: 42, text: 1 };
    }
  };

  const { icon: iconSize } = getScale();

  const textColorMain = theme === 'white' ? '#FFFFFF' : (theme === 'light' ? '#FFFFFF' : '#0F172A');
  const textColorSub = theme === 'white' ? '#93C5FD' : '#2563EB';
  const textColorTag = theme === 'white' ? '#FDE047' : '#D97706';

  // Integrated SVG Icon combining Water Drop + Pipe + Lightning Bolt
  const LogoSymbol = (
    <svg 
      width={iconSize} 
      height={iconSize} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="brand-logo-svg"
    >
      {/* Background Badge Shield */}
      <rect width="100" height="100" rx="24" fill={theme === 'white' ? 'rgba(255,255,255,0.15)' : '#0F172A'} />
      
      {/* Plumbing: Water Drop & Pipe Arc */}
      <path 
        d="M50 18 C34 40 24 50 24 64 C24 78.36 35.64 90 50 90 C64.36 90 76 78.36 76 64 C76 50 66 40 50 18 Z" 
        fill="url(#waterGrad)" 
      />

      {/* Water Drop Inner Highlight */}
      <path 
        d="M38 58 C38 48 44 40 50 30 C48 38 42 46 42 56 C42 62 45 68 50 72 C43 70 38 65 38 58 Z" 
        fill="#FFFFFF" 
        opacity="0.35" 
      />

      {/* Electrical: Golden Lightning Bolt */}
      <path 
        d="M54 26 L36 54 H50 L44 80 L66 50 H52 L58 26 Z" 
        fill="url(#boltGrad)" 
        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="waterGrad" x1="24" y1="18" x2="76" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        <linearGradient id="boltGrad" x1="36" y1="26" x2="66" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`brand-logo-icon-only ${className}`}>{LogoSymbol}</div>;
  }

  return (
    <div className={`brand-logo-container brand-${variant} theme-${theme} ${className}`}>
      {LogoSymbol}
      
      <div className="brand-text-block">
        <span className="brand-name-en" style={{ color: textColorMain }}>
          SRI KEDARESWARA
        </span>
        <span className="brand-sub-title" style={{ color: textColorSub }}>
          ENTERPRISES
        </span>
        <span className="brand-tagline-small" style={{ color: textColorTag }}>
          PLUMBING & ELECTRICAL SUPPLIES
        </span>
      </div>
    </div>
  );
}
