// src/components/team-profile/TeamForm.jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Crest from '../shared/Crest';
import { matches, leagues } from '../../data/mockData';
import './TeamForm.css';

function formatKickoff(isoString) {
  if (!isoString) return 'TBD';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return 'TBD';
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatMatchDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return 'Today';
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function TeamForm({ team }) {
  const navigate = useNavigate();

  // Find past 5 finished matches for this team
  const pastMatches = useMemo(() => {
    if (!team) return [];
    return matches
      .filter(
        (m) =>
          (m.homeTeam?.id === team.id || m.awayTeam?.id === team.id) &&
          m.status === 'finished'
      )
      .slice(-5);
  }, [team]);

  // Find next upcoming match for this team
  const nextMatch = useMemo(() => {
    if (!team) return null;
    return matches.find(
      (m) =>
        (m.homeTeam?.id === team.id || m.awayTeam?.id === team.id) &&
        (m.status === 'upcoming' || m.status === 'live')
    );
  }, [team]);

  // Derive league object & logo for next match
  const activeLeagueObj = useMemo(() => {
    const compName = nextMatch?.league ?? team?.league;
    if (!compName) return null;
    return leagues.find((l) => l.name.toLowerCase() === compName.toLowerCase()) ?? null;
  }, [nextMatch, team]);

  const leagueSlug = activeLeagueObj?.slug ?? 'laliga';

  return (
    <div className="team-form-row">
      {/* Team Form Card */}
      <div className="team-form-card">
        <div className="team-form-card__header">
          <span className="team-form-card__title">RECENT FORM</span>
        </div>

        <div className="team-form-card__chips">
          {pastMatches.length === 0 ? (
            <div className="team-form-card__empty">No recent matches recorded</div>
          ) : (
            pastMatches.map((m) => {
              const isHome = m.homeTeam?.id === team.id;
              const opponent = isHome ? m.awayTeam : m.homeTeam;
              const teamScore = isHome ? m.homeScore : m.awayScore;
              const oppScore = isHome ? m.awayScore : m.homeScore;

              let outcome = 'draw';
              if (teamScore > oppScore) {
                outcome = 'win';
              } else if (teamScore < oppScore) {
                outcome = 'loss';
              }

              return (
                <div
                  key={m.id}
                  className="team-form-chip"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (m?.id) navigate(`/matches/${m.id}`);
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && m?.id) {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/matches/${m.id}`);
                    }
                  }}
                  title={`View match details (${m.homeTeam?.name} vs ${m.awayTeam?.name})`}
                >
                  <div className={`team-form-chip__score-box team-form-chip__score-box--${outcome}`}>
                    {m.homeScore}-{m.awayScore}
                  </div>
                  <div className="team-form-chip__opponent">
                    <Crest logoUrl={opponent?.logoUrl ?? opponent?.crestUrl} name={opponent?.name} size={24} />
                    <span className="team-form-chip__opp-name">{opponent?.shortName ?? 'OPP'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Next Match Card */}
      <div className="next-match-card">
        <div className="next-match-card__header">
          <span className="next-match-card__title">NEXT MATCH</span>
          <div
            className="next-match-card__comp-wrap"
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/standings?league=${leagueSlug}`);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/standings?league=${leagueSlug}`);
              }
            }}
            title={`View ${nextMatch?.league ?? team?.league ?? 'La Liga'} standings`}
          >
            {activeLeagueObj?.logoUrl && (
              <img
                src={activeLeagueObj.logoUrl}
                alt={nextMatch?.league ?? team?.league}
                className="next-match-card__league-logo"
              />
            )}
            <span className="next-match-card__comp">
              {nextMatch?.league ?? team?.league ?? 'La Liga'}
            </span>
          </div>
        </div>

        {nextMatch ? (
          <div
            className="next-match-card__body"
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              if (nextMatch?.id) navigate(`/matches/${nextMatch.id}`);
            }}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && nextMatch?.id) {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/matches/${nextMatch.id}`);
              }
            }}
            title={`View ${nextMatch.homeTeam?.name} vs ${nextMatch.awayTeam?.name} match details`}
          >
            <div className="next-match-card__teams">
              <div className="next-match-card__team">
                <Crest logoUrl={nextMatch.homeTeam?.logoUrl} name={nextMatch.homeTeam?.name} size={36} />
                <span className="next-match-card__team-name">{nextMatch.homeTeam?.name}</span>
              </div>

              <div className="next-match-card__time-display">
                {nextMatch.status === 'live' ? (
                  <span className="next-match-card__live-pill">LIVE {nextMatch.minute}&rsquo;</span>
                ) : (
                  formatKickoff(nextMatch.matchDateUtc)
                )}
              </div>

              <div className="next-match-card__team">
                <Crest logoUrl={nextMatch.awayTeam?.logoUrl} name={nextMatch.awayTeam?.name} size={36} />
                <span className="next-match-card__team-name">{nextMatch.awayTeam?.name}</span>
              </div>
            </div>

            <div className="next-match-card__meta">
              <span className="next-match-card__time">
                {formatMatchDate(nextMatch.matchDateUtc)}
              </span>
            </div>
          </div>
        ) : (
          <div className="next-match-card__empty">No upcoming match scheduled</div>
        )}
      </div>
    </div>
  );
}
