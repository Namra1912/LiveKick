import React, { useRef, useState, useEffect } from 'react';
import './AuthBackground.css';

// Stable particle definitions — generated once, never re-created
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${8 + Math.floor((i * 73 + 17) % 88)}%`,    // pseudo-random, deterministic
  duration: `${12 + (i * 3.7) % 14}s`,
  delay: `${-(i * 1.9) % 10}s`,                        // negative delay = already mid-flight on mount
  size: `${3 + (i * 1.3) % 4}px`,
  opacity: 0.12 + (i % 4) * 0.05,
  driftX: `${-15 + (i * 7) % 30}px`,                  // slight horizontal drift
}));

export default function AuthBackground({ mouseX, mouseY, parallaxX, parallaxY }) {
  return (
    <div
      className="auth-bg"
      style={{
        '--mouse-x': `${mouseX}%`,
        '--mouse-y': `${mouseY}%`,
        '--parallax-x': `${parallaxX}px`,
        '--parallax-y': `${parallaxY}px`,
      }}
    >
      {/* Layer 0: Base canvas — pure dark */}
      <div className="auth-bg__base" />

      {/* Layer 1: Grid texture + breathing pulse (parallax-shifted) */}
      <div className="auth-bg__parallax-layer">
        <div className="auth-bg__grid" />

        {/* Diagonal floodlight beam streaks */}
        <div className="auth-bg__streak auth-bg__streak--1" />
        <div className="auth-bg__streak auth-bg__streak--2" />
        <div className="auth-bg__streak auth-bg__streak--3" />
      </div>

      {/* Layer 2: Cursor-reactive spotlight — covers full viewport */}
      <div className="auth-bg__spotlight" />

      {/* Layer 3: Ambient atmosphere particles */}
      <div className="auth-bg__particles" aria-hidden="true">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="auth-bg__particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDuration: p.duration,
              animationDelay: p.delay,
              '--drift-x': p.driftX,
            }}
          />
        ))}
      </div>
    </div>
  );
}
