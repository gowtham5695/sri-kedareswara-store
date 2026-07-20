import React from 'react';

/**
 * Official Brand Logo Component for SRI KEDARESWARA ENTERPRISES
 * Renders the official uploaded business logo image at large 75px height for high readability
 */
export default function BrandLogo({ 
  variant = 'full', 
  theme = 'dark',   
  size = 'md',      
  className = ''
}) {
  const getHeight = () => {
    switch (size) {
      case 'sm': return 52;
      case 'lg': return 84;
      case 'xl': return 96;
      default: return 75; // Large 75px height for crystal clear logo and text
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
