import React from 'react';

/**
 * Official Brand Logo Component for SRI KEDARESWARA ENTERPRISES
 * Renders the official uploaded business logo image at 150px (mobile) / 185px (desktop) height
 */
export default function BrandLogo({ 
  variant = 'full', 
  theme = 'dark',   
  size = 'md',      
  className = ''
}) {
  const getHeight = () => {
    switch (size) {
      case 'sm': return 100;
      case 'lg': return 185;
      case 'xl': return 200;
      default: return 150; // 150px mobile height
    }
  };

  const logoHeight = getHeight();

  return (
    <div className={`brand-logo-official-wrapper ${className}`}>
      <img 
        src="/images/ske_official_logo.png" 
        alt="SRI KEDARESWARA ENTERPRISES - Plumbing & Electrical Supplies" 
        style={{ height: `${logoHeight}px`, width: 'auto', objectFit: 'contain' }}
        className="official-brand-logo-img"
      />
    </div>
  );
}
