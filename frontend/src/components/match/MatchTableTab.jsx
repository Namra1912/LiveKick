// src/components/match/MatchTableTab.jsx — full league table, both teams highlighted
import { leagues } from '../../data/mockData';
import StandingsTable from '../standings/StandingsTable';

export default function MatchTableTab({ match }) {
  const leagueObj = leagues.find((l) => l.name === match.league);

  return (
    <StandingsTable
      league={leagueObj ?? { name: match.league }}
      highlightTeamIds={[match.homeTeam.id, match.awayTeam.id]}
    />
  );
}
