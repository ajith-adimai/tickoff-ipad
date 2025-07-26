import React from 'react';

interface AppIconProps {
  size?: number;
  className?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ size = 48, className = "" }) => {
  return (
    <svg 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tablet/Smartphone Body */}
      <rect x="8" y="4" width="32" height="40" rx="4" fill="url(#gradient)" stroke="white" strokeWidth="1"/>
      
      {/* Screen */}
      <rect x="10" y="6" width="28" height="36" rx="2" fill="white"/>
      
      {/* Checkbox in top-left */}
      <rect x="12" y="8" width="6" height="6" rx="1" fill="url(#gradient)"/>
      <path d="M14 11L16 13L18 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Calendar in top-right */}
      <rect x="30" y="8" width="6" height="6" rx="1" fill="url(#gradient)"/>
      <rect x="30" y="9" width="6" height="5" rx="0.5" fill="white"/>
      <rect x="32" y="11" width="2" height="2" rx="0.5" fill="url(#gradient)"/>
      
      {/* Progress bar */}
      <rect x="12" y="18" width="24" height="3" rx="1.5" fill="#e5e7eb"/>
      <rect x="12" y="18" width="16" height="3" rx="1.5" fill="url(#gradient)"/>
      
      {/* Text lines */}
      <rect x="12" y="24" width="20" height="1.5" rx="0.75" fill="url(#gradient)"/>
      <rect x="12" y="27" width="16" height="1.5" rx="0.75" fill="url(#gradient)"/>
      
      {/* Home button */}
      <circle cx="24" cy="42" r="1.5" fill="black"/>
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AppIcon; 