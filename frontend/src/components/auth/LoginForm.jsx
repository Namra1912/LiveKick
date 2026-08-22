import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail, Lock, RefreshCw } from 'lucide-react';
import OtpInput from './OtpInput';

export default function LoginForm({ onSuccess, onForgotPassword }) {
  // Mode: 'password' or 'otp'
  const [authMode, setAuthMode] = useState('password');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP flow state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown timer effect for OTP resend
  useEffect(() => {
    let timer;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  // Handle password login submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(email);
    }, 500);
  };

  // Handle request OTP submit (Phase 1)
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setOtpSent(true);
      setCountdown(30);
    }, 500);
  };

  // Handle OTP verification submit (Phase 2)
  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    if (otpCode.length < 6) {
      setErrorMessage('Please enter the full 6-digit code');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    // Mock OTP verification logic: accepts '123456'
    setTimeout(() => {
      setIsSubmitting(false);
      if (otpCode === '123456' || otpCode === '000000') {
        setOtpSuccess(true);
        // Display green success flash before navigating
        setTimeout(() => {
          onSuccess(email);
        }, 700);
      } else {
        setOtpError(true);
        setErrorMessage('Invalid verification code');
        setTimeout(() => setOtpError(false), 900);
      }
    }, 400);
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    setCountdown(30);
    setOtpCode('');
    setOtpError(false);
    setOtpSuccess(false);
    setErrorMessage('New code sent to your email');
    setTimeout(() => setErrorMessage(''), 3000);
  };

  return (
    <div className="auth-form-wrapper">
      {/* Mode Selector Segmented Control */}
      <div className="auth-segmented-control">
        <button
          type="button"
          className={`auth-segmented-btn ${authMode === 'password' ? 'auth-segmented-btn--active' : ''}`}
          onClick={() => {
            setAuthMode('password');
            setOtpSent(false);
            setErrorMessage('');
          }}
        >
          Password
        </button>
        <button
          type="button"
          className={`auth-segmented-btn ${authMode === 'otp' ? 'auth-segmented-btn--active' : ''}`}
          onClick={() => {
            setAuthMode('otp');
            setErrorMessage('');
          }}
        >
          OTP Code
        </button>
      </div>

      {errorMessage && <div className="auth-error-banner">{errorMessage}</div>}

      {/* Mode A: Password Mode */}
      {authMode === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">Email address</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input
                id="login-email"
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
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="login-password">Password</label>
              <button
                type="button"
                className="auth-link-subtle"
                onClick={onForgotPassword}
              >
                Forgot?
              </button>
            </div>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={18} />
              <input
                id="login-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="auth-primary-btn"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      )}

      {/* Mode B: OTP Mode — Phase 1: Request Code */}
      {authMode === 'otp' && !otpSent && (
        <form onSubmit={handleSendOtp} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="otp-email">Email address</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input
                id="otp-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="auth-primary-btn"
          >
            <span>{isSubmitting ? 'Sending Code...' : 'Send Code'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      )}

      {/* Mode B: OTP Mode — Phase 2: Enter & Verify 6-digit Code */}
      {authMode === 'otp' && otpSent && (
        <form onSubmit={handleVerifyOtp} className="auth-form auth-form--fade-in">
          <div className="auth-otp-info">
            <p className="auth-otp-sent-text">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
            <button
              type="button"
              className="auth-link-subtle"
              onClick={() => setOtpSent(false)}
            >
              Edit email
            </button>
          </div>

          {/* Reusable OtpInput component with success/error states */}
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
            <span>{otpSuccess ? 'Verified!' : isSubmitting ? 'Verifying...' : 'Verify & Sign In'}</span>
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
    </div>
  );
}
