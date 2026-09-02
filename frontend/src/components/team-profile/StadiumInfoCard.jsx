// src/components/team-profile/StadiumInfoCard.jsx
import { Building2 } from 'lucide-react';
import './StadiumInfoCard.css';

export default function StadiumInfoCard({ team }) {
  const venue = team?.stadium ?? 'Spotify Camp Nou';
  const location = team?.city ?? team?.country ?? 'Barcelona';

  // Format capacity with commas if numeric
  const rawCap = team?.capacity ?? '99,787';
  const capacityFormatted =
    typeof rawCap === 'number'
      ? rawCap.toLocaleString('en-US')
      : String(rawCap);

  const opened = team?.stadiumOpenedYear ?? '1957';
  const surface = team?.stadiumSurface ?? 'Grass';

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(venue)}`;

  return (
    <div className="stadium-info-card">
      <div className="stadium-info-card__header">
        <span className="stadium-info-card__title">Stadium</span>
      </div>

      <div className="stadium-info-card__venue-row">
        <Building2 size={18} className="stadium-info-card__icon" />
        <div className="stadium-info-card__venue-details">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="stadium-info-card__venue-link"
          >
            {venue}
          </a>
          <span className="stadium-info-card__location">{location}</span>
        </div>
      </div>

      <div className="stadium-info-card__divider" />

      <div className="stadium-info-card__stats-row">
        <div className="stadium-info-stat">
          <span className="stadium-info-stat__value">{capacityFormatted}</span>
          <span className="stadium-info-stat__label">CAPACITY</span>
        </div>

        <div className="stadium-info-stat">
          <span className="stadium-info-stat__value">{opened}</span>
          <span className="stadium-info-stat__label">OPENED</span>
        </div>

        <div className="stadium-info-stat">
          <span className="stadium-info-stat__value">{surface}</span>
          <span className="stadium-info-stat__label">SURFACE</span>
        </div>
      </div>
    </div>
  );
}
