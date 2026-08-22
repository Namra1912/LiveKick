import React, { useState, useRef } from 'react';
import Logo from '../shared/Logo';
import './AuthLeftPanel.css';

export default function AuthLeftPanel() {
  const panelRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();

    // Normalized mouse coordinates (0 to 100%)
    const posX = ((e.clientX - rect.left) / rect.width) * 100;
    const posY = ((e.clientY - rect.top) / rect.height) * 100;

    // Restrained parallax shift (-6px to +6px in opposite direction)
    const normX = (posX - 50) / 50;
    const normY = (posY - 50) / 50;
    const shiftX = -normX * 8;
    const shiftY = -normY * 8;

    setMousePos({ x: posX.toFixed(2), y: posY.toFixed(2) });
    setParallax({ x: shiftX.toFixed(2), y: shiftY.toFixed(2) });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 50, y: 50 });
    setParallax({ x: 0, y: 0 });
  };

  return (
    <div
      ref={panelRef}
      className="auth-left-panel"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`,
        '--parallax-x': `${parallax.x}px`,
        '--parallax-y': `${parallax.y}px`,
      }}
    >
      {/* 1. Cursor-reactive spotlight overlay */}
      <div className="auth-left-panel__spotlight" />

      {/* 2. Parallax background elements (grid & floodlight streaks) */}
      <div className="auth-left-panel__bg-layer">
        <div className="auth-left-panel__grid" />

        {/* Soft stadium floodlight beam streaks */}
        <div className="auth-left-panel__streak auth-left-panel__streak--1" />
        <div className="auth-left-panel__streak auth-left-panel__streak--2" />
        <div className="auth-left-panel__streak auth-left-panel__streak--3" />
      </div>

      {/* 3. Centered Brand Content (Real extracted Logo + Tagline ONLY) */}
      <div className="auth-left-panel__content">
        <Logo size="large" className="auth-left-panel__logo" />
        <p className="auth-left-panel__tagline">Every match. Every moment.</p>
      </div>
    </div>
  );
}
