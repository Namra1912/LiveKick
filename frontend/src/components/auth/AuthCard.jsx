import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import GoogleButton from './GoogleButton';
import './AuthCard.css';

export default function AuthCard({ mode, onToggleMode, onSuccess }) {
  // Track sub-step for register flow to dynamically update card heading
  const [registerStep, setRegisterStep] = useState(1);
  const [googleToast, setGoogleToast] = useState(false);

  const handleGoogleClick = () => {
    setGoogleToast(true);
    setTimeout(() => setGoogleToast(false), 3000);
    // Simulate successful Google sign-in
    setTimeout(() => {
      onSuccess('google.user@example.com');
    }, 1200);
  };

  // Header dynamic resolution
  let title = 'WELCOME BACK';
  let subtext = 'Enter your credentials to access live match centers and predictions.';

  if (mode === 'register') {
    if (registerStep === 1) {
      title = 'CREATE ACCOUNT';
      subtext = 'Join LiveKick to track live transfers, predictions & tactics.';
    } else if (registerStep === 2) {
      title = 'VERIFY EMAIL';
      subtext = 'Enter the 6-digit code sent to your inbox.';
    } else if (registerStep === 3) {
      title = 'ALL SET!';
      subtext = 'Your account has been created successfully.';
    }
  }

  const showSocialDivider = !(mode === 'register' && registerStep > 1);

  return (
    <div className="auth-card">
      {/* Toast notice for Google OAuth simulation */}
      {googleToast && (
        <div className="auth-toast">
          Connecting to Google Account...
        </div>
      )}

      {/* Card Header */}
      <div className="auth-card__header">
        <h2 className="auth-card__title">{title}</h2>
        <p className="auth-card__subtext">{subtext}</p>
      </div>

      {/* Form Body */}
      <div className="auth-card__body">
        {mode === 'login' ? (
          <LoginForm onSuccess={onSuccess} />
        ) : (
          <RegisterForm
            onSuccess={onSuccess}
            onStepChange={(step) => setRegisterStep(step)}
          />
        )}
      </div>

      {/* Social Divider & Google Button */}
      {showSocialDivider && (
        <>
          <div className="auth-divider">
            <span className="auth-divider__line" />
            <span className="auth-divider__text">OR CONTINUE WITH</span>
            <span className="auth-divider__line" />
          </div>

          <div className="auth-card__social">
            <GoogleButton onClick={handleGoogleClick} label="Continue with Google" />
          </div>
        </>
      )}

      {/* Card Footer Mode Switcher Link */}
      {registerStep !== 3 && (
        <div className="auth-card__footer">
          {mode === 'login' ? (
            <p className="auth-footer-text">
              Don't have an account?{' '}
              <button
                type="button"
                className="auth-footer-link"
                onClick={() => {
                  setRegisterStep(1);
                  onToggleMode('register');
                }}
              >
                Create Account
              </button>
            </p>
          ) : (
            <p className="auth-footer-text">
              Already have an account?{' '}
              <button
                type="button"
                className="auth-footer-link"
                onClick={() => {
                  setRegisterStep(1);
                  onToggleMode('login');
                }}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
