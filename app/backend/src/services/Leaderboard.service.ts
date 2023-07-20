import IMatchWithTeams from '../Interfaces/IMatchWithTeams';
import { leaderboard } from '../types/responseTypes';
import MatchesModel from '../database/models/useModels/MatchesModel';
import IMatch from '../Interfaces/IMatch';

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

  public async leaderboard() {
    const homeBoard = (await this.homeLeaderboard(true)).data;
    const awayBoard = (await this.homeLeaderboard(false)).data;
    const teams = homeBoard.map((team) => {
      const away = awayBoard.find((awayTeam) => awayTeam.name === team.name) as leaderboard;
      return LeaderboardService.squashBoard(team, away);
    });
    LeaderboardService.sortBoard(teams);
    return { status: 'OK', data: teams };
  }

  public async homeLeaderboard(home: boolean) {
    const board = [];
    const allMatches = await this.db.getAll(false);
    const aggMatches = LeaderboardService.matchesCollection(allMatches, home);
    const it = aggMatches.keys();
    for (let i = 1; i <= aggMatches.size; i += 1) {
      board.push(this.scoreTeam(aggMatches.get(it.next().value), home));
    }
    LeaderboardService.sortBoard(board);
    return { status: 'OK', data: board };
  }

  private static matchesCollection(list: IMatch[], home: boolean) {
    const dups = home ? list.map(({ homeTeamId }) => homeTeamId)
      : list.map(({ awayTeamId }) => awayTeamId);
    const teams = [...new Set <number>(dups)];
    const teamToMatches = new Map();
    teams.forEach((team) => teamToMatches.set(team, []));
    list.forEach((match) => teamToMatches
      .get(home ? match.homeTeamId : match.awayTeamId).push(match));
    return teamToMatches;
  }

  private scoreTeam(matches: IMatchWithTeams[], home: boolean) {
    const score = matches.reduce((acc, curr) => {
      const { homeTeamGoals, awayTeamGoals } = curr;
      const teams = [curr.homeTeam.teamName, curr.awayTeam.teamName];
      const goals = [curr.homeTeamGoals, curr.awayTeamGoals];
      acc.name = home ? teams[0] : teams[1];
      acc.goalsFavor += home ? goals[0] : goals[1];
      acc.goalsOwn += home ? awayTeamGoals : homeTeamGoals;
      acc.totalVictories += LeaderboardService.avalResult(homeTeamGoals, awayTeamGoals, home, true);
      acc.totalDraws += homeTeamGoals - awayTeamGoals === 0 ? 1 : 0;
      acc.totalLosses += LeaderboardService.avalResult(homeTeamGoals, awayTeamGoals, home, false);
      acc.totalPoints = acc.totalVictories * 3 + acc.totalDraws;
      acc.totalGames += 1;
      return acc;
    }, this.initial);
    score.goalsBalance = score.goalsFavor - score.goalsOwn;
    score.efficiency = Number(((score.totalPoints / (score.totalGames * 3)) * 100).toFixed(2));

    this.resetState();
    return score;
  }

  private static squashBoard(home: leaderboard, away: leaderboard) {
    const temp = {} as leaderboard;
    temp.name = home.name;
    temp.totalPoints = home.totalPoints + away.totalPoints;
    temp.totalGames = home.totalGames + away.totalGames;
    temp.totalVictories = home.totalVictories + away.totalVictories;
    temp.totalDraws = home.totalDraws + away.totalDraws;
    temp.totalLosses = home.totalLosses + away.totalLosses;
    temp.goalsFavor = home.goalsFavor + away.goalsFavor;
    temp.goalsOwn = home.goalsOwn + away.goalsOwn;
    temp.goalsBalance = temp.goalsFavor - temp.goalsOwn;
    temp.efficiency = Number(((temp.totalPoints / (temp.totalGames * 3)) * 100).toFixed(2));
    return temp;
  }

  private static sortBoard(scoreboard: leaderboard[]) {
    scoreboard.sort((a, b) => {
      if (a.totalPoints > b.totalPoints) return -1;
      if (b.totalPoints > a.totalPoints) return 1;
      if (a.totalVictories > b.totalVictories) return -1;
      if (b.totalVictories > a.totalVictories) return 1;
      if (a.goalsBalance > b.goalsBalance) return -1;
      if (b.goalsBalance > a.goalsBalance) return 1;
      if (a.goalsFavor > b.goalsFavor) return -1;
      if (b.goalsFavor > a.goalsFavor) return 1;
      return 0;
    });
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
