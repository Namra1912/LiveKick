// src/components/match/MatchEventsList.jsx
import { Goal, Square, ArrowLeftRight } from 'lucide-react';
import './MatchEventsList.css';

function EventIcon({ type }) {
  if (type === 'goal') return <Goal size={14} strokeWidth={2} className="match-event__icon match-event__icon--goal" />;
  if (type === 'card-yellow') return <Square size={12} strokeWidth={0} fill="currentColor" className="match-event__icon match-event__icon--yellow" />;
  if (type === 'card-red') return <Square size={12} strokeWidth={0} fill="currentColor" className="match-event__icon match-event__icon--red" />;
  if (type === 'sub') return <ArrowLeftRight size={13} strokeWidth={2.5} className="match-event__icon match-event__icon--sub" />;
  return null;
}

function EventLine({ event }) {
  if (event.type === 'goal') {
    return (
      <>
        <span className="match-event__player">{event.player}</span>
        {event.assist && <span className="match-event__sub-line">assist by {event.assist}</span>}
      </>
    );
  }
  if (event.type === 'card-yellow' || event.type === 'card-red') {
    return <span className="match-event__player">{event.player}</span>;
  }
  if (event.type === 'sub') {
    return (
      <>
        <span className="match-event__player match-event__player--on">{event.playerOn} <span className="match-event__sub-arrow">↑</span></span>
        <span className="match-event__sub-line">{event.playerOff} <span className="match-event__sub-arrow">↓</span></span>
      </>
    );
  }
  return null;
}

export default function MatchEventsList({ events, homeTeamId, awayTeamId }) {
  if (!events || events.length === 0) {
    return <p className="match-events__empty">No events recorded for this match yet.</p>;
  }

  const sorted = [...events].sort((a, b) => a.minute - b.minute);

  return (
    <div className="match-events">
      {sorted.map((event, i) => {
        const isHome = event.team === 'home';
        return (
          <div key={i} className={`match-event ${isHome ? 'match-event--home' : 'match-event--away'}`}>
            <div className="match-event__side match-event__side--home">
              {isHome && <EventLine event={event} />}
            </div>
            <div className="match-event__minute-col">
              <span className="match-event__minute">{event.minute}&apos;</span>
              <EventIcon type={event.type} />
            </div>
            <div className="match-event__side match-event__side--away">
              {!isHome && <EventLine event={event} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
