import React from 'react';
import Logo from '../shared/Logo';
import './AuthHero.css';

export default function AuthHero({ isMounted }) {
  return (
    <div className={`auth-hero ${isMounted ? 'auth-hero--visible' : ''}`}>
      <div className="auth-hero__logo-wrap">
        <Logo size="large" className="auth-hero__logo" />
      </div>
      <p className="auth-hero__tagline">Every match. Every moment.</p>
    </div>
  );
}
