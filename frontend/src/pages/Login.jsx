import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // Cursor-reactive state — floated up to page level so Background + Card share it
  const [mousePos, setMousePos] = useState({ x: 40, y: 50 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const heroTimer = setTimeout(() => setHeroMounted(true), 40);
    const cardTimer = setTimeout(() => setCardMounted(true), 180);
    return () => {
      clearTimeout(heroTimer);
      clearTimeout(cardTimer);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    const posX = (e.clientX / window.innerWidth) * 100;
    const posY = (e.clientY / window.innerHeight) * 100;
    const normX = (posX - 50) / 50;
    const normY = (posY - 50) / 50;

    setMousePos({ x: posX, y: posY });
    setParallax({ x: -normX * 8, y: -normY * 8 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 40, y: 50 });
    setParallax({ x: 0, y: 0 });
  }, []);

  const handleAuthSuccess = (email) => {
    const redirectTarget = searchParams.get('redirect') || '/';
    localStorage.setItem('livekick_user', JSON.stringify({ email, authenticated: true }));
    navigate(redirectTarget);
  };

  return (
    <div
      className="login-page"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Full-bleed animated background — layer 0 */}
      <AuthBackground
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        parallaxX={parallax.x}
        parallaxY={parallax.y}
      />

      {/* Content layer — hero left, card right */}
      <div className="login-page__layout">
        {/* Hero: logo + tagline — centered in the open left space */}
        <div className="login-page__hero-zone">
          <AuthHero isMounted={heroMounted} />
        </div>

        {/* Card: right-anchored, glass surface */}
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
