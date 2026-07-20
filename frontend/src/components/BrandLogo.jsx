import React from 'react';

/**
 * Official Brand Logo Component for SRI KEDARESWARA ENTERPRISES
 * Renders the official uploaded business logo image at 52px height
 */
export default function BrandLogo({ 
  variant = 'full', 
  theme = 'dark',   
  size = 'md',      
  className = ''
}) {
  const getHeight = () => {
    switch (size) {
      case 'sm': return 38;
      case 'lg': return 58;
      case 'xl': return 72;
      default: return 52; // 52px height requirement
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
