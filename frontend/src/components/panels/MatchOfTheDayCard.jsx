// src/components/panels/MatchOfTheDayCard.jsx
// "Match of the Day" feature card — large crests, kickoff time, description
//
// BUG FIXED (1): kickoff time previously used getUTCHours()/getUTCMinutes(), silently
//   displaying UTC time instead of the viewer's local time. Replaced with
//   toLocaleTimeString() which the browser converts from UTC automatically.
//   No timezone label appended (future addition).
// BUG FIXED (2): hardcoded "Tonight" label replaced with a dynamic label computed from
//   the match's actual calendar date relative to today: "Today", "Tomorrow", or
//   "Weekday, DD Mon" (e.g. "Fri, 14 Aug") for any other date.
// PredictorCard.jsx already used toLocaleTimeString — it was already correct, not touched.

import { useNavigate } from 'react-router-dom';
import Crest from '../shared/Crest';
import './MatchOfTheDayCard.css';

// Returns the kickoff time in the viewer's local timezone.
// toLocaleTimeString handles UTC→local conversion automatically via the browser.
// Future: append timeZoneName:'short' option if a timezone label becomes a requirement.
function formatKickoffTime(isoString) {
  if (!isoString) return '--:--';
  return new Date(isoString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Returns "Today", "Tomorrow", or "Weekday, DD Mon" (e.g. "Fri, 14 Aug")
// by comparing the match's local calendar date with today's local calendar date.
function getMatchDayLabel(isoString) {
  if (!isoString) return 'Today';

  // Both dates must be compared in local calendar coordinates, not UTC,
  // so we use getFullYear/getMonth/getDate (local) on both sides.
  const matchDate = new Date(isoString);
  const today = new Date();

  const matchDay = matchDate.getFullYear() * 10000 + matchDate.getMonth() * 100 + matchDate.getDate();
  const todayDay = today.getFullYear() * 10000 + today.getMonth() * 100 + today.getDate();
  const tomorrowDay = todayDay + 1; // safe for same-month increments up to one day

  // Recalculate tomorrow properly to avoid month-boundary arithmetic errors
  const tomorrowDate = new Date(today);
  tomorrowDate.setDate(today.getDate() + 1);
  const tomorrowKey =
    tomorrowDate.getFullYear() * 10000 +
    tomorrowDate.getMonth() * 100 +
    tomorrowDate.getDate();

  if (matchDay === todayDay) return 'Today';
  if (matchDay === tomorrowKey) return 'Tomorrow';

  // Any other date: "Fri, 14 Aug"
  return matchDate.toLocaleDateString([], {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function MatchOfTheDayCard({ match }) {
  const navigate = useNavigate();
  if (!match) return null;

  const kickoffTime = formatKickoffTime(match.matchDateUtc);
  const dayLabel = getMatchDayLabel(match.matchDateUtc);

  return (
    <article
      className="motd-card"
      onClick={() => navigate(`/matches/${match.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/matches/${match.id}`)}
    >
      {/* Top: crests + time */}
      <div className="motd-card__top">
        <Crest logoUrl={match.homeTeam.logoUrl ?? match.homeTeam.crestUrl} name={match.homeTeam.name} size={42} />

        {/* Center: dynamic day label + local kickoff time */}
        <div className="motd-card__time-block">
          <span className="motd-card__time-label">{dayLabel}</span>
          <div className="score-box motd-card__time-box">{kickoffTime}</div>
        </div>

        <Crest logoUrl={match.awayTeam.logoUrl ?? match.awayTeam.crestUrl} name={match.awayTeam.name} size={45} />
      </div>

      {/* Bottom: label + matchup + desc */}
      <div className="motd-card__bottom">
        <span className="motd-card__label">Match of the Day</span>
        <h3 className="motd-card__matchup">
          {match.homeTeam.name} vs {match.awayTeam.name}
        </h3>
        <p className="motd-card__desc">
          {match.venue} — both sides look to secure a crucial three points in this top-flight encounter.
        </p>
      </div>
    </article>
  );
}
