import React from 'react';

/**
 * Premium Brand Logo Option 2 for SRI KEDARESWARA ENTERPRISES
 * Clean horizontal lockup with Water Drop Pipe + Golden Lightning Plug Icon
 */
export default function BrandLogo({ 
  variant = 'full', // 'full' | 'horizontal' | 'vertical' | 'icon'
  theme = 'dark',   // 'dark' | 'light' | 'white'
  size = 'md',      // 'sm' | 'md' | 'lg' | 'xl'
  className = ''
}) {
  const getScale = () => {
    switch (size) {
      case 'sm': return { icon: 36, text: 0.85 };
      case 'lg': return { icon: 56, text: 1.25 };
      case 'xl': return { icon: 76, text: 1.6 };
      default: return { icon: 46, text: 1 };
    }
  };

  const { icon: iconSize } = getScale();

  const textColorMain = theme === 'white' ? '#FFFFFF' : (theme === 'light' ? '#FFFFFF' : '#0F172A');
  const textColorSub = theme === 'white' ? '#93C5FD' : '#2563EB';
  const textColorTag = theme === 'white' ? '#FDE047' : '#D97706';

  // Logo Option 2: Sleek Shield Badge with Plumbing Arc & Electric Lightning Spark
  const LogoSymbol = (
    <svg 
      width={iconSize} 
      height={iconSize} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="brand-logo-svg"
    >
      {/* Outer Hex-Shield Badge */}
      <rect width="96" height="96" x="2" y="2" rx="22" fill="#0F172A" stroke="#F59E0B" strokeWidth="2.5" />
      
      {/* Outer Water Pipe Ring Arc (Plumbing) */}
      <path 
        d="M22 50 C22 34.5 34.5 22 50 22 C65.5 22 78 34.5 78 50 C78 65.5 65.5 78 50 78 C42 78 35 74.5 30 69" 
        stroke="url(#waterGradOpt2)" 
        strokeWidth="9" 
        strokeLinecap="round" 
      />

      {/* Water Drop Highlight Bubble */}
      <circle cx="28" cy="34" r="5" fill="#38BDF8" />

      {/* Center Golden Lightning Bolt & Plug Spark (Electrical) */}
      <path 
        d="M55 24 L36 52 H50 L43 76 L66 48 H52 L57 24 Z" 
        fill="url(#boltGradOpt2)" 
        filter="drop-shadow(0px 2px 5px rgba(0,0,0,0.4))"
      />

      {/* Electric Plug Prongs */}
      <rect x="42" y="14" width="4" height="8" rx="2" fill="#FBBF24" />
      <rect x="54" y="14" width="4" height="8" rx="2" fill="#FBBF24" />

      {/* Gradients */}
      <defs>
        <linearGradient id="waterGradOpt2" x1="22" y1="22" x2="78" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        <linearGradient id="boltGradOpt2" x1="36" y1="24" x2="66" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
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
