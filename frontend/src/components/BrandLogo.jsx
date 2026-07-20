import React from 'react';

/**
 * Official Brand Logo Component for SRI KEDARESWARA ENTERPRISES
 * Renders the official uploaded business logo image at extra large height for high visibility
 */
export default function BrandLogo({ 
  variant = 'full', 
  theme = 'dark',   
  size = 'md',      
  className = ''
}) {
  const getHeight = () => {
    switch (size) {
      case 'sm': return 75;
      case 'lg': return 130;
      case 'xl': return 140;
      default: return 110; // Extra Large 110px height for desktop & mobile prominence
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
