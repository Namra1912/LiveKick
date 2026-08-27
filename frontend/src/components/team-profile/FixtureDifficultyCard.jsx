// src/components/team-profile/FixtureDifficultyCard.jsx
import { useMemo } from 'react';
import Crest from '../shared/Crest';
import { matches, standings } from '../../data/mockData';
import './FixtureDifficultyCard.css';

export default function FixtureDifficultyCard({ team }) {
  // Get upcoming 4 matches for this team
  const upcomingMatches = useMemo(() => {
    if (!team) return [];
    return matches
      .filter(
        (m) =>
          (m.homeTeam?.id === team.id || m.awayTeam?.id === team.id) &&
          m.status === 'upcoming'
      )
      .slice(0, 4);
  }, [team]);

  // Next 3 opponents for fixture difficulty row
  const difficultyItems = useMemo(() => {
    const nextThree = upcomingMatches.slice(0, 3);
    const leagueRows = standings[team?.league] ?? [];

    return nextThree.map((m) => {
      const isHome = m.homeTeam?.id === team.id;
      const opponent = isHome ? m.awayTeam : m.homeTeam;

      // Determine difficulty heuristic from opponent's standings rank
      const rank = leagueRows.findIndex((r) => r.team?.id === opponent?.id) + 1;

      let level = 'MODERATE';
      let levelClass = 'diff-badge--mod';
      if (rank > 0 && rank <= 4) {
        level = 'HARD';
        levelClass = 'diff-badge--hard';
      } else if (rank >= 10 || rank === 0) {
        level = 'EASY';
        levelClass = 'diff-badge--easy';
      }

      return {
        matchId: m.id,
        opponent,
        isHome,
        level,
        levelClass,
      };
    });
  }, [upcomingMatches, team]);

  return (
    <div className="fixture-card-group">
      {/* 1. Fixture Difficulty Card */}
      <div className="fixture-diff-card">
        <div className="fixture-diff-card__header">
          <span className="fixture-diff-card__title">FIXTURE DIFFICULTY</span>
          <span className="fixture-diff-card__sub">Next 3 Opponents</span>
        </div>

        <div className="fixture-diff-card__opponents">
          {difficultyItems.length === 0 ? (
            <div className="fixture-diff-card__empty">No upcoming opponents</div>
          ) : (
            difficultyItems.map((item) => (
              <div key={item.matchId} className="fixture-diff-item">
                <Crest logoUrl={item.opponent?.logoUrl} name={item.opponent?.name} size={30} />
                <span className="fixture-diff-item__name">
                  {item.opponent?.shortName ?? 'OPP'} <small>({item.isHome ? 'H' : 'A'})</small>
                </span>
                <span className={`diff-badge ${item.levelClass}`}>{item.level}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Upcoming Fixtures List (Directly beneath Fixture Difficulty) */}
      <div className="upcoming-fixtures-card">
        <div className="upcoming-fixtures-card__header">
          <span className="upcoming-fixtures-card__title">UPCOMING FIXTURES</span>
        </div>

        <div className="upcoming-fixtures-card__list">
          {upcomingMatches.length === 0 ? (
            <div className="upcoming-fixtures-card__empty">No upcoming fixtures</div>
          ) : (
            upcomingMatches.map((m) => {
              const isHome = m.homeTeam?.id === team.id;
              const opponent = isHome ? m.awayTeam : m.homeTeam;

              return (
                <div key={m.id} className="upcoming-fixture-row">
                  <div className="upcoming-fixture-row__left">
                    <span className="upcoming-fixture-row__venue">{isHome ? 'VS' : '@'}</span>
                    <Crest logoUrl={opponent?.logoUrl} name={opponent?.name} size={24} />
                    <span className="upcoming-fixture-row__opp-name">{opponent?.name}</span>
                  </div>

                  <div className="upcoming-fixture-row__right">
                    <span className="upcoming-fixture-row__comp">{m.league ?? 'La Liga'}</span>
                    <span className="upcoming-fixture-row__date">Today · 21:00</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
