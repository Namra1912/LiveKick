// src/components/transfers/FeeRangeSlider.jsx
import './FeeRangeSlider.css';

export default function FeeRangeSlider({ minVal = 0, maxVal = 150, onChange }) {
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal - 5);
    onChange({ min: value, max: maxVal });
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal + 5);
    onChange({ min: minVal, max: value });
  };
  
  const minPercent = (minVal / 150) * 100;
  const maxPercent = (maxVal / 150) * 100;

  return (
    <div className="frs-container">
      <div className="frs-header">
        <span className="frs-label">Fee Range</span>
        <span className="frs-value">
          €{minVal}M — {maxVal >= 150 ? '€150M+' : `€${maxVal}M`}
        </span>
      </div>

      <div className="frs-slider-wrapper">
        <div className="frs-track" />
        <div
          className="frs-range"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        <input
          type="range"
          min="0"
          max="150"
          step="5"
          value={minVal}
          onChange={handleMinChange}
          className="frs-input frs-input--left"
          aria-label="Minimum fee"
        />
        <input
          type="range"
          min="0"
          max="150"
          step="5"
          value={maxVal}
          onChange={handleMaxChange}
          className="frs-input frs-input--right"
          aria-label="Maximum fee"
        />
      </div>

      <span className="frs-caption">+ FREE / LOAN / UNDISCLOSED deals included</span>
    </div>
  );
}
