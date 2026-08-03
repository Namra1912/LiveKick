// src/components/search/SearchModal.jsx
// Global search overlay — stub for Phase 0.

import { useEffect } from 'react';
import { X, Search } from 'lucide-react';
import './SearchModal.css';

export default function SearchModal({ isOpen, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="search-modal__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className="search-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="search-modal__box">
          {/* Search input row */}
          <div className="search-modal__input-row">
            <Search size={18} strokeWidth={1.75} color="var(--color-faint)" />
            <input
              autoFocus
              type="text"
              placeholder="Search teams, leagues, players..."
              className="search-modal__input"
              aria-label="Search input"
            />
            <button
              onClick={onClose}
              className="search-modal__close-btn"
              aria-label="Close search"
            >
              <X size={14} strokeWidth={2} color="var(--color-secondary)" />
            </button>
          </div>

          {/* Empty search state */}
          <div className="search-modal__empty">
            <p className="search-modal__empty-primary">
              Start typing to search teams, leagues, and players
            </p>
            <p className="search-modal__empty-secondary">
              Full search results coming in Phase 1
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
