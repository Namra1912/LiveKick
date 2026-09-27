// src/components/match/MatchVenueCard.jsx
import { MapPin, Users, Gavel } from 'lucide-react';
import './MatchVenueCard.css';

export default function MatchVenueCard({ match, homeTeam }) {
  // Only attach the home team's known stadium capacity/city when this
  // match's actual venue matches their home ground — some matches (cup
  // finals, stadium renovations) are played elsewhere, and showing the
  // wrong ground's capacity next to a different venue name would be wrong.
  const isHomeGround =
    match.venue && homeTeam?.stadium && match.venue.toLowerCase() === homeTeam.stadium.toLowerCase();
  const capacity = isHomeGround ? homeTeam?.capacity : null;
  const city = isHomeGround ? homeTeam?.city : null;

  return (
    <div className="match-venue-card">
      <div className="match-venue-card__row">
        <MapPin size={16} strokeWidth={1.75} className="match-venue-card__icon" />
        <div>
          <p className="match-venue-card__venue">{match.venue ?? 'Venue TBC'}</p>
          {city && <p className="match-venue-card__city">{city}</p>}
        </div>
      </div>

      {capacity && (
        <div className="match-venue-card__row">
          <Users size={16} strokeWidth={1.75} className="match-venue-card__icon" />
          <div>
            <p className="match-venue-card__label">Capacity</p>
            <p className="match-venue-card__value">{capacity}</p>
          </div>
        </div>
      )}

      {match.referee && (
        <div className="match-venue-card__row">
          <Gavel size={16} strokeWidth={1.75} className="match-venue-card__icon" />
          <div>
            <p className="match-venue-card__label">Referee</p>
            <p className="match-venue-card__value">{match.referee}</p>
          </div>
        </div>
      )}
    </div>
  );
}
