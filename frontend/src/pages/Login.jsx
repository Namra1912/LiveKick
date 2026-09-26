import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthBackground from '../components/auth/AuthBackground';
import AuthHero from '../components/auth/AuthHero';
import AuthCard from '../components/auth/AuthCard';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState('login');

  // Staggered entrance — hero first, card slightly after
  const [heroMounted, setHeroMounted] = useState(false);
  const [cardMounted, setCardMounted] = useState(false);

  useEffect(() => {
    const heroTimer = setTimeout(() => setHeroMounted(true), 40);
    const cardTimer = setTimeout(() => setCardMounted(true), 180);
    return () => {
      clearTimeout(heroTimer);
      clearTimeout(cardTimer);
    };
  }, []);

  const handleAuthSuccess = (email) => {
    const redirectTarget = searchParams.get('redirect') || '/';
    localStorage.setItem('livekick_user', JSON.stringify({ email, authenticated: true }));
    navigate(redirectTarget);
  };

  return (
    <div className="login-page">
      {/* Full-bleed static background — layer 0 */}
      <AuthBackground />

      {/* Content layer — hero left, card right */}
      <div className="login-page__layout">
        {/* Hero: logo + tagline — centered in the open left space */}
        <div className="login-page__hero-zone">
          <AuthHero isMounted={heroMounted} />
        </div>

        {/* Card: right-anchored surface */}
        <div className="login-page__card-zone">
          <div className={`login-page__card-wrapper ${cardMounted ? 'login-page__card-wrapper--mounted' : ''}`}>
            <AuthCard
              mode={mode}
              onToggleMode={(newMode) => setMode(newMode)}
              onSuccess={handleAuthSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
