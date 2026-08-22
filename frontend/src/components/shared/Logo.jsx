import React from 'react';
import bootIcon from '../../assets/livekick_boot_icon.png';
import './Logo.css';

export default function Logo({ size = 'normal', className = '' }) {
  return (
    <div className={`livekick-logo livekick-logo--${size} ${className}`}>
      <img src={bootIcon} alt="LiveKick Logo" className="livekick-logo__img" />
      <span className="livekick-logo__wordmark">LiveKick</span>
    </div>
  );
}
