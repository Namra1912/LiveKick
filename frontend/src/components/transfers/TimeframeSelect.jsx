// src/components/transfers/TimeframeSelect.jsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './TimeframeSelect.css';

const TIMEFRAMES = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
];

export default function TimeframeSelect({ value = 'all', onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel =
    TIMEFRAMES.find((t) => t.value === value)?.label ?? 'All Time';

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="tfs-container" ref={containerRef}>
      <button
        type="button"
        className={`tfs-trigger${isOpen ? ' tfs-trigger--open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="tfs-trigger-label">{currentLabel}</span>
        <ChevronDown
          size={12}
          className={`tfs-chevron${isOpen ? ' tfs-chevron--open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="tfs-panel" role="listbox">
          {TIMEFRAMES.map((t) => {
            const isSelected = t.value === value;
            return (
              <div
                key={t.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                className={`tfs-option${isSelected ? ' tfs-option--selected' : ''}`}
                onClick={() => handleSelect(t.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelect(t.value);
                  }
                }}
              >
                <span>{t.label}</span>
                {isSelected && <Check size={12} className="tfs-check-icon" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
