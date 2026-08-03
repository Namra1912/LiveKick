// src/components/icons/CoinIcon.jsx
// Custom SVG coin icon — never the 🪙 emoji.
// Used everywhere a Matchday Coins amount appears.

export default function CoinIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Outer coin circle */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="#f59e0b"
        stroke="#d97706"
        strokeWidth="1"
      />
      {/* Inner ring detail */}
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Center dollar-free mark — just a stylized inner dot */}
      <circle cx="12" cy="12" r="2.5" fill="#fbbf24" opacity="0.5" />
    </svg>
  );
}
