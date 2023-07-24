import IMatchWithTeams from '../Interfaces/IMatchWithTeams';
import { leaderboard } from '../types/responseTypes';
import MatchesModel from '../database/models/useModels/MatchesModel';
import { ServRes } from '../Interfaces/services/IResponse';

export default class LeaderboardService {
  private initial;
  constructor(
    private db = new MatchesModel(),
  ) {
    this.initial = {
      name: '',
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    };
  }

  public async leaderboard(home?: boolean): Promise<ServRes<leaderboard[]>> {
    const board = [];
    const allMatches = await this.db.getAll(false) as IMatchWithTeams[];
    const aggTeamMatches = typeof home === 'boolean'
      ? LeaderboardService.aggByTeam(allMatches, home)
      : LeaderboardService.aggByTeam(allMatches);
    const it = aggTeamMatches.keys();
    const itTeams = aggTeamMatches.values();
    for (let i = 0; i < aggTeamMatches.size; i += 1) {
      board.push(this.calcScore(itTeams.next().value, it.next().value));
    }
    LeaderboardService.sortBoard(board);
    return { status: 'OK', data: board };
  }

  private static aggByTeam(matches: IMatchWithTeams[], home?: boolean): Map<string, leaderboard[]> {
    const duplicates = [
      ...(matches.map((match) => match.homeTeam.teamName)),
      ...(matches.map((match) => match.awayTeam.teamName)),
    ];
    const teams = [...new Set<string>(duplicates)];
    const teamMatches = new Map();
    teams.forEach((team) => teamMatches.set(team, []));
    matches.forEach((match) => {
      const { homeTeam, awayTeam } = match;
      if (typeof home === 'boolean') {
        teamMatches.get(home ? homeTeam.teamName : awayTeam.teamName).push(match);
      } else {
        teamMatches.get(homeTeam.teamName).push(match);
        teamMatches.get(awayTeam.teamName).push(match);
      }
    });
    return teamMatches;
  }

  private calcScore(matches:IMatchWithTeams[], team: string): leaderboard {
    const score = matches.reduce((acc, curr) => {
      const teamScoring = curr.homeTeam.teamName === team;
      acc.name = team;
      acc.goalsFavor += teamScoring ? curr.homeTeamGoals : curr.awayTeamGoals;
      acc.goalsOwn += teamScoring ? curr.awayTeamGoals : curr.homeTeamGoals;
      acc.totalDraws += curr.homeTeamGoals === curr.awayTeamGoals ? 1 : 0;
      acc.totalVictories += LeaderboardService
        .avalResult(curr.homeTeamGoals, curr.awayTeamGoals, teamScoring, true);
      acc.totalLosses += LeaderboardService
        .avalResult(curr.homeTeamGoals, curr.awayTeamGoals, teamScoring, false);
      acc.totalGames += 1;
      return acc;
    }, this.initial);

    score.totalPoints = score.totalVictories * 3 + score.totalDraws;
    score.goalsBalance = score.goalsFavor - score.goalsOwn;
    score.efficiency = Number(((score.totalPoints / (score.totalGames * 3)) * 100).toFixed(2));
    this.resetState();
    return score;
  }

  private static sortBoard(scoreboard: leaderboard[]): void {
    scoreboard.sort((a, b) =>
      (b.totalPoints - a.totalPoints)
      || (b.totalVictories - a.totalVictories)
      || (b.goalsBalance - a.goalsBalance)
      || (b.goalsFavor - a.goalsFavor));
  }

  private static avalResult(
    homeG: number,
    awayG: number,
    home: boolean,
    victory: boolean,
  ): number {
    const favorHome = homeG - awayG > 0 ? 1 : 0;
    const favorAway = awayG - homeG > 0 ? 1 : 0;
    if (home && victory) return favorHome;
    if (home) return favorAway;
    if (!home && victory) return favorAway;
    if (!home && !victory) return favorHome;
    return favorAway;
  }

  private resetState():void {
    const reset = Object.fromEntries(Object.keys(this.initial)
      .map((e) => [e, e === 'name' ? '' : 0])) as leaderboard;
    this.initial = reset;
  }
}
