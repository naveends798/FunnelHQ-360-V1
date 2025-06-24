import React from 'react';

interface PortlHQLogoLargeProps {
  className?: string;
  size?: number;
}

export const PortlHQLogoLarge: React.FC<PortlHQLogoLargeProps> = ({ className = "", size = 120 }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-300 hover:scale-105"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="modernGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="accentGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="rgba(0,0,0,0.15)" />
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(139,92,246,0.1)" />
          </filter>
        </defs>

        {/* Modern Geometric Background - Larger */}
        <rect 
          x="10" 
          y="10" 
          width="100" 
          height="100" 
          rx="24" 
          fill="url(#modernGradientLarge)"
          filter="url(#softShadow)"
          className="drop-shadow-2xl"
        />
        
        {/* Inner Frame */}
        <rect 
          x="18" 
          y="18" 
          width="84" 
          height="84" 
          rx="18" 
          fill="none" 
          stroke="rgba(255,255,255,0.15)" 
          strokeWidth="2"
        />

        {/* Clean "P" Letter - Larger */}
        <g transform="translate(35, 28) scale(2)">
          <path
            d="M0 0 L0 28 L6 28 L6 16 L16 16 C22 16 26 12 26 6 C26 2 22 0 16 0 Z M6 6 L6 10 L16 10 C18 10 20 8 20 6 C20 4 18 6 16 6 Z"
            fill="white"
            className="drop-shadow-md"
          />
        </g>

        {/* Modern "HQ" Badge - Larger */}
        <g transform="translate(72, 72) scale(1.5)">
          <rect 
            x="0" 
            y="0" 
            width="24" 
            height="12" 
            rx="6" 
            fill="url(#accentGradientLarge)"
            className="drop-shadow-lg"
          />
          <text 
            x="12" 
            y="8.5" 
            fontSize="7" 
            fontWeight="700" 
            textAnchor="middle" 
            fill="white" 
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            HQ
          </text>
        </g>

        {/* Subtle Corner Accents */}
        <circle cx="28" cy="28" r="2" fill="rgba(255,255,255,0.3)" />
        <circle cx="92" cy="28" r="1.5" fill="rgba(255,255,255,0.2)" />
        <circle cx="28" cy="92" r="1.5" fill="rgba(255,255,255,0.2)" />
        <circle cx="92" cy="92" r="2" fill="rgba(255,255,255,0.3)" />

        {/* Minimal Grid Pattern */}
        <g opacity="0.1">
          <line x1="60" y1="18" x2="60" y2="102" stroke="white" strokeWidth="1" />
          <line x1="18" y1="60" x2="102" y2="60" stroke="white" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};

export default PortlHQLogoLarge;