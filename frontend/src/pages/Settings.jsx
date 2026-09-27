// src/pages/Settings.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Moon, Shield, LogOut, X } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Crest from '../components/shared/Crest';
import { useFollowedTeams } from '../context/FollowedTeamsContext';
import { teams } from '../data/mockData';
import { pageIn } from '../lib/motion';
import './Settings.css';

const LS_NOTIF_PREFS = 'lk_notif_prefs';
const DEFAULT_NOTIF_PREFS = {
  goals: true,
  matchStart: true,
  news: false,
  predictionResults: true,
};

function readNotifPrefs() {
  try {
    const val = localStorage.getItem(LS_NOTIF_PREFS);
    return val ? { ...DEFAULT_NOTIF_PREFS, ...JSON.parse(val) } : DEFAULT_NOTIF_PREFS;
  } catch {
    return DEFAULT_NOTIF_PREFS;
  }
}

const NOTIF_ROWS = [
  { key: 'goals', label: 'Goal alerts', hint: 'Push alerts for goals in your followed teams’ matches' },
  { key: 'matchStart', label: 'Match start', hint: 'Reminders shortly before kickoff' },
  { key: 'news', label: 'News digest', hint: 'Daily roundup of transfer and team news' },
  { key: 'predictionResults', label: 'Prediction results', hint: 'When your Predictions League picks are settled' },
];

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`settings-toggle ${checked ? 'settings-toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="settings-toggle__knob" />
    </button>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { favTeamIds, unfollowTeam } = useFollowedTeams();
  const [notifPrefs, setNotifPrefs] = useState(readNotifPrefs);

  useEffect(() => {
    try {
      localStorage.setItem(LS_NOTIF_PREFS, JSON.stringify(notifPrefs));
    } catch {
      // Storage unavailable — preference just won't persist across reloads.
    }
  }, [notifPrefs]);

  const followedTeams = favTeamIds
    .map((id) => teams.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <AppLayout>
      <motion.main className="settings-page" initial="hidden" animate="show" variants={pageIn}>
        <div className="settings-page__inner">
          <h1 className="settings-page__title">Settings</h1>

          {/* ── My Teams ─────────────────────────────────────────── */}
          <section className="settings-card">
            <h2 className="settings-card__title">My Teams</h2>
            {followedTeams.length === 0 ? (
              <p className="settings-card__empty">
                You&apos;re not following any teams yet — follow one from its team page.
              </p>
            ) : (
              <div className="settings-teams">
                {followedTeams.map((team) => (
                  <span key={team.id} className="settings-team-chip">
                    <Crest team={team} size={20} />
                    {team.shortName}
                    <button
                      type="button"
                      className="settings-team-chip__remove"
                      aria-label={`Unfollow ${team.name}`}
                      onClick={() => unfollowTeam(team.id)}
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* ── Notifications ────────────────────────────────────── */}
          <section className="settings-card">
            <h2 className="settings-card__title">
              <Bell size={16} strokeWidth={2} /> Notifications
            </h2>
            <div className="settings-rows">
              {NOTIF_ROWS.map((row) => (
                <div key={row.key} className="settings-row">
                  <div className="settings-row__text">
                    <span className="settings-row__label">{row.label}</span>
                    <span className="settings-row__hint">{row.hint}</span>
                  </div>
                  <Toggle
                    checked={notifPrefs[row.key]}
                    onChange={(val) => setNotifPrefs((p) => ({ ...p, [row.key]: val }))}
                    label={row.label}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ── Appearance ───────────────────────────────────────── */}
          <section className="settings-card">
            <h2 className="settings-card__title">
              <Moon size={16} strokeWidth={2} /> Appearance
            </h2>
            <div className="settings-row settings-row--static">
              <div className="settings-row__text">
                <span className="settings-row__label">Night-Pitch Dark</span>
                <span className="settings-row__hint">The only theme available right now</span>
              </div>
              <span className="settings-badge">Active</span>
            </div>
          </section>

          {/* ── Account ──────────────────────────────────────────── */}
          <section className="settings-card">
            <h2 className="settings-card__title">
              <Shield size={16} strokeWidth={2} /> Account
            </h2>
            <button type="button" className="settings-logout" onClick={() => navigate('/login')}>
              <LogOut size={15} strokeWidth={2} /> Log Out
            </button>
          </section>
        </div>
      </motion.main>
    </AppLayout>
  );
}
