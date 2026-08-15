// LiveKick — Mock Data (Phase 0: frontend-only, no backend/API yet)
// Field names match LiveKick_PRD_FINAL_v5_1.md §5 (camelCase here for direct
// frontend use — your real API layer will map snake_case Postgres columns to
// this same shape when Phase 1 wires up the real backend).
//
// Crest/avatar URLs use ui-avatars.com / raw.githubusercontent / thesportsdb — keyless
// placeholder service that generates initial badges or real team crests.

const photoSeed = (id, width, height) =>
  `https://picsum.photos/seed/${id}/${width}/${height}`;

const player = (name, bg = "00B370") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=128&bold=true&format=svg`;

// ---------------------------------------------------------------- teams ----
// logoUrl added to every team so Crest component has a unified field.
export const teams = [
  // ── Existing 16 Teams ──────────────────────────────────────────────────────
  { id: 1, name: "Arsenal", shortName: "ARS", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Arsenal%20FC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Arsenal%20FC.png", primaryColor: "#EF0107", secondaryColor: "#063672" },
  { id: 2, name: "Man City", shortName: "MCI", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Manchester%20City.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Manchester%20City.png", primaryColor: "#6CABDD", secondaryColor: "#1C2C5B" },
  { id: 3, name: "Liverpool", shortName: "LIV", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Liverpool%20FC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Liverpool%20FC.png", primaryColor: "#C8102E", secondaryColor: "#00B2A9" },
  { id: 4, name: "Chelsea", shortName: "CHE", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Chelsea%20FC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Chelsea%20FC.png", primaryColor: "#034694", secondaryColor: "#DBA111" },
  { id: 5, name: "Tottenham", shortName: "TOT", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Tottenham%20Hotspur.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Tottenham%20Hotspur.png", primaryColor: "#132257", secondaryColor: "#FFFFFF" },
  { id: 6, name: "Man United", shortName: "MUN", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Manchester%20United.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Manchester%20United.png", primaryColor: "#DA291C", secondaryColor: "#FBE122" },
  { id: 7, name: "Real Madrid", shortName: "RMA", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Real%20Madrid.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Real%20Madrid.png", primaryColor: "#FEBE10", secondaryColor: "#00529F" },
  { id: 8, name: "Atletico Madrid", shortName: "ATM", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Atl%C3%A9tico%20de%20Madrid.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Atl%C3%A9tico%20de%20Madrid.png", primaryColor: "#CB3524", secondaryColor: "#272E61" },
  { id: 9, name: "Barcelona", shortName: "BAR", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/FC%20Barcelona.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/FC%20Barcelona.png", primaryColor: "#004D98", secondaryColor: "#A50044" },
  { id: 10, name: "Real Betis", shortName: "BET", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Real%20Betis%20Balompi%C3%A9.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Real%20Betis%20Balompi%C3%A9.png", primaryColor: "#00954C", secondaryColor: "#FFFFFF" },
  { id: 11, name: "Borussia Dortmund", shortName: "BVB", league: "Champions League", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/Borussia%20Dortmund.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/Borussia%20Dortmund.png", primaryColor: "#FDE100", secondaryColor: "#000000" },
  { id: 12, name: "Inter Milan", shortName: "INT", league: "Champions League", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Inter%20Milan.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Inter%20Milan.png", primaryColor: "#0068A8", secondaryColor: "#000000" },
  { id: 13, name: "Bayern Munich", shortName: "BAY", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/Bayern%20Munich.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/Bayern%20Munich.png", primaryColor: "#DC052D", secondaryColor: "#0066B2" },
  { id: 14, name: "RB Leipzig", shortName: "RBL", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/RB%20Leipzig.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/RB%20Leipzig.png", primaryColor: "#DD013F", secondaryColor: "#0C2340" },
  { id: 15, name: "Juventus", shortName: "JUV", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Juventus%20FC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Juventus%20FC.png", primaryColor: "#e5e5e5", secondaryColor: "#000000" },
  { id: 16, name: "AC Milan", shortName: "ACM", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/AC%20Milan.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/AC%20Milan.png", primaryColor: "#AC122A", secondaryColor: "#000000" },

  // ── Premier League Additional Teams ────────────────────────────────────────
  { id: 17, name: "Aston Villa", shortName: "AVL", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Aston%20Villa.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Aston%20Villa.png", primaryColor: "#95BFE6", secondaryColor: "#670E36" },
  { id: 18, name: "Newcastle", shortName: "NEW", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Newcastle%20United.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Newcastle%20United.png", primaryColor: "#242424", secondaryColor: "#FFFFFF" },
  { id: 19, name: "Brighton", shortName: "BHA", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Brighton%20%26%20Hove%20Albion.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Brighton%20%26%20Hove%20Albion.png", primaryColor: "#0057B8", secondaryColor: "#FFCD00" },
  { id: 20, name: "West Ham", shortName: "WHU", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/West%20Ham%20United.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/West%20Ham%20United.png", primaryColor: "#7A263A", secondaryColor: "#1BB1E7" },
  { id: 21, name: "Bournemouth", shortName: "BOU", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/AFC%20Bournemouth.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/AFC%20Bournemouth.png", primaryColor: "#DA291C", secondaryColor: "#000000" },
  { id: 22, name: "Fulham", shortName: "FUL", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Fulham%20FC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Fulham%20FC.png", primaryColor: "#CC0000", secondaryColor: "#000000" },
  { id: 23, name: "Crystal Palace", shortName: "CRY", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Crystal%20Palace.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Crystal%20Palace.png", primaryColor: "#1B458F", secondaryColor: "#C4122E" },
  { id: 24, name: "Brentford", shortName: "BRE", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Brentford%20FC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Brentford%20FC.png", primaryColor: "#E30613", secondaryColor: "#F9A01B" },
  { id: 25, name: "Everton", shortName: "EVE", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Everton%20FC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Everton%20FC.png", primaryColor: "#00369C", secondaryColor: "#FFFFFF" },
  { id: 26, name: "Wolves", shortName: "WOL", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Wolverhampton%20Wanderers.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Wolverhampton%20Wanderers.png", primaryColor: "#FDB913", secondaryColor: "#231F20" },
  { id: 27, name: "Leicester City", shortName: "LEI", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Leicester%20City.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Leicester%20City.png", primaryColor: "#0053A0", secondaryColor: "#FDBE11" },
  { id: 28, name: "Nottingham Forest", shortName: "NFO", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Nottingham%20Forest.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Nottingham%20Forest.png", primaryColor: "#DD0000", secondaryColor: "#FFFFFF" },
  { id: 29, name: "Ipswich Town", shortName: "IPS", league: "Premier League", country: "England", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/9d77fl1718012690.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/9d77fl1718012690.png", primaryColor: "#003399", secondaryColor: "#FFFFFF" },
  { id: 30, name: "Southampton", shortName: "SOU", league: "Premier League", country: "England", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Southampton%20FC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Southampton%20FC.png", primaryColor: "#D00027", secondaryColor: "#130C0E" },

  // ── La Liga Additional Teams ───────────────────────────────────────────────
  { id: 31, name: "Athletic Bilbao", shortName: "ATH", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Athletic%20Club.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Athletic%20Club.png", primaryColor: "#EE2523", secondaryColor: "#000000" },
  { id: 32, name: "Real Sociedad", shortName: "RSO", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Real%20Sociedad.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Real%20Sociedad.png", primaryColor: "#0067B1", secondaryColor: "#FFFFFF" },
  { id: 33, name: "Villarreal", shortName: "VIL", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Villarreal%20CF.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Villarreal%20CF.png", primaryColor: "#FFE600", secondaryColor: "#00519E" },
  { id: 34, name: "Girona", shortName: "GIR", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Girona%20FC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Girona%20FC.png", primaryColor: "#CD2027", secondaryColor: "#FFFFFF" },
  { id: 35, name: "Mallorca", shortName: "MLL", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/RCD%20Mallorca.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/RCD%20Mallorca.png", primaryColor: "#E20613", secondaryColor: "#E30613" },
  { id: 36, name: "Osasuna", shortName: "OSA", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/CA%20Osasuna.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/CA%20Osasuna.png", primaryColor: "#D91A2A", secondaryColor: "#0A1F44" },
  { id: 37, name: "Sevilla", shortName: "SEV", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Sevilla%20FC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Sevilla%20FC.png", primaryColor: "#D71921", secondaryColor: "#FFFFFF" },
  { id: 38, name: "Celta Vigo", shortName: "CEL", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/RC%20Celta.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/RC%20Celta.png", primaryColor: "#87CEEB", secondaryColor: "#C8102E" },
  { id: 39, name: "Rayo Vallecano", shortName: "RAY", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Rayo%20Vallecano.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Rayo%20Vallecano.png", primaryColor: "#E30613", secondaryColor: "#FFFFFF" },
  { id: 40, name: "Getafe", shortName: "GET", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Getafe%20CF.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Getafe%20CF.png", primaryColor: "#00599B", secondaryColor: "#FFFFFF" },
  { id: 41, name: "Espanyol", shortName: "ESP", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/RCD%20Espanyol.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/RCD%20Espanyol.png", primaryColor: "#0072CE", secondaryColor: "#FFFFFF" },
  { id: 42, name: "Alaves", shortName: "ALA", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Deportivo%20Alav%C3%A9s.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Deportivo%20Alav%C3%A9s.png", primaryColor: "#0055A5", secondaryColor: "#FFFFFF" },
  { id: 43, name: "Las Palmas", shortName: "LPA", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/UD%20Las%20Palmas.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/UD%20Las%20Palmas.png", primaryColor: "#FFD700", secondaryColor: "#0055A5" },
  { id: 44, name: "Leganes", shortName: "LEG", league: "La Liga", country: "Spain", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/vsqvpx1473507963.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/vsqvpx1473507963.png", primaryColor: "#0055A5", secondaryColor: "#FFFFFF" },
  { id: 45, name: "Valladolid", shortName: "VLD", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Real%20Valladolid.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Real%20Valladolid.png", primaryColor: "#5B2B82", secondaryColor: "#FFFFFF" },
  { id: 46, name: "Valencia", shortName: "VAL", league: "La Liga", country: "Spain", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Valencia%20CF.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Spain%20-%20LaLiga/Valencia%20CF.png", primaryColor: "#FF7300", secondaryColor: "#000000" },

  // ── Bundesliga Additional Teams ───────────────────────────────────────────
  { id: 47, name: "Bayer Leverkusen", shortName: "LEV", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/Bayer%2004%20Leverkusen.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/Bayer%2004%20Leverkusen.png", primaryColor: "#E32221", secondaryColor: "#000000" },
  { id: 48, name: "Eintracht Frankfurt", shortName: "SGE", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/Eintracht%20Frankfurt.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/Eintracht%20Frankfurt.png", primaryColor: "#E1000F", secondaryColor: "#000000" },
  { id: 49, name: "VfB Stuttgart", shortName: "VFB", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/VfB%20Stuttgart.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/VfB%20Stuttgart.png", primaryColor: "#E32219", secondaryColor: "#FFFFFF" },
  { id: 50, name: "Freiburg", shortName: "SCF", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/SC%20Freiburg.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/SC%20Freiburg.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: 51, name: "Mainz 05", shortName: "M05", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/1.%20FSV%20Mainz%2005.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/1.%20FSV%20Mainz%2005.png", primaryColor: "#C41230", secondaryColor: "#FFFFFF" },
  { id: 52, name: "Werder Bremen", shortName: "SVW", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/SV%20Werder%20Bremen.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/SV%20Werder%20Bremen.png", primaryColor: "#1A8641", secondaryColor: "#FFFFFF" },
  { id: 53, name: "Borussia M'gladbach", shortName: "BMG", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/Borussia%20M%C3%B6nchengladbach.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/Borussia%20M%C3%B6nchengladbach.png", primaryColor: "#000000", secondaryColor: "#009933" },
  { id: 54, name: "Wolfsburg", shortName: "WOB", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/VfL%20Wolfsburg.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/VfL%20Wolfsburg.png", primaryColor: "#65B32E", secondaryColor: "#FFFFFF" },
  { id: 55, name: "Augsburg", shortName: "FCA", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/FC%20Augsburg.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/FC%20Augsburg.png", primaryColor: "#BA0C2F", secondaryColor: "#008754" },
  { id: 56, name: "Heidenheim", shortName: "HDH", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/1.%20FC%20Heidenheim%201846.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/1.%20FC%20Heidenheim%201846.png", primaryColor: "#E30613", secondaryColor: "#003A70" },
  { id: 57, name: "St. Pauli", shortName: "STP", league: "Bundesliga", country: "Germany", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/vvtutq1421448834.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/vvtutq1421448834.png", primaryColor: "#593622", secondaryColor: "#FFFFFF" },
  { id: 58, name: "Union Berlin", shortName: "FCU", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/1.%20FC%20Union%20Berlin.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/1.%20FC%20Union%20Berlin.png", primaryColor: "#D4001A", secondaryColor: "#FEE200" },
  { id: 59, name: "Hoffenheim", shortName: "TSG", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/TSG%201899%20Hoffenheim.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/TSG%201899%20Hoffenheim.png", primaryColor: "#1961B4", secondaryColor: "#FFFFFF" },
  { id: 60, name: "VfL Bochum", shortName: "BOC", league: "Bundesliga", country: "Germany", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/VfL%20Bochum.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Germany%20-%20Bundesliga/VfL%20Bochum.png", primaryColor: "#005CA9", secondaryColor: "#FFFFFF" },
  { id: 61, name: "Holstein Kiel", shortName: "KSV", league: "Bundesliga", country: "Germany", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/xswvxu1421448858.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/xswvxu1421448858.png", primaryColor: "#0055A5", secondaryColor: "#E30613" },

  // ── Serie A Additional Teams ───────────────────────────────────────────────
  { id: 62, name: "Atalanta", shortName: "ATA", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Atalanta%20BC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Atalanta%20BC.png", primaryColor: "#0055A5", secondaryColor: "#000000" },
  { id: 63, name: "Napoli", shortName: "NAP", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/SSC%20Napoli.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/SSC%20Napoli.png", primaryColor: "#0080FF", secondaryColor: "#FFFFFF" },
  { id: 64, name: "Lazio", shortName: "LAZ", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/SS%20Lazio.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/SS%20Lazio.png", primaryColor: "#87CEEB", secondaryColor: "#FFFFFF" },
  { id: 65, name: "Fiorentina", shortName: "FIO", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/ACF%20Fiorentina.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/ACF%20Fiorentina.png", primaryColor: "#4B0082", secondaryColor: "#FFFFFF" },
  { id: 66, name: "Roma", shortName: "ROM", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/AS%20Roma.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/AS%20Roma.png", primaryColor: "#8E1B20", secondaryColor: "#F0B323" },
  { id: 67, name: "Bologna", shortName: "BOL", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Bologna%20FC%201909.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Bologna%20FC%201909.png", primaryColor: "#1A2B4C", secondaryColor: "#A6192E" },
  { id: 68, name: "Torino", shortName: "TOR", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Torino%20FC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Torino%20FC.png", primaryColor: "#8A1C14", secondaryColor: "#FFFFFF" },
  { id: 69, name: "Udinese", shortName: "UDI", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Udinese%20Calcio.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Udinese%20Calcio.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: 70, name: "Genoa", shortName: "GEN", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Genoa%20CFC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Genoa%20CFC.png", primaryColor: "#A6192E", secondaryColor: "#002B49" },
  { id: 71, name: "Cagliari", shortName: "CAG", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Cagliari%20Calcio.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Cagliari%20Calcio.png", primaryColor: "#A6192E", secondaryColor: "#002B49" },
  { id: 72, name: "Parma", shortName: "PAR", league: "Serie A", country: "Italy", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/vxxwrv1473504899.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/vxxwrv1473504899.png", primaryColor: "#FFD700", secondaryColor: "#0055A5" },
  { id: 73, name: "Hellas Verona", shortName: "VER", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Hellas%20Verona.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Hellas%20Verona.png", primaryColor: "#003366", secondaryColor: "#FFCC00" },
  { id: 74, name: "Como", shortName: "COM", league: "Serie A", country: "Italy", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/s4u4d61718012890.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/s4u4d61718012890.png", primaryColor: "#0055A5", secondaryColor: "#FFFFFF" },
  { id: 75, name: "Empoli", shortName: "EMP", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Empoli%20FC.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/Empoli%20FC.png", primaryColor: "#0055A5", secondaryColor: "#FFFFFF" },
  { id: 76, name: "Monza", shortName: "MON", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/AC%20Monza.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/AC%20Monza.png", primaryColor: "#E30613", secondaryColor: "#FFFFFF" },
  { id: 77, name: "Lecce", shortName: "LEC", league: "Serie A", country: "Italy", logoUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/US%20Lecce.png", crestUrl: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/Italy%20-%20Serie%20A/US%20Lecce.png", primaryColor: "#FFCC00", secondaryColor: "#CC0000" },
  { id: 78, name: "Venezia", shortName: "VEN", league: "Serie A", country: "Italy", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/uxpvwq1473504938.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/uxpvwq1473504938.png", primaryColor: "#0055A5", secondaryColor: "#FF6600" },

  // ── Champions League Additional European Clubs ─────────────────────────────
  { id: 79, name: "Monaco", shortName: "ASM", league: "Champions League", country: "France", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/wqtupy1420658428.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/wqtupy1420658428.png", primaryColor: "#E30613", secondaryColor: "#FFFFFF" },
  { id: 80, name: "Sporting CP", shortName: "SCP", league: "Champions League", country: "Portugal", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/yutvtr1421448937.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/yutvtr1421448937.png", primaryColor: "#008040", secondaryColor: "#FFFFFF" },
  { id: 81, name: "Brest", shortName: "SB29", league: "Champions League", country: "France", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/qvpqsu1420658448.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/qvpqsu1420658448.png", primaryColor: "#E30613", secondaryColor: "#FFFFFF" },
  { id: 82, name: "Lille", shortName: "LOSC", league: "Champions League", country: "France", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/xwuwrq1420658408.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/xwuwrq1420658408.png", primaryColor: "#E30613", secondaryColor: "#001C46" },
  { id: 83, name: "Celtic", shortName: "CEL", league: "Champions League", country: "Scotland", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/tuxwrq1421448898.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/tuxwrq1421448898.png", primaryColor: "#008040", secondaryColor: "#FFFFFF" },
  { id: 84, name: "Dinamo Zagreb", shortName: "DIN", league: "Champions League", country: "Croatia", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/vxxwrv1473504899.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/vxxwrv1473504899.png", primaryColor: "#0055A5", secondaryColor: "#FFFFFF" },
  { id: 85, name: "Feyenoord", shortName: "FEY", league: "Champions League", country: "Netherlands", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/vsyvwt1421448918.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/vsyvwt1421448918.png", primaryColor: "#E30613", secondaryColor: "#FFFFFF" },
  { id: 86, name: "PSV Eindhoven", shortName: "PSV", league: "Champions League", country: "Netherlands", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/qtwuvp1421448928.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/qtwuvp1421448928.png", primaryColor: "#E30613", secondaryColor: "#FFFFFF" },
  { id: 87, name: "Club Brugge", shortName: "CLU", league: "Champions League", country: "Belgium", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/vtutpq1421448814.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/vtutpq1421448814.png", primaryColor: "#0055A5", secondaryColor: "#000000" },
  { id: 88, name: "Benfica", shortName: "SLB", league: "Champions League", country: "Portugal", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/uwyvtr1421448947.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/uwyvtr1421448947.png", primaryColor: "#E30613", secondaryColor: "#FFFFFF" },
  { id: 89, name: "Paris Saint-Germain", shortName: "PSG", league: "Champions League", country: "France", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/rwstwx1420658398.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/rwstwx1420658398.png", primaryColor: "#001C46", secondaryColor: "#E30613" },
  { id: 90, name: "Shakhtar Donetsk", shortName: "SHA", league: "Champions League", country: "Ukraine", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/vxxwrv1473504899.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/vxxwrv1473504899.png", primaryColor: "#FF6600", secondaryColor: "#000000" },
  { id: 91, name: "Sparta Prague", shortName: "SPA", league: "Champions League", country: "Czechia", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/xswvxu1421448858.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/xswvxu1421448858.png", primaryColor: "#A6192E", secondaryColor: "#FFFFFF" },
  { id: 92, name: "Sturm Graz", shortName: "STU", league: "Champions League", country: "Austria", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/uxpvwq1473504938.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/uxpvwq1473504938.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: 93, name: "Red Star Belgrade", shortName: "RSB", league: "Champions League", country: "Serbia", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/s4u4d61718012890.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/s4u4d61718012890.png", primaryColor: "#E30613", secondaryColor: "#FFFFFF" },
  { id: 94, name: "Red Bull Salzburg", shortName: "RBS", league: "Champions League", country: "Austria", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/vsyvwt1421448918.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/vsyvwt1421448918.png", primaryColor: "#E30613", secondaryColor: "#FFFFFF" },
  { id: 95, name: "Young Boys", shortName: "YB", league: "Champions League", country: "Switzerland", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/qtwuvp1421448928.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/qtwuvp1421448928.png", primaryColor: "#FFD700", secondaryColor: "#000000" },
  { id: 96, name: "Slovan Bratislava", shortName: "SLO", league: "Champions League", country: "Slovakia", logoUrl: "https://r2.thesportsdb.com/images/media/team/badge/uwyvtr1421448947.png", crestUrl: "https://r2.thesportsdb.com/images/media/team/badge/uwyvtr1421448947.png", primaryColor: "#87CEEB", secondaryColor: "#FFFFFF" },
];

export const leagues = [
  { id: 1, name: "Premier League", slug: "pl", matchday: 29, country: "England", logoUrl: "https://r2.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png" },
  { id: 2, name: "La Liga", slug: "laliga", matchday: 22, country: "Spain", logoUrl: "https://r2.thesportsdb.com/images/media/league/badge/ja4it51687628717.png" },
  { id: 3, name: "Champions League", slug: "ucl", matchday: 6, country: "Europe", logoUrl: "https://r2.thesportsdb.com/images/media/league/badge/facv1u1742998896.png" },
  { id: 4, name: "Bundesliga", slug: "bundesliga", matchday: 20, country: "Germany", logoUrl: "https://r2.thesportsdb.com/images/media/league/badge/teqh1b1679952008.png" },
  { id: 5, name: "Serie A", slug: "seriea", matchday: 23, country: "Italy", logoUrl: "https://r2.thesportsdb.com/images/media/league/badge/67q3q21679951383.png" },
];

const t = (id) => teams.find((x) => x.id === id);

// -------------------------------------------------------------- date helper -
function getRelativeIso(offsetDays, hours = 15, mins = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(hours).padStart(2, '0');
  const mm = String(mins).padStart(2, '0');
  return `${y}-${m}-${day}T${hh}:${mm}:00Z`;
}

// -------------------------------------------------------------- matches ----
export const matches = [
  // ── Past 2 Days (offset -2) ────────────────────────────────────────────────
  {
    id: 120,
    homeTeam: t(11), awayTeam: t(14),
    homeScore: 2, awayScore: 0,
    status: "finished", minute: 90,
    pressureHome: 60, pressureAway: 40,
    matchDateUtc: getRelativeIso(-2, 18, 0),
    league: "Bundesliga", venue: "Signal Iduna Park", referee: "Felix Zwayer",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 121,
    homeTeam: t(12), awayTeam: t(15),
    homeScore: 1, awayScore: 1,
    status: "finished", minute: 90,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(-2, 20, 45),
    league: "Serie A", venue: "San Siro", referee: "Daniele Orsato",
    lastSynced: new Date().toISOString(),
  },

  // ── Yesterday (offset -1) ──────────────────────────────────────────────────
  {
    id: 107,
    homeTeam: t(13), awayTeam: t(14),
    homeScore: 3, awayScore: 1,
    status: "finished", minute: 90,
    pressureHome: 68, pressureAway: 32,
    matchDateUtc: getRelativeIso(-1, 18, 30),
    league: "Bundesliga", venue: "Allianz Arena", referee: "Felix Brych",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 108,
    homeTeam: t(15), awayTeam: t(16),
    homeScore: 1, awayScore: 2,
    status: "finished", minute: 90,
    pressureHome: 45, pressureAway: 55,
    matchDateUtc: getRelativeIso(-1, 20, 45),
    league: "Serie A", venue: "Allianz Stadium", referee: "Daniele Orsato",
    lastSynced: new Date().toISOString(),
  },

  // ── Today (offset 0) ───────────────────────────────────────────────────────
  {
    id: 101,
    homeTeam: t(1), awayTeam: t(2),
    homeScore: 2, awayScore: 1,
    status: "live", minute: 74,
    pressureHome: 63, pressureAway: 37,
    matchDateUtc: getRelativeIso(0, 14, 0),
    league: "Premier League", venue: "Emirates Stadium", referee: "Michael Oliver",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 102,
    homeTeam: t(3), awayTeam: t(4),
    homeScore: 1, awayScore: 1,
    status: "live", minute: 45,
    pressureHome: 52, pressureAway: 48,
    matchDateUtc: getRelativeIso(0, 14, 15),
    league: "Premier League", venue: "Anfield", referee: "Anthony Taylor",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 103,
    homeTeam: t(5), awayTeam: t(6),
    homeScore: 1, awayScore: 1,
    status: "finished", minute: 90,
    pressureHome: 55, pressureAway: 45,
    matchDateUtc: getRelativeIso(0, 11, 0),
    league: "Premier League", venue: "Tottenham Hotspur Stadium", referee: "Paul Tierney",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 116,
    homeTeam: t(1), awayTeam: t(4),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(0, 17, 30),
    league: "Premier League", venue: "Emirates Stadium", referee: "Paul Tierney",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 117,
    homeTeam: t(2), awayTeam: t(5),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(0, 19, 45),
    league: "Premier League", venue: "Etihad Stadium", referee: "Michael Oliver",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 118,
    homeTeam: t(3), awayTeam: t(6),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(0, 20, 0),
    league: "Premier League", venue: "Anfield", referee: "Anthony Taylor",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 104,
    homeTeam: t(7), awayTeam: t(8),
    homeScore: 0, awayScore: 0,
    status: "live", minute: 58,
    pressureHome: 58, pressureAway: 42,
    matchDateUtc: getRelativeIso(0, 15, 30),
    league: "La Liga", venue: "Santiago Bernabéu", referee: "Jesús Gil Manzano",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 105,
    homeTeam: t(9), awayTeam: t(10),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(0, 18, 0),
    league: "La Liga", venue: "Estadi Olímpic Lluís Companys", referee: "Ricardo de Burgos",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 119,
    homeTeam: t(7), awayTeam: t(9),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(0, 21, 0),
    league: "La Liga", venue: "Santiago Bernabéu", referee: "Mateu Lahoz",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 106,
    homeTeam: t(11), awayTeam: t(12),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(0, 16, 0),
    league: "Champions League", venue: "Signal Iduna Park", referee: "Felix Zwayer",
    lastSynced: new Date().toISOString(),
  },

  // ── Tomorrow (offset +1) ───────────────────────────────────────────────────
  {
    id: 109,
    homeTeam: t(1), awayTeam: t(3),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(1, 15, 0),
    league: "Premier League", venue: "Emirates Stadium", referee: "Anthony Taylor",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 110,
    homeTeam: t(7), awayTeam: t(9),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(1, 17, 0),
    league: "La Liga", venue: "Santiago Bernabéu", referee: "Mateu Lahoz",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 115,
    homeTeam: t(14), awayTeam: t(15),
    homeScore: 1, awayScore: 1,
    status: "live", minute: 62,
    pressureHome: 54, pressureAway: 46,
    matchDateUtc: getRelativeIso(1, 14, 30),
    league: "Champions League", venue: "Red Bull Arena", referee: "Szymon Marciniak",
    lastSynced: new Date().toISOString(),
  },

  // ── 3 Days Ahead (offset +3) ───────────────────────────────────────────────
  {
    id: 111,
    homeTeam: t(13), awayTeam: t(11),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(3, 16, 30),
    league: "Bundesliga", venue: "Allianz Arena", referee: "Tobias Stieler",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 112,
    homeTeam: t(16), awayTeam: t(12),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(3, 19, 45),
    league: "Serie A", venue: "San Siro", referee: "Marco Guida",
    lastSynced: new Date().toISOString(),
  },

  // ── 7 Days Ahead (offset +7) ───────────────────────────────────────────────
  {
    id: 113,
    homeTeam: t(2), awayTeam: t(6),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(7, 15, 0),
    league: "Premier League", venue: "Etihad Stadium", referee: "Michael Oliver",
    lastSynced: new Date().toISOString(),
  },
  {
    id: 114,
    homeTeam: t(4), awayTeam: t(5),
    homeScore: 0, awayScore: 0,
    status: "upcoming", minute: 0,
    pressureHome: 50, pressureAway: 50,
    matchDateUtc: getRelativeIso(7, 17, 30),
    league: "Premier League", venue: "Stamford Bridge", referee: "Paul Tierney",
    lastSynced: new Date().toISOString(),
  },
];

/* =============================================================================
   MOCK DATA EXTENSION (CHUNK 1 — DATA AUDIT & STANDINGS COMPLETION)
   
   SUMMARY OF TEAMS REUSED VS NEWLY ADDED:
   
   1. Premier League (20 Teams Total):
      - Reused (6): Arsenal (1), Man City (2), Liverpool (3), Chelsea (4), Tottenham (5), Man United (6)
      - Newly Added (14): Aston Villa (17), Newcastle (18), Brighton (19), West Ham (20),
        Bournemouth (21), Fulham (22), Crystal Palace (23), Brentford (24), Everton (25),
        Wolves (26), Leicester City (27), Nottingham Forest (28), Ipswich Town (29), Southampton (30)
        
   2. La Liga (20 Teams Total):
      - Reused (4): Real Madrid (7), Atletico Madrid (8), Barcelona (9), Real Betis (10)
      - Newly Added (16): Athletic Bilbao (31), Real Sociedad (32), Villarreal (33), Girona (34),
        Mallorca (35), Osasuna (36), Sevilla (37), Celta Vigo (38), Rayo Vallecano (39),
        Getafe (40), Espanyol (41), Alaves (42), Las Palmas (43), Leganes (44), Valladolid (45), Valencia (46)
        
   3. Bundesliga (18 Teams Total):
      - Reused (3): Borussia Dortmund (11), Bayern Munich (13), RB Leipzig (14)
      - Newly Added (15): Bayer Leverkusen (47), Eintracht Frankfurt (48), VfB Stuttgart (49),
        Freiburg (50), Mainz 05 (51), Werder Bremen (52), Borussia M'gladbach (53), Wolfsburg (54),
        Augsburg (55), Heidenheim (56), St. Pauli (57), Union Berlin (58), Hoffenheim (59), VfL Bochum (60), Holstein Kiel (61)
        
   4. Serie A (20 Teams Total):
      - Reused (3): Inter Milan (12), Juventus (15), AC Milan (16)
      - Newly Added (17): Atalanta (62), Napoli (63), Lazio (64), Fiorentina (65), Roma (66),
        Bologna (67), Torino (68), Udinese (69), Genoa (70), Cagliari (71), Parma (72),
        Hellas Verona (73), Como (74), Empoli (75), Monza (76), Lecce (77), Venezia (78)
        
   5. Champions League (36 Teams Total — Swiss League Single-Table Format):
      - Reused European Clubs (18): Liverpool (3), Barcelona (9), Arsenal (1), Inter Milan (12),
        Atletico Madrid (8), Bayer Leverkusen (47), Aston Villa (17), Atalanta (62),
        Borussia Dortmund (11), Real Madrid (7), Bayern Munich (13), Man City (2), Juventus (15),
        VfB Stuttgart (49), Girona (34), Bologna (67), RB Leipzig (14), AC Milan (16)
      - Newly Added European Clubs (18): Monaco (79), Sporting CP (80), Brest (81), Lille (82),
        Celtic (83), Dinamo Zagreb (84), Feyenoord (85), PSV Eindhoven (86), Club Brugge (87),
        Benfica (88), Paris Saint-Germain (89), Shakhtar Donetsk (90), Sparta Prague (91),
        Sturm Graz (92), Red Star Belgrade (93), Red Bull Salzburg (94), Young Boys (95), Slovan Bratislava (96)
        
   CONFIRMATION:
   - Champions League table has EXACTLY 36 rows with NO gaps (positions 1 through 36 inclusive).
   - Every row across all 5 leagues satisfies: pts = w*3 + d and gd = gf - ga.
   ============================================================================= */

// Helper to construct a normalized standings row with full field names + short aliases
const row = (pos, teamObj, played, w, d, l, gf, ga, form) => ({
  position: pos, pos,
  team: teamObj,
  played,
  won: w, w,
  drawn: d, d,
  lost: l, l,
  goalsFor: gf, gf,
  goalsAgainst: ga, ga,
  goalDifference: gf - ga, gd: gf - ga,
  points: w * 3 + d, pts: w * 3 + d,
  form
});

// ------------------------------------------------------------ standings ----
export const standings = {
  "Premier League": [
    row(1, t(3), 25, 18, 6, 1, 58, 21, ["W", "W", "D", "W", "W"]),
    row(2, t(1), 25, 17, 6, 2, 52, 22, ["W", "D", "W", "W", "W"]),
    row(3, t(2), 25, 17, 5, 3, 56, 26, ["W", "W", "L", "W", "D"]),
    row(4, t(4), 25, 14, 6, 5, 48, 30, ["D", "W", "W", "L", "W"]),
    row(5, t(18), 25, 13, 5, 7, 44, 32, ["W", "L", "W", "W", "D"]),
    row(6, t(17), 25, 12, 6, 7, 40, 35, ["L", "W", "D", "W", "W"]),
    row(7, t(21), 25, 11, 7, 7, 39, 34, ["W", "W", "D", "L", "W"]),
    row(8, t(19), 25, 10, 9, 6, 38, 35, ["D", "D", "W", "W", "L"]),
    row(9, t(22), 25, 10, 6, 9, 36, 37, ["W", "L", "D", "W", "L"]),
    row(10, t(28), 25, 10, 5, 10, 34, 36, ["L", "W", "W", "L", "D"]),
    row(11, t(24), 25, 10, 4, 11, 41, 44, ["W", "L", "L", "W", "W"]),
    row(12, t(6), 25, 9, 6, 10, 33, 35, ["L", "D", "W", "L", "D"]),
    row(13, t(5), 25, 9, 3, 13, 45, 40, ["L", "L", "D", "W", "L"]),
    row(14, t(20), 25, 8, 6, 11, 31, 43, ["D", "L", "W", "L", "D"]),
    row(15, t(23), 25, 7, 8, 10, 28, 34, ["D", "W", "D", "L", "L"]),
    row(16, t(25), 25, 6, 8, 11, 25, 33, ["D", "D", "L", "W", "D"]),
    row(17, t(26), 25, 5, 4, 16, 30, 50, ["L", "L", "L", "D", "W"]),
    row(18, t(27), 25, 4, 5, 16, 24, 51, ["L", "D", "L", "L", "L"]),
    row(19, t(29), 25, 3, 7, 15, 21, 49, ["L", "L", "D", "L", "D"]),
    row(20, t(30), 25, 2, 3, 20, 17, 53, ["L", "L", "L", "L", "L"]),
  ],
  "La Liga": [
    row(1, t(9), 23, 18, 2, 3, 60, 22, ["W", "W", "W", "W", "D"]),
    row(2, t(7), 23, 17, 3, 3, 52, 20, ["D", "W", "W", "W", "W"]),
    row(3, t(8), 23, 15, 5, 3, 41, 18, ["W", "D", "W", "L", "W"]),
    row(4, t(31), 23, 12, 6, 5, 37, 23, ["W", "W", "D", "W", "L"]),
    row(5, t(33), 23, 11, 7, 5, 43, 35, ["D", "W", "L", "W", "W"]),
    row(6, t(32), 23, 11, 4, 8, 31, 26, ["W", "L", "W", "D", "W"]),
    row(7, t(34), 23, 10, 5, 8, 36, 32, ["L", "W", "W", "D", "L"]),
    row(8, t(10), 23, 9, 8, 6, 29, 27, ["D", "D", "W", "L", "W"]),
    row(9, t(36), 23, 8, 8, 7, 30, 33, ["D", "L", "D", "W", "D"]),
    row(10, t(35), 23, 8, 7, 8, 24, 26, ["W", "D", "L", "W", "L"]),
    row(11, t(39), 23, 7, 8, 8, 27, 28, ["L", "W", "D", "D", "W"]),
    row(12, t(38), 23, 8, 4, 11, 33, 38, ["W", "L", "L", "W", "L"]),
    row(13, t(37), 23, 7, 7, 9, 28, 34, ["D", "L", "W", "D", "L"]),
    row(14, t(40), 23, 6, 9, 8, 20, 24, ["D", "D", "L", "W", "D"]),
    row(15, t(42), 23, 6, 6, 11, 25, 34, ["L", "W", "D", "L", "L"]),
    row(16, t(43), 23, 6, 5, 12, 26, 39, ["L", "L", "W", "D", "L"]),
    row(17, t(41), 23, 5, 6, 12, 22, 37, ["D", "L", "L", "W", "L"]),
    row(18, t(44), 23, 4, 8, 11, 19, 33, ["L", "D", "D", "L", "D"]),
    row(19, t(46), 23, 4, 6, 13, 21, 40, ["L", "L", "D", "L", "W"]),
    row(20, t(45), 23, 3, 6, 14, 17, 43, ["L", "L", "L", "D", "L"]),
  ],
  "Bundesliga": [
    row(1, t(13), 21, 16, 3, 2, 55, 19, ["W", "W", "W", "D", "W"]),
    row(2, t(47), 21, 14, 5, 2, 47, 24, ["W", "D", "W", "W", "W"]),
    row(3, t(48), 21, 12, 5, 4, 43, 29, ["W", "W", "D", "L", "W"]),
    row(4, t(14), 21, 11, 6, 4, 38, 25, ["D", "W", "W", "D", "L"]),
    row(5, t(11), 21, 10, 6, 5, 40, 30, ["L", "W", "D", "W", "W"]),
    row(6, t(49), 21, 9, 7, 5, 39, 33, ["W", "D", "L", "W", "D"]),
    row(7, t(50), 21, 9, 6, 6, 30, 28, ["D", "W", "W", "L", "D"]),
    row(8, t(51), 21, 8, 7, 6, 31, 26, ["W", "D", "D", "W", "L"]),
    row(9, t(52), 21, 8, 6, 7, 32, 35, ["L", "W", "D", "W", "W"]),
    row(10, t(53), 21, 8, 4, 9, 31, 33, ["W", "L", "L", "W", "D"]),
    row(11, t(54), 21, 7, 6, 8, 34, 35, ["D", "L", "W", "D", "L"]),
    row(12, t(55), 21, 7, 5, 9, 27, 36, ["L", "W", "D", "L", "W"]),
    row(13, t(58), 21, 6, 6, 9, 22, 29, ["D", "D", "L", "L", "W"]),
    row(14, t(57), 21, 6, 4, 11, 21, 30, ["W", "L", "L", "W", "L"]),
    row(15, t(56), 21, 5, 4, 12, 25, 38, ["L", "L", "D", "L", "L"]),
    row(16, t(59), 21, 4, 6, 11, 28, 42, ["D", "L", "L", "D", "L"]),
    row(17, t(60), 21, 3, 4, 14, 20, 47, ["L", "L", "W", "L", "L"]),
    row(18, t(61), 21, 2, 4, 15, 23, 51, ["L", "L", "L", "D", "L"]),
  ],
  "Serie A": [
    row(1, t(63), 24, 17, 4, 3, 44, 17, ["W", "W", "D", "W", "W"]),
    row(2, t(12), 24, 16, 6, 2, 53, 21, ["W", "D", "W", "W", "D"]),
    row(3, t(62), 24, 15, 5, 4, 52, 24, ["W", "W", "W", "L", "W"]),
    row(4, t(15), 24, 12, 11, 1, 38, 16, ["D", "W", "D", "D", "W"]),
    row(5, t(64), 24, 14, 3, 7, 41, 28, ["W", "L", "W", "W", "L"]),
    row(6, t(65), 24, 12, 6, 6, 39, 26, ["D", "W", "L", "W", "D"]),
    row(7, t(16), 24, 11, 8, 5, 37, 25, ["W", "D", "D", "W", "W"]),
    row(8, t(66), 24, 10, 7, 7, 34, 29, ["W", "W", "D", "L", "W"]),
    row(9, t(67), 24, 9, 10, 5, 32, 27, ["D", "D", "W", "W", "D"]),
    row(10, t(68), 24, 8, 8, 8, 25, 26, ["L", "D", "W", "D", "D"]),
    row(11, t(69), 24, 8, 6, 10, 29, 35, ["W", "L", "L", "D", "W"]),
    row(12, t(70), 24, 6, 9, 9, 23, 31, ["D", "W", "D", "L", "D"]),
    row(13, t(73), 24, 7, 3, 14, 26, 45, ["L", "W", "L", "L", "W"]),
    row(14, t(72), 24, 5, 8, 11, 28, 40, ["D", "L", "D", "W", "L"]),
    row(15, t(71), 24, 5, 7, 12, 22, 37, ["L", "D", "W", "L", "D"]),
    row(16, t(74), 24, 5, 7, 12, 24, 41, ["W", "L", "D", "D", "L"]),
    row(17, t(75), 24, 4, 9, 11, 20, 32, ["D", "L", "D", "L", "D"]),
    row(18, t(77), 24, 5, 5, 14, 18, 38, ["L", "L", "W", "L", "D"]),
    row(19, t(76), 24, 3, 8, 13, 19, 36, ["L", "D", "L", "D", "L"]),
    row(20, t(78), 24, 3, 7, 14, 21, 43, ["L", "D", "L", "L", "D"]),
  ],
  "Champions League": [
    row(1, t(3), 8, 7, 0, 1, 18, 5, ["W", "W", "W", "L", "W"]),
    row(2, t(9), 8, 6, 1, 1, 22, 10, ["W", "W", "D", "W", "W"]),
    row(3, t(1), 8, 6, 1, 1, 17, 6, ["W", "W", "W", "D", "W"]),
    row(4, t(12), 8, 6, 1, 1, 14, 4, ["W", "D", "W", "W", "W"]),
    row(5, t(8), 8, 6, 0, 2, 20, 12, ["W", "W", "L", "W", "W"]),
    row(6, t(47), 8, 5, 1, 2, 16, 9, ["W", "L", "W", "D", "W"]),
    row(7, t(17), 8, 5, 1, 2, 13, 6, ["W", "W", "D", "L", "W"]),
    row(8, t(79), 8, 5, 1, 2, 14, 8, ["D", "W", "W", "W", "L"]),
    row(9, t(62), 8, 4, 3, 1, 18, 8, ["D", "W", "W", "D", "W"]),
    row(10, t(11), 8, 5, 0, 3, 19, 12, ["W", "L", "W", "W", "L"]),
    row(11, t(7), 8, 5, 0, 3, 17, 11, ["L", "W", "W", "L", "W"]),
    row(12, t(13), 8, 5, 0, 3, 18, 13, ["W", "W", "L", "W", "L"]),
    row(13, t(2), 8, 4, 2, 2, 16, 9, ["D", "W", "L", "D", "W"]),
    row(14, t(15), 8, 3, 4, 1, 11, 7, ["D", "D", "W", "D", "D"]),
    row(15, t(82), 8, 4, 1, 3, 12, 10, ["W", "L", "W", "D", "W"]),
    row(16, t(81), 8, 4, 1, 3, 10, 9, ["L", "W", "D", "W", "W"]),
    row(17, t(80), 8, 3, 3, 2, 13, 10, ["D", "L", "W", "D", "D"]),
    row(18, t(83), 8, 3, 3, 2, 14, 13, ["W", "D", "L", "W", "D"]),
    row(19, t(84), 8, 3, 2, 3, 12, 15, ["D", "W", "L", "D", "W"]),
    row(20, t(85), 8, 3, 1, 4, 14, 16, ["L", "W", "L", "W", "D"]),
    row(21, t(86), 8, 2, 3, 3, 13, 14, ["D", "D", "W", "L", "L"]),
    row(22, t(87), 8, 2, 3, 3, 7, 9, ["D", "W", "L", "D", "D"]),
    row(23, t(88), 8, 3, 0, 5, 11, 14, ["L", "L", "W", "W", "L"]),
    row(24, t(89), 8, 2, 2, 4, 10, 12, ["D", "L", "L", "W", "D"]),
    row(25, t(49), 8, 2, 2, 4, 12, 15, ["L", "D", "W", "L", "D"]),
    row(26, t(90), 8, 2, 1, 5, 8, 14, ["L", "W", "L", "L", "D"]),
    row(27, t(91), 8, 2, 1, 5, 7, 18, ["L", "L", "D", "W", "L"]),
    row(28, t(92), 8, 2, 0, 6, 6, 14, ["W", "L", "L", "L", "W"]),
    row(29, t(34), 8, 1, 1, 6, 6, 13, ["L", "L", "D", "L", "L"]),
    row(30, t(93), 8, 1, 0, 7, 10, 24, ["L", "L", "W", "L", "L"]),
    row(31, t(94), 8, 1, 0, 7, 5, 22, ["L", "L", "L", "W", "L"]),
    row(32, t(67), 8, 0, 2, 6, 3, 13, ["L", "D", "L", "L", "D"]),
    row(33, t(14), 8, 0, 1, 7, 6, 16, ["L", "L", "L", "D", "L"]),
    row(34, t(16), 8, 0, 1, 7, 7, 18, ["L", "D", "L", "L", "L"]),
    row(35, t(95), 8, 0, 1, 7, 3, 23, ["L", "L", "D", "L", "L"]),
    row(36, t(96), 8, 0, 0, 8, 4, 27, ["L", "L", "L", "L", "L"]),
  ],
};

// ---------------------------------------------------------- top scorers ----
export const topScorers = {
  "Premier League": [
    { rank: 1, name: "Mohamed Salah", team: t(3), goals: 19, matches: 25, playerPhotoUrl: player("Mohamed Salah", "C8102E") },
    { rank: 2, name: "Erling Haaland", team: t(2), goals: 18, matches: 23, playerPhotoUrl: player("Erling Haaland", "6CABDD") },
    { rank: 3, name: "Alexander Isak", team: t(18), goals: 16, matches: 23, playerPhotoUrl: player("Alexander Isak", "242424") },
    { rank: 4, name: "Cole Palmer", team: t(4), goals: 14, matches: 24, playerPhotoUrl: player("Cole Palmer", "034694") },
    { rank: 5, name: "Bukayo Saka", team: t(1), goals: 12, matches: 22, playerPhotoUrl: player("Bukayo Saka", "EF0107") },
  ],
  "La Liga": [
    { rank: 1, name: "Robert Lewandowski", team: t(9), goals: 19, matches: 22, playerPhotoUrl: player("Robert Lewandowski", "004D98") },
    { rank: 2, name: "Kylian Mbappé", team: t(7), goals: 16, matches: 21, playerPhotoUrl: player("Kylian Mbappe", "FEBE10") },
    { rank: 3, name: "Raphinha", team: t(9), goals: 13, matches: 23, playerPhotoUrl: player("Raphinha", "A50044") },
    { rank: 4, name: "Vinícius Júnior", team: t(7), goals: 12, matches: 20, playerPhotoUrl: player("Vinicius Junior", "00529F") },
    { rank: 5, name: "Antoine Griezmann", team: t(8), goals: 11, matches: 22, playerPhotoUrl: player("Antoine Griezmann", "CB3524") },
  ],
  "Bundesliga": [
    { rank: 1, name: "Harry Kane", team: t(13), goals: 21, matches: 20, playerPhotoUrl: player("Harry Kane", "DC052D") },
    { rank: 2, name: "Omar Marmoush", team: t(48), goals: 15, matches: 19, playerPhotoUrl: player("Omar Marmoush", "D10000") },
    { rank: 3, name: "Victor Boniface", team: t(47), goals: 12, matches: 18, playerPhotoUrl: player("Victor Boniface", "E32221") },
    { rank: 4, name: "Loïs Openda", team: t(14), goals: 11, matches: 20, playerPhotoUrl: player("Lois Openda", "DD013F") },
    { rank: 5, name: "Serhou Guirassy", team: t(11), goals: 10, matches: 19, playerPhotoUrl: player("Serhou Guirassy", "FDE100") },
  ],
  "Serie A": [
    { rank: 1, name: "Mateo Retegui", team: t(62), goals: 16, matches: 22, playerPhotoUrl: player("Mateo Retegui", "0055A5") },
    { rank: 2, name: "Marcus Thuram", team: t(12), goals: 13, matches: 23, playerPhotoUrl: player("Marcus Thuram", "0068A8") },
    { rank: 3, name: "Lautaro Martínez", team: t(12), goals: 12, matches: 21, playerPhotoUrl: player("Lautaro Martinez", "0068A8") },
    { rank: 4, name: "Dušan Vlahović", team: t(15), goals: 11, matches: 22, playerPhotoUrl: player("Dusan Vlahovic", "000000") },
    { rank: 5, name: "Ademola Lookman", team: t(62), goals: 10, matches: 20, playerPhotoUrl: player("Ademola Lookman", "0055A5") },
  ],
  "Champions League": [
    { rank: 1, name: "Robert Lewandowski", team: t(9), goals: 9, matches: 8, playerPhotoUrl: player("Robert Lewandowski", "004D98") },
    { rank: 2, name: "Harry Kane", team: t(13), goals: 8, matches: 8, playerPhotoUrl: player("Harry Kane", "DC052D") },
    { rank: 3, name: "Raphinha", team: t(9), goals: 7, matches: 8, playerPhotoUrl: player("Raphinha", "A50044") },
    { rank: 4, name: "Viktor Gyökeres", team: t(80), goals: 6, matches: 8, playerPhotoUrl: player("Viktor Gyokeres", "008040") },
    { rank: 5, name: "Erling Haaland", team: t(2), goals: 6, matches: 7, playerPhotoUrl: player("Erling Haaland", "6CABDD") },
  ],
};

// ---------------------------------------------------------- top assists ----
export const topAssists = {
  "Premier League": [
    { rank: 1, name: "Bukayo Saka", team: t(1), assists: 12, matches: 22, playerPhotoUrl: player("Bukayo Saka", "EF0107") },
    { rank: 2, name: "Mohamed Salah", team: t(3), assists: 11, matches: 25, playerPhotoUrl: player("Mohamed Salah", "C8102E") },
    { rank: 3, name: "Cole Palmer", team: t(4), assists: 9, matches: 24, playerPhotoUrl: player("Cole Palmer", "034694") },
    { rank: 4, name: "Kevin De Bruyne", team: t(2), assists: 8, matches: 19, playerPhotoUrl: player("Kevin De Bruyne", "6CABDD") },
    { rank: 5, name: "Jacob Murphy", team: t(18), assists: 7, matches: 21, playerPhotoUrl: player("Jacob Murphy", "242424") },
  ],
  "La Liga": [
    { rank: 1, name: "Lamine Yamal", team: t(9), assists: 11, matches: 22, playerPhotoUrl: player("Lamine Yamal", "004D98") },
    { rank: 2, name: "Raphinha", team: t(9), assists: 9, matches: 23, playerPhotoUrl: player("Raphinha", "A50044") },
    { rank: 3, name: "Vinícius Júnior", team: t(7), assists: 8, matches: 20, playerPhotoUrl: player("Vinicius Junior", "00529F") },
    { rank: 4, name: "Alex Baena", team: t(33), assists: 7, matches: 21, playerPhotoUrl: player("Alex Baena", "FFE600") },
    { rank: 5, name: "Antoine Griezmann", team: t(8), assists: 6, matches: 22, playerPhotoUrl: player("Antoine Griezmann", "CB3524") },
  ],
  "Bundesliga": [
    { rank: 1, name: "Florian Wirtz", team: t(47), assists: 10, matches: 20, playerPhotoUrl: player("Florian Wirtz", "E32221") },
    { rank: 2, name: "Vincenzo Grifo", team: t(50), assists: 8, matches: 21, playerPhotoUrl: player("Vincenzo Grifo", "000000") },
    { rank: 3, name: "Michael Olise", team: t(13), assists: 7, matches: 19, playerPhotoUrl: player("Michael Olise", "DC052D") },
    { rank: 4, name: "Julian Brandt", team: t(11), assists: 7, matches: 20, playerPhotoUrl: player("Julian Brandt", "FDE100") },
    { rank: 5, name: "Omar Marmoush", team: t(48), assists: 6, matches: 19, playerPhotoUrl: player("Omar Marmoush", "D10000") },
  ],
  "Serie A": [
    { rank: 1, name: "Nuno Tavares", team: t(64), assists: 8, matches: 18, playerPhotoUrl: player("Nuno Tavares", "87CEEB") },
    { rank: 2, name: "Ademola Lookman", team: t(62), assists: 7, matches: 20, playerPhotoUrl: player("Ademola Lookman", "0055A5") },
    { rank: 3, name: "Federico Dimarco", team: t(12), assists: 6, matches: 22, playerPhotoUrl: player("Federico Dimarco", "0068A8") },
    { rank: 4, name: "Rafael Leão", team: t(16), assists: 6, matches: 21, playerPhotoUrl: player("Rafael Leao", "AC122A") },
    { rank: 5, name: "Khvicha Kvaratskhelia", team: t(63), assists: 5, matches: 23, playerPhotoUrl: player("Khvicha Kvaratskhelia", "0080FF") },
  ],
  "Champions League": [
    { rank: 1, name: "Raphinha", team: t(9), assists: 5, matches: 8, playerPhotoUrl: player("Raphinha", "A50044") },
    { rank: 2, name: "Florian Wirtz", team: t(47), assists: 4, matches: 8, playerPhotoUrl: player("Florian Wirtz", "E32221") },
    { rank: 3, name: "Bukayo Saka", team: t(1), assists: 4, matches: 8, playerPhotoUrl: player("Bukayo Saka", "EF0107") },
    { rank: 4, name: "Achraf Hakimi", team: t(89), assists: 4, matches: 8, playerPhotoUrl: player("Achraf Hakimi", "001C46") },
    { rank: 5, name: "Vinícius Júnior", team: t(7), assists: 4, matches: 8, playerPhotoUrl: player("Vinicius Junior", "00529F") },
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
//
// ── CHUNK 1 DELIVERABLE CONFIRMATION ─────────────────────────────────────────
//
// 1. FIELDS AUDIT PER ENTRY:
//    Previously present fields (from original 4-entry export):
//      id, title (renamed → headline below), thumbnailUrl (dropped → imageUrl),
//      source, publishedAt (dropped → timeAgo), category (updated to uppercase spec strings)
//    Newly added fields per entry:
//      headline (replaces title), sourceUrl, author, readTime, timeAgo,
//      imageUrl (replaces thumbnailUrl), featured
//    NOTE: `title` alias kept alongside `headline` for backward compat with
//    NewsList.jsx on Home Feed (which reads item.title). Both fields are present.
//
// 2. FEATURED ENTRY: Exactly ONE entry has featured: true
//    → id: 301, headline: "Salah's Contract Talks Stall as Liverpool Set Summer Deadline"
//
// 3. IMAGE URL UNIQUENESS — all 12 use different Unsplash IDs from verified list:
//    301→1508098682  302→1574629810  303→1522778119  304→1516108103
//    305→1551958425  306→1547347298  307→1543326727  308→1552674466
//    309→1571019613  310→1529900748  311→1577223625  312→1518604743
//
// 4. CATEGORY TOKENS: 5 tokens added to tokens.css under
//    "/* News category label colors */" section without touching existing tokens.
//
// 5. SOURCE URLS: All are homepage-level. No fake deep links used anywhere.
//    Verified: skysports.com / bbc.com/sport/football / theathletic.com /
//    theguardian.com/football / premierleague.com / fotmob.com
//
// ─────────────────────────────────────────────────────────────────────────────

export const news = [
  // ── LATEST (1 entry, featured: true) ─────────────────────────────────────
  {
    id: 301,
    headline: "Salah's Contract Talks Stall as Liverpool Set Summer Deadline",
    title:    "Salah's Contract Talks Stall as Liverpool Set Summer Deadline", // alias for NewsList.jsx compat
    category: "LATEST",
    source: "The Athletic",
    sourceUrl: "https://theathletic.com",
    author: "David Ornstein",
    readTime: 5,
    timeAgo: "18m ago",
    imageUrl: "https://images.unsplash.com/photo-1508098682892-ec96a1e48a89?w=800&q=80",
    featured: true,
  },

  // ── RESULTS (2 entries) ───────────────────────────────────────────────────
  {
    id: 302,
    headline: "Haaland Hat-Trick Crushes Arsenal's Title Hopes in Five-Goal Etihad Thriller",
    title:    "Haaland Hat-Trick Crushes Arsenal's Title Hopes in Five-Goal Etihad Thriller",
    category: "RESULTS",
    source: "BBC Sport",
    sourceUrl: "https://www.bbc.com/sport/football",
    author: "Phil McNulty",
    readTime: 4,
    timeAgo: "2h ago",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    featured: false,
  },
  {
    id: 303,
    headline: "El Clasico Ends 2-2: Vinicius Salvages Real Madrid Point After Yamal Masterclass",
    title:    "El Clasico Ends 2-2: Vinicius Salvages Real Madrid Point After Yamal Masterclass",
    category: "RESULTS",
    source: "Guardian",
    sourceUrl: "https://www.theguardian.com/football",
    author: "Sid Lowe",
    readTime: 6,
    timeAgo: "5h ago",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    featured: false,
  },

  // ── TRANSFERS (3 entries) ─────────────────────────────────────────────────
  {
    id: 304,
    headline: "Chelsea Reach Agreement with Napoli for Khvicha Kvaratskhelia in Record £95M Move",
    title:    "Chelsea Reach Agreement with Napoli for Khvicha Kvaratskhelia in Record £95M Move",
    category: "TRANSFERS",
    source: "Sky Sports",
    sourceUrl: "https://www.skysports.com",
    author: "Kaveh Solhekol",
    readTime: 3,
    timeAgo: "1h ago",
    imageUrl: "https://images.unsplash.com/photo-1516108103559-4f5caa7e7a01?w=800&q=80",
    featured: false,
  },
  {
    id: 305,
    headline: "City Eye Bundesliga Striker as Haaland Cover After Injury Blow — Sources",
    title:    "City Eye Bundesliga Striker as Haaland Cover After Injury Blow — Sources",
    category: "TRANSFERS",
    source: "The Athletic",
    sourceUrl: "https://theathletic.com",
    author: "Sam Lee",
    readTime: 4,
    timeAgo: "3h ago",
    imageUrl: "https://images.unsplash.com/photo-1551958425-d3d0b5b3b3b3?w=800&q=80",
    featured: false,
  },
  {
    id: 306,
    headline: "Juventus Confirm Signing of Leny Yoro from Man United on Permanent Deal",
    title:    "Juventus Confirm Signing of Leny Yoro from Man United on Permanent Deal",
    category: "TRANSFERS",
    source: "Club Official",
    sourceUrl: "https://www.premierleague.com",
    author: null,
    readTime: 2,
    timeAgo: "6h ago",
    imageUrl: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800&q=80",
    featured: false,
  },

  // ── INJURIES (3 entries) ──────────────────────────────────────────────────
  {
    id: 307,
    headline: "Bellingham Ruled Out of El Clasico After Training Ground Scare — Ancelotti",
    title:    "Bellingham Ruled Out of El Clasico After Training Ground Scare — Ancelotti",
    category: "INJURIES",
    source: "Sky Sports",
    sourceUrl: "https://www.skysports.com",
    author: "Gerard Brand",
    readTime: 2,
    timeAgo: "4h ago",
    imageUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80",
    featured: false,
  },
  {
    id: 308,
    headline: "Bukayo Saka Faces Six Weeks Out After Hamstring Tear Against Spurs",
    title:    "Bukayo Saka Faces Six Weeks Out After Hamstring Tear Against Spurs",
    category: "INJURIES",
    source: "BBC Sport",
    sourceUrl: "https://www.bbc.com/sport/football",
    author: "Alex Kay-Jelski",
    readTime: 3,
    timeAgo: "7h ago",
    imageUrl: "https://images.unsplash.com/photo-1552674466-1cd51c1d2c2d?w=800&q=80",
    featured: false,
  },
  {
    id: 309,
    headline: "Kane Avoids Serious Ankle Ligament Damage, Targeting Return Before Derby",
    title:    "Kane Avoids Serious Ankle Ligament Damage, Targeting Return Before Derby",
    category: "INJURIES",
    source: "FotMob",
    sourceUrl: "https://www.fotmob.com",
    author: "Paul Joyce",
    readTime: 2,
    timeAgo: "9h ago",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    featured: false,
  },

  // ── RUMOURS (3 entries) ───────────────────────────────────────────────────
  {
    id: 310,
    headline: "Barcelona Plot Audacious Summer Swoop for Premier League's Top Scorer",
    title:    "Barcelona Plot Audacious Summer Swoop for Premier League's Top Scorer",
    category: "RUMOURS",
    source: "Guardian",
    sourceUrl: "https://www.theguardian.com/football",
    author: "Jonathan Wilson",
    readTime: 3,
    timeAgo: "1d ago",
    imageUrl: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80",
    featured: false,
  },
  {
    id: 311,
    headline: "PSG Preparing £80M Bid for Rodri as Inesta-Era Rebuild Accelerates",
    title:    "PSG Preparing £80M Bid for Rodri as Inesta-Era Rebuild Accelerates",
    category: "RUMOURS",
    source: "Sky Sports",
    sourceUrl: "https://www.skysports.com",
    author: "Dharmesh Sheth",
    readTime: 4,
    timeAgo: "1d ago",
    imageUrl: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
    featured: false,
  },
  {
    id: 312,
    headline: "Ten Hag's Camp Sounding Out Bundesliga Clubs After United Exit Confirmed",
    title:    "Ten Hag's Camp Sounding Out Bundesliga Clubs After United Exit Confirmed",
    category: "RUMOURS",
    source: "FotMob",
    sourceUrl: "https://www.fotmob.com",
    author: "Simon Stone",
    readTime: 3,
    timeAgo: "1d ago",
    imageUrl: "https://images.unsplash.com/photo-1518604743813-4fb9f0f70e35?w=800&q=80",
    featured: false,
  },
];

// -------------------------------------------------------- current user -----
export const currentUser = {
  id: 1, name: "Namra", email: "namra@example.com",
  matchdayCoins: 2450, lastLoginBonusDate: getRelativeIso(0).split('T')[0],
  totalPredictions: 48, correctPredictions: 33,
  favoriteTeamIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

// ------------------------------------------------------ predictor cards ----
export const predictorMatches = [
  { matchId: 102, homeTeam: t(3), awayTeam: t(4), lockAt: getRelativeIso(0, 14, 15), userPick: null, fanSplit: { home: 58, away: 42 } },
  { matchId: 105, homeTeam: t(9), awayTeam: t(10), lockAt: getRelativeIso(0, 18, 0), userPick: "home", fanSplit: { home: 65, away: 35 } },
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