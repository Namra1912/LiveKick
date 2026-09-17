// src/components/shared/Flag.jsx
import { useState } from 'react';
import { nameToHue } from './Crest';
import './Flag.css';

const NATIONALITY_TO_ISO2 = {
  spain: 'es',
  spanish: 'es',
  germany: 'de',
  german: 'de',
  poland: 'pl',
  polish: 'pl',
  uruguay: 'uy',
  uruguayan: 'uy',
  denmark: 'dk',
  danish: 'dk',
  france: 'fr',
  french: 'fr',
  netherlands: 'nl',
  dutch: 'nl',
  brazil: 'br',
  brazilian: 'br',
  england: 'gb-eng',
  english: 'gb-eng',
  belgium: 'be',
  belgian: 'be',
  norway: 'no',
  norwegian: 'no',
  argentina: 'ar',
  argentinian: 'ar',
  portugal: 'pt',
  portuguese: 'pt',
  italy: 'it',
  italian: 'it',
  croatia: 'hr',
  croatian: 'hr',
  austria: 'at',
  austrian: 'at',
  switzerland: 'ch',
  swiss: 'ch',
  colombia: 'co',
  colombian: 'co',
  'united states': 'us',
  american: 'us',
  japan: 'jp',
  japanese: 'jp',
  'south korea': 'kr',
  korean: 'kr',
  senegal: 'sn',
  senegalese: 'sn',
  morocco: 'ma',
  moroccan: 'ma',
  nigeria: 'ng',
  nigerian: 'ng',
  'ivory coast': 'ci',
  ghana: 'gh',
  ghanaian: 'gh',
  cameroon: 'cm',
  cameroonian: 'cm',
  canada: 'ca',
  canadian: 'ca',
  mexico: 'mx',
  mexican: 'mx',
  turkey: 'tr',
  türkiye: 'tr',
  turkish: 'tr',
  sweden: 'se',
  swedish: 'se',
  serbia: 'rs',
  serbian: 'rs',
  ukraine: 'ua',
  ukrainian: 'ua',
  'czech republic': 'cz',
  czech: 'cz',
  slovakia: 'sk',
  slovak: 'sk',
  hungary: 'hu',
  hungarian: 'hu',
  greece: 'gr',
  greek: 'gr',
  scotland: 'gb-sct',
  scottish: 'gb-sct',
  wales: 'gb-wls',
  welsh: 'gb-wls',
  'northern ireland': 'gb-nir',
};

function resolveIso2(countryCode, nationality) {
  if (countryCode && countryCode.length <= 6) {
    return countryCode.toLowerCase();
  }
  if (nationality) {
    const key = nationality.trim().toLowerCase();
    if (NATIONALITY_TO_ISO2[key]) {
      return NATIONALITY_TO_ISO2[key];
    }
    if (key.length === 2) {
      return key;
    }
  }
  return null;
}

export default function Flag({ countryCode, nationality, size = 20, className = '' }) {
  const [failed, setFailed] = useState(false);

  const iso2 = resolveIso2(countryCode, nationality);
  const displayName = nationality || countryCode || 'Flag';
  const flagUrl = iso2 ? `https://flagcdn.com/w40/${iso2}.png` : null;

  const showImage = flagUrl && !failed;

  if (showImage) {
    return (
      <img
        src={flagUrl}
        alt={`${displayName} flag`}
        className={`flag flag--img ${className}`.trim()}
        style={{ width: size, height: Math.round(size * 0.7) }}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  // Fallback: deterministic HSL circle with 2-letter code
  const label = (iso2 || displayName.slice(0, 2)).toUpperCase();
  return (
    <div
      className={`flag flag--fallback ${className}`.trim()}
      style={{
        width: size,
        height: size,
        backgroundColor: `hsl(${nameToHue(displayName)}, 45%, 40%)`,
        fontSize: Math.max(9, Math.round(size * 0.45)),
      }}
      aria-label={`${displayName} flag`}
    >
      {label.slice(0, 2)}
    </div>
  );
}
