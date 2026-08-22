import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail, Lock, User, CheckCircle2, RefreshCw } from 'lucide-react';
import OtpInput from './OtpInput';

export default function RegisterForm({ onSuccess, onStepChange }) {
  // Step 1: Registration Form, Step 2: OTP verification, Step 3: Success state
  const [step, setStep] = useState(1);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Notify parent component of step change for dynamic card header update
  useEffect(() => {
    if (onStepChange) {
      onStepChange(step, email);
    }
  }, [step, email, onStepChange]);

  // Step 1: Submit Register Form
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
      setCountdown(30);
    }, 500);
  };

  // Step 2: Submit OTP Verification
  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    if (otpCode.length < 6) {
      setErrorMessage('Please enter the 6-digit verification code');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    // Mock OTP verification logic: accepts '123456'
    setTimeout(() => {
      setIsSubmitting(false);
      if (otpCode === '123456' || otpCode === '000000') {
        setOtpSuccess(true);
        setTimeout(() => {
          setStep(3); // Success state screen
          setTimeout(() => {
            onSuccess(email);
          }, 1400);
        }, 700);
      } else {
        setOtpError(true);
        setErrorMessage('Invalid verification code');
        setTimeout(() => setOtpError(false), 900);
      }
    }, 500);
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    setCountdown(30);
    setOtpCode('');
    setOtpError(false);
    setOtpSuccess(false);
    setErrorMessage('Verification code resent to your email');
    setTimeout(() => setErrorMessage(''), 3000);
  };

  return (
    <div className="auth-form-wrapper">
      {errorMessage && <div className="auth-error-banner">{errorMessage}</div>}

      {/* Step 1: Initial Registration Form */}
      {step === 1 && (
        <form onSubmit={handleRegisterSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-name">Full name</label>
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" size={18} />
              <input
                id="reg-name"
                type="text"
                required
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-email">Email address</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input
                id="reg-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-password">Password</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={18} />
              <input
                id="reg-password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-confirm">Confirm password</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={18} />
              <input
                id="reg-confirm"
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="auth-primary-btn"
          >
            <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      )}

      {/* Step 2: Mandatory OTP Verification Step */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="auth-form auth-form--fade-in">
          <div className="auth-otp-info">
            <p className="auth-otp-sent-text">
              We sent a 6-digit verification code to <strong>{email}</strong>
            </p>
            <button
              type="button"
              className="auth-link-subtle"
              onClick={() => setStep(1)}
            >
              Change email
            </button>
          </div>

          <OtpInput
            value={otpCode}
            onChange={(val) => {
              setOtpCode(val);
              if (otpError) setOtpError(false);
            }}
            onComplete={(code) => {
              setOtpCode(code);
            }}
            isError={otpError}
            isSuccess={otpSuccess}
            isDisabled={isSubmitting}
          />

          <button
            type="submit"
            disabled={isSubmitting || otpCode.length < 6 || otpSuccess}
            className={`auth-primary-btn ${otpSuccess ? 'auth-primary-btn--success' : ''}`}
          >
            <span>{otpSuccess ? 'Verified!' : isSubmitting ? 'Verifying...' : 'Verify & Create Account'}</span>
            <ArrowRight size={18} />
          </button>

          <div className="auth-resend-row">
            {countdown > 0 ? (
              <span className="auth-resend-timer">
                Resend code in 0:{countdown < 10 ? `0${countdown}` : countdown}
              </span>
            ) : (
              <button
                type="button"
                className="auth-resend-btn"
                onClick={handleResendOtp}
              >
                <RefreshCw size={14} /> Resend code
              </button>
            )}
          </div>
        </form>
      )}

      {/* Step 3: Success State */}
      {step === 3 && (
        <div className="auth-success-state">
          <div className="auth-success-icon-ring">
            <CheckCircle2 size={54} className="auth-success-icon" />
          </div>
          <h3 className="auth-success-title">ACCOUNT VERIFIED</h3>
          <p className="auth-success-text">Welcome to LiveKick! Redirecting to dashboard...</p>
        </div>
      )}
    </div>
  );
}
