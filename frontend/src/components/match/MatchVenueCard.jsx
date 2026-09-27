// src/components/match/MatchVenueCard.jsx
import { MapPin, Users, LayoutGrid } from 'lucide-react';
import { matchVenueInfo } from '../../data/mockData';
import './MatchVenueCard.css';

export default function MatchVenueCard({ match, homeTeam }) {
  // Only attach the home team's known stadium capacity/city when this
  // match's actual venue matches their home ground — some matches (cup
  // finals, stadium renovations) are played elsewhere, and showing the
  // wrong ground's capacity next to a different venue name would be wrong.
  const isHomeGround =
    match.venue && homeTeam?.stadium && match.venue.toLowerCase() === homeTeam.stadium.toLowerCase();
  const capacityStr = isHomeGround ? homeTeam?.capacity : null;
  const capacityNum = capacityStr ? Number(capacityStr.replace(/,/g, '')) : null;
  const city = isHomeGround ? homeTeam?.city : null;

  const venueInfo = matchVenueInfo[match.id];
  const attendancePct = venueInfo && capacityNum ? Math.round((venueInfo.attendance / capacityNum) * 100) : null;

  return (
    <div className="match-venue-card">
      <div className="match-venue-card__row">
        <MapPin size={16} strokeWidth={1.75} className="match-venue-card__icon" />
        <div>
          <p className="match-venue-card__venue">{match.venue ?? 'Venue TBC'}</p>
          {city && <p className="match-venue-card__city">{city}</p>}
        </div>
      </div>

      {capacityStr && (
        <div className="match-venue-card__row">
          <Users size={16} strokeWidth={1.75} className="match-venue-card__icon" />
          <div className="match-venue-card__stat-block">
            <span className="match-venue-card__label">Capacity</span>
            <span className="match-venue-card__value">{capacityStr}</span>
          </div>
        </div>
      )}

      {venueInfo && (
        <>
          <div className="match-venue-card__row">
            <Users size={16} strokeWidth={1.75} className="match-venue-card__icon" />
            <div className="match-venue-card__stat-block">
              <span className="match-venue-card__label">Attendance</span>
              <span className="match-venue-card__value">{venueInfo.attendance.toLocaleString()}</span>
            </div>
          </div>
          {attendancePct != null && (
            <div className="match-venue-card__pct-track">
              <span className="match-venue-card__pct-fill" style={{ width: `${attendancePct}%` }} />
              <span className="match-venue-card__pct-badge" style={{ left: `${attendancePct}%` }}>
                {attendancePct}%
              </span>
            </div>
          )}
          <div className="match-venue-card__row">
            <LayoutGrid size={16} strokeWidth={1.75} className="match-venue-card__icon" />
            <div className="match-venue-card__stat-block">
              <span className="match-venue-card__label">Surface</span>
              <span className="match-venue-card__value">{venueInfo.surface}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
