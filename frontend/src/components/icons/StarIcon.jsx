// src/components/icons/StarIcon.jsx
// Custom SVG star — never the Unicode ★ character.
// Supports filled (favorited) and outline (unfavorited) states.

export default function StarIcon({ filled = false, size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'var(--color-star)' : 'none'}
      stroke={filled ? 'var(--color-star)' : 'var(--color-faint)'}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
