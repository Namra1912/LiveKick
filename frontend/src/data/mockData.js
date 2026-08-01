// LiveKick — Mock Data (Phase 0: frontend-only, no backend/API yet)
// Field names match LiveKick_PRD_FINAL_v5_1.md §5 (camelCase here for direct
// frontend use — your real API layer will map snake_case Postgres columns to
// this same shape when Phase 1 wires up the real backend).
//
// Crest/avatar URLs use ui-avatars.com — a free, keyless placeholder service
// that generates a colored initials badge. Swap these for real crestUrl /
// photoUrl values from football-data.org / TheSportsDB / the FotMob wrapper
// once real data sourcing is wired up (PRD §4a). Nothing else needs to change
// on the frontend side — same field name, just a different URL string.

const crest = (name, bg) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=64&bold=true&format=svg`;

const player = (name, bg) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=96&format=svg`;

// ---------------------------------------------------------------- teams ----
export const teams = [
  { id: 1, name: "Arsenal", shortName: "ARS", crestUrl: crest("ARS", "dc2626"), league: "Premier League", country: "England" },
  { id: 2, name: "Man City", shortName: "MCI", crestUrl: crest("MCI", "60a5fa"), league: "Premier League", country: "England" },
  { id: 3, name: "Liverpool", shortName: "LIV", crestUrl: crest("LIV", "b91c1c"), league: "Premier League", country: "England" },
  { id: 4, name: "Chelsea", shortName: "CHE", crestUrl: crest("CHE", "1d4ed8"), league: "Premier League", country: "England" },
  { id: 5, name: "Tottenham", shortName: "TOT", crestUrl: crest("TOT", "e5e7eb"), league: "Premier League", country: "England" },
  { id: 6, name: "Man United", shortName: "MUN", crestUrl: crest("MUN", "dc2626"), league: "Premier League", country: "England" },
  { id: 7, name: "Real Madrid", shortName: "RMA", crestUrl: crest("RMA", "e5e7eb"), league: "La Liga", country: "Spain" },
  { id: 8, name: "Atletico Madrid", shortName: "ATM", crestUrl: crest("ATM", "dc2626"), league: "La Liga", country: "Spain" },
  { id: 9, name: "Barcelona", shortName: "BAR", crestUrl: crest("BAR", "7c2d12"), league: "La Liga", country: "Spain" },
  { id: 10, name: "Real Betis", shortName: "BET", crestUrl: crest("BET", "166534"), league: "La Liga", country: "Spain" },
  { id: 11, name: "Borussia Dortmund", shortName: "BVB", crestUrl: crest("BVB", "f59e0b"), league: "Champions League", country: "Germany" },
  { id: 12, name: "Inter Milan", shortName: "INT", crestUrl: crest("INT", "0ea5e9"), league: "Champions League", country: "Italy" },
];

const t = (id) => teams.find((x) => x.id === id);

// -------------------------------------------------------------- matches ----
export const matches = [
  {
    id: 101,
    homeTeam: t(1), awayTeam: t(2),
    homeScore: 2, awayScore: 1,
    status: "live", minute: 74,
    pressureHome: 63, pressureAway: 37,
    matchDateUtc: "2026-08-01T19:00:00Z",
    league: "Premier League", venue: "Emirates Stadium", referee: "Michael Oliver",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 102,
    homeTeam: t(3), awayTeam: t(4),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: "2026-08-01T20:00:00Z",
    league: "Premier League", venue: "Anfield", referee: "Anthony Taylor",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 103,
    homeTeam: t(5), awayTeam: t(6),
    homeScore: 1, awayScore: 1,
    status: "finished", minute: 90,
    pressureHome: 55, pressureAway: 45,
    matchDateUtc: "2026-08-01T14:00:00Z",
    league: "Premier League", venue: "Tottenham Hotspur Stadium", referee: "Paul Tierney",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 104,
    homeTeam: t(7), awayTeam: t(8),
    homeScore: 0, awayScore: 0,
    status: "live", minute: 45,
    pressureHome: 58, pressureAway: 42,
    matchDateUtc: "2026-08-01T18:30:00Z",
    league: "La Liga", venue: "Santiago Bernabéu", referee: "Jesús Gil Manzano",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 105,
    homeTeam: t(9), awayTeam: t(10),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: "2026-08-01T21:00:00Z",
    league: "La Liga", venue: "Estadi Olímpic Lluís Companys", referee: "Ricardo de Burgos",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 106,
    homeTeam: t(11), awayTeam: t(12),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: "2026-08-01T20:00:00Z",
    league: "Champions League", venue: "Signal Iduna Park", referee: "Felix Zwayer",
    lastSynced: new Date().toISOString(),
  },
];

// ------------------------------------------------------------ standings ----
export const standings = {
  "Premier League": [
    { position: 1, team: t(2), played: 24, won: 18, drawn: 4, lost: 2, goalDifference: 41, points: 58, form: ["W", "W", "D", "W", "W"] },
    { position: 2, team: t(1), played: 24, won: 17, drawn: 5, lost: 2, goalDifference: 36, points: 56, form: ["W", "W", "W", "D", "W"] },
    { position: 3, team: t(3), played: 24, won: 16, drawn: 6, lost: 2, goalDifference: 33, points: 54, form: ["D", "W", "W", "W", "D"] },
    { position: 4, team: t(4), played: 24, won: 14, drawn: 5, lost: 5, goalDifference: 19, points: 47, form: ["L", "W", "W", "D", "W"] },
    { position: 5, team: t(6), played: 24, won: 12, drawn: 7, lost: 5, goalDifference: 11, points: 43, form: ["W", "D", "L", "W", "W"] },
    { position: 18, team: t(5), played: 24, won: 6, drawn: 6, lost: 12, goalDifference: -14, points: 24, form: ["L", "L", "D", "W", "L"] },
  ],
  "La Liga": [
    { position: 1, team: t(9), played: 22, won: 17, drawn: 3, lost: 2, goalDifference: 38, points: 54, form: ["W", "W", "W", "W", "D"] },
    { position: 2, team: t(7), played: 22, won: 16, drawn: 4, lost: 2, goalDifference: 34, points: 52, form: ["D", "W", "W", "W", "W"] },
    { position: 3, team: t(8), played: 22, won: 14, drawn: 5, lost: 3, goalDifference: 24, points: 47, form: ["W", "D", "W", "L", "W"] },
    { position: 15, team: t(10), played: 22, won: 7, drawn: 6, lost: 9, goalDifference: -6, points: 27, form: ["L", "D", "W", "L", "D"] },
  ],
};

// ------------------------------------------------------------ transfers ----
export const transfers = [
  {
    id: 201, player: "Alessandro Ricci", position: "CM", playerPhotoUrl: player("Alessandro Ricci", "334155"),
    fromTeam: t(11), toTeam: t(12), transferType: "permanent", fee: "€65M",
    tier: 1, sourceName: "Confirmed — Fabrizio Romano", transferDate: "2026-07-30", league: "Champions League",
  },
  {
    id: 202, player: "Jamie Osei", position: "ST", playerPhotoUrl: player("Jamie Osei", "334155"),
    fromTeam: t(6), toTeam: t(4), transferType: "loan", fee: "Loan", tier: 2,
    sourceName: "Sky Sports", transferDate: "2026-07-29", league: "Premier League",
  },
  {
    id: 203, player: "Théo Marchand", position: "CB", playerPhotoUrl: player("Theo Marchand", "334155"),
    fromTeam: t(9), toTeam: t(7), transferType: "permanent", fee: "€40M", tier: 1,
    sourceName: "Confirmed — Fabrizio Romano", transferDate: "2026-07-28", league: "La Liga",
  },
  {
    id: 204, player: "Kenji Watanabe", position: "RW", playerPhotoUrl: player("Kenji Watanabe", "334155"),
    fromTeam: t(2), toTeam: t(3), transferType: "permanent", fee: "€28M", tier: 3,
    sourceName: "Unconfirmed report", transferDate: "2026-07-27", league: "Premier League",
  },
  {
    id: 205, player: "Marco Bellini", position: "GK", playerPhotoUrl: player("Marco Bellini", "334155"),
    fromTeam: t(12), toTeam: t(11), transferType: "free", fee: "Free", tier: 2,
    sourceName: "The Athletic", transferDate: "2026-07-25", league: "Champions League",
  },
];

// -------------------------------------------------------------- news -------
export const news = [
  {
    id: 301, title: "Managerial shake-up imminent following disastrous derby defeat",
    thumbnailUrl: crest("News", "334155"), source: "Analysis", publishedAt: "2026-08-01T17:00:00Z", category: "Analysis",
  },
  {
    id: 302, title: "Record-breaking transfer finalized for midfield prodigy",
    thumbnailUrl: crest("News", "334155"), source: "Transfers", publishedAt: "2026-08-01T15:00:00Z", category: "Transfers",
  },
  {
    id: 303, title: "Injury doubt clears ahead of crucial European qualifier",
    thumbnailUrl: crest("News", "334155"), source: "Team News", publishedAt: "2026-08-01T12:00:00Z", category: "Team News",
  },
  {
    id: 304, title: "Youth academy graduate handed shock first-team debut",
    thumbnailUrl: crest("News", "334155"), source: "Feature", publishedAt: "2026-08-01T09:00:00Z", category: "Feature",
  },
];

// -------------------------------------------------------- current user -----
export const currentUser = {
  id: 1, name: "Namra", email: "namra@example.com",
  matchdayCoins: 2450, lastLoginBonusDate: "2026-08-01",
  totalPredictions: 48, correctPredictions: 33,
  favoriteTeamIds: [1, 7, 9],
};

// ------------------------------------------------------ predictor cards ----
export const predictorMatches = [
  { matchId: 102, homeTeam: t(3), awayTeam: t(4), lockAt: "2026-08-01T20:00:00Z", userPick: null },
  { matchId: 105, homeTeam: t(9), awayTeam: t(10), lockAt: "2026-08-01T21:00:00Z", userPick: "home" },
];

export const coinRewardRules = {
  exactScore: 500,
  correctResult: 150,
  wrongPrediction: -100,
  dailyLoginBonus: 200,
  signupStarterPack: 1000,
};

// ---------------------------------------------------------- leaderboard ----
export const globalLeaderboard = [
  { rank: 1, username: "Alex", avatarUrl: player("Alex", "0ea5e9"), coins: 8400 },
  { rank: 2, username: "You", avatarUrl: player("Namra", "00B370"), coins: 2450, isCurrentUser: true },
  { rank: 3, username: "Sam", avatarUrl: player("Sam", "f59e0b"), coins: 2100 },
  { rank: 4, username: "Priya", avatarUrl: player("Priya", "dc2626"), coins: 1980 },
  { rank: 5, username: "Leo", avatarUrl: player("Leo", "7c2d12"), coins: 1750 },
];

// ----------------------------------------------------- tactics lab ---------
export const savedFormations = [
  {
    id: 401, userId: 1, label: "Arsenal High Press", formationTemplate: "4-3-3", isShared: false,
    slots: [
      { playerName: "Raya", position: "GK", x: 0.5, y: 0.95 },
      { playerName: "White", position: "DEF", x: 0.82, y: 0.78 },
      { playerName: "Saliba", position: "DEF", x: 0.62, y: 0.82 },
      { playerName: "Gabriel", position: "DEF", x: 0.38, y: 0.82 },
      { playerName: "Timber", position: "DEF", x: 0.18, y: 0.78 },
      { playerName: "Rice", position: "MID", x: 0.5, y: 0.6 },
      { playerName: "Ødegaard", position: "MID", x: 0.68, y: 0.5 },
      { playerName: "Merino", position: "MID", x: 0.32, y: 0.5 },
      { playerName: "Saka", position: "FWD", x: 0.82, y: 0.25 },
      { playerName: "Havertz", position: "FWD", x: 0.5, y: 0.15 },
      { playerName: "Martinelli", position: "FWD", x: 0.18, y: 0.25 },
    ],
  },
];
