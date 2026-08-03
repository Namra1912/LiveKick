// LiveKick — Mock Data (Phase 0: frontend-only, no backend/API yet)
// Field names match LiveKick_PRD_FINAL_v5_1.md §5 (camelCase here for direct
// frontend use — your real API layer will map snake_case Postgres columns to
// this same shape when Phase 1 wires up the real backend).
//
// Crest/avatar URLs use ui-avatars.com / raw.githubusercontent — keyless
// placeholder service that generates initial badges or real team crests.

const photoSeed = (id, width, height) =>
  `https://picsum.photos/seed/${id}/${width}/${height}`;

const player = (name, bg = "00B370") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=128&bold=true&format=svg`;

// ---------------------------------------------------------------- teams ----
export const teams = [
  { id: 1, name: "Arsenal", shortName: "ARS", league: "Premier League", country: "England", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Arsenal%20FC.png", primaryColor: "#EF0107", secondaryColor: "#063672" },
  { id: 2, name: "Man City", shortName: "MCI", league: "Premier League", country: "England", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Manchester%20City.png", primaryColor: "#6CABDD", secondaryColor: "#1C2C5B" },
  { id: 3, name: "Liverpool", shortName: "LIV", league: "Premier League", country: "England", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Liverpool%20FC.png", primaryColor: "#C8102E", secondaryColor: "#00B2A9" },
  { id: 4, name: "Chelsea", shortName: "CHE", league: "Premier League", country: "England", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Chelsea%20FC.png", primaryColor: "#034694", secondaryColor: "#DBA111" },
  { id: 5, name: "Tottenham", shortName: "TOT", league: "Premier League", country: "England", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Tottenham%20Hotspur.png", primaryColor: "#132257", secondaryColor: "#FFFFFF" },
  { id: 6, name: "Man United", shortName: "MUN", league: "Premier League", country: "England", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Manchester%20United.png", primaryColor: "#DA291C", secondaryColor: "#FBE122" },
  { id: 7, name: "Real Madrid", shortName: "RMA", league: "La Liga", country: "Spain", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Real%20Madrid.png", primaryColor: "#FEBE10", secondaryColor: "#00529F" },
  { id: 8, name: "Atletico Madrid", shortName: "ATM", league: "La Liga", country: "Spain", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Atl%C3%A9tico%20de%20Madrid.png", primaryColor: "#CB3524", secondaryColor: "#272E61" },
  { id: 9, name: "Barcelona", shortName: "BAR", league: "La Liga", country: "Spain", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/FC%20Barcelona.png", primaryColor: "#004D98", secondaryColor: "#A50044" },
  { id: 10, name: "Real Betis", shortName: "BET", league: "La Liga", country: "Spain", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Real%20Betis%20Balompi%C3%A9.png", primaryColor: "#00954C", secondaryColor: "#FFFFFF" },
  { id: 11, name: "Borussia Dortmund", shortName: "BVB", league: "Champions League", country: "Germany", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/Borussia%20Dortmund.png", primaryColor: "#FDE100", secondaryColor: "#000000" },
  { id: 12, name: "Inter Milan", shortName: "INT", league: "Champions League", country: "Italy", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Inter%20Milan.png", primaryColor: "#0068A8", secondaryColor: "#000000" },
  { id: 13, name: "Bayern Munich", shortName: "BAY", league: "Bundesliga", country: "Germany", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/Bayern%20Munich.png", primaryColor: "#DC052D", secondaryColor: "#0066B2" },
  { id: 14, name: "RB Leipzig", shortName: "RBL", league: "Bundesliga", country: "Germany", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/RB%20Leipzig.png", primaryColor: "#DD013F", secondaryColor: "#0C2340" },
  { id: 15, name: "Juventus", shortName: "JUV", league: "Serie A", country: "Italy", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Juventus%20FC.png", primaryColor: "#e5e5e5", secondaryColor: "#000000" },
  { id: 16, name: "AC Milan", shortName: "ACM", league: "Serie A", country: "Italy", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/AC%20Milan.png", primaryColor: "#AC122A", secondaryColor: "#000000" },
];

// -------------------------------------------------------------- leagues ----
export const leagues = [
  { id: 1, name: "Premier League", slug: "pl", matchday: 29, country: "England" },
  { id: 2, name: "La Liga", slug: "laliga", matchday: 22, country: "Spain" },
  { id: 3, name: "Champions League", slug: "ucl", matchday: 6, country: "Europe" },
  { id: 4, name: "Bundesliga", slug: "bundesliga", matchday: 20, country: "Germany" },
  { id: 5, name: "Serie A", slug: "seriea", matchday: 23, country: "Italy" },
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
  {
    id: 107,
    homeTeam: t(13), awayTeam: t(14),
    homeScore: 3, awayScore: 1,
    status: "finished", minute: 90,
    pressureHome: 68, pressureAway: 32,
    matchDateUtc: "2026-07-31T18:30:00Z",
    league: "Bundesliga", venue: "Allianz Arena", referee: "Felix Brych",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 108,
    homeTeam: t(15), awayTeam: t(16),
    homeScore: 1, awayScore: 2,
    status: "finished", minute: 90,
    pressureHome: 45, pressureAway: 55,
    matchDateUtc: "2026-07-31T20:45:00Z",
    league: "Serie A", venue: "Allianz Stadium", referee: "Daniele Orsato",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 109,
    homeTeam: t(1), awayTeam: t(3),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: "2026-08-02T16:30:00Z",
    league: "Premier League", venue: "Emirates Stadium", referee: "Anthony Taylor",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 110,
    homeTeam: t(7), awayTeam: t(9),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: "2026-08-02T20:00:00Z",
    league: "La Liga", venue: "Santiago Bernabéu", referee: "Mateu Lahoz",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 111,
    homeTeam: t(13), awayTeam: t(11),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: "2026-08-05T18:30:00Z",
    league: "Bundesliga", venue: "Allianz Arena", referee: "Tobias Stieler",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 112,
    homeTeam: t(16), awayTeam: t(12),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: "2026-08-08T19:45:00Z",
    league: "Serie A", venue: "San Siro", referee: "Marco Guida",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 113,
    homeTeam: t(2), awayTeam: t(6),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: "2026-08-15T15:00:00Z",
    league: "Premier League", venue: "Etihad Stadium", referee: "Michael Oliver",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 114,
    homeTeam: t(4), awayTeam: t(5),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: "2026-08-22T17:30:00Z",
    league: "Premier League", venue: "Stamford Bridge", referee: "Paul Tierney",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 115,
    homeTeam: t(14), awayTeam: t(15),
    homeScore: 1, awayScore: 1,
    status: "live", minute: 62,
    pressureHome: 54, pressureAway: 46,
    matchDateUtc: "2026-08-02T19:00:00Z",
    league: "Champions League", venue: "Red Bull Arena", referee: "Szymon Marciniak",
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
    thumbnailUrl: photoSeed(301, 200, 150), source: "Analysis", publishedAt: "2026-08-01T17:00:00Z", category: "Analysis",
  },
  {
    id: 302, title: "Record-breaking transfer finalized for midfield prodigy",
    thumbnailUrl: photoSeed(302, 200, 150), source: "Transfers", publishedAt: "2026-08-01T15:00:00Z", category: "Transfers",
  },
  {
    id: 303, title: "Injury doubt clears ahead of crucial European qualifier",
    thumbnailUrl: photoSeed(303, 200, 150), source: "Team News", publishedAt: "2026-08-01T12:00:00Z", category: "Team News",
  },
  {
    id: 304, title: "Youth academy graduate handed shock first-team debut",
    thumbnailUrl: photoSeed(304, 200, 150), source: "Feature", publishedAt: "2026-08-01T09:00:00Z", category: "Feature",
  },
];

// -------------------------------------------------------- current user -----
export const currentUser = {
  id: 1, name: "Namra", email: "namra@example.com",
  matchdayCoins: 2450, lastLoginBonusDate: "2026-08-01",
  totalPredictions: 48, correctPredictions: 33,
  favoriteTeamIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
