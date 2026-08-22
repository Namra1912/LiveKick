import React from 'react';
import Logo from '../shared/Logo';
import './AuthHero.css';

export default function AuthHero({ isMounted }) {
  return (
    <div className={`auth-hero ${isMounted ? 'auth-hero--visible' : ''}`}>
      <div className="auth-hero__logo-wrap">
        <Logo size="large" className="auth-hero__logo" />
        {/* Subtle idle glow halo under the boot icon — very low opacity, long cycle */}
        <div className="auth-hero__glow" />
      </div>
      <p className="auth-hero__tagline">Every match. Every moment.</p>
    </div>
  );
}
