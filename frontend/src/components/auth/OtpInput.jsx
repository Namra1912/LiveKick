import React, { useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import './OtpInput.css';

export default function OtpInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  isError = false,
  isSuccess = false,
  isDisabled = false,
}) {
  const inputRefs = useRef([]);

  // Ensure value is formatted as string of given length
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    // Focus first empty input box on mount
    if (!isDisabled && !isSuccess) {
      const firstEmptyIndex = digits.findIndex((d) => !d);
      const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
      inputRefs.current[targetIndex]?.focus();
    }
  }, [isDisabled, isSuccess]);

  const handleChange = (e, index) => {
    if (isSuccess) return;
    const rawVal = e.target.value;
    const inputDigit = rawVal.replace(/\D/g, '').slice(-1); // take last typed numeric digit

    const newDigits = [...digits];
    newDigits[index] = inputDigit;
    const newCode = newDigits.join('');

    onChange(newCode);

    // Auto-advance if digit was entered
    if (inputDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all digits are populated
    if (newCode.length === length && !newCode.includes('')) {
      if (onComplete) onComplete(newCode);
    }
  };

  const handleKeyDown = (e, index) => {
    if (isSuccess) return;
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move focus to previous box and clear it
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    if (isSuccess) return;
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();

      if (pastedData.length === length && onComplete) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <div
      className={`otp-input-container ${isError ? 'otp-input-container--error' : ''} ${
        isSuccess ? 'otp-input-container--success' : ''
      }`}
    >
      {digits.map((digit, idx) => {
        const isMiddleGap = idx === 2; // Extra gap after 3rd digit for 3+3 scannability
        return (
          <div
            key={idx}
            className={`otp-digit-wrapper ${isMiddleGap ? 'otp-digit-wrapper--gap' : ''}`}
          >
            <input
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              placeholder="-"
              disabled={isDisabled || isSuccess}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              className={`otp-digit-box ${digit ? 'otp-digit-box--filled' : ''}`}
              aria-label={`Digit ${idx + 1} of ${length}`}
            />
            {isSuccess && idx === length - 1 && (
              <span className="otp-success-checkmark">
                <Check size={18} strokeWidth={3} />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
