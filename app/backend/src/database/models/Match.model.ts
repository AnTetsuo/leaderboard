import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';
import Team from './Team.model';

export default class Match extends Model<InferAttributes<Match>,
InferCreationAttributes<Match>> {
  declare id: CreationOptional<number>;
  declare home_team_id: number;
  declare home_team_goals: number;
  declare away_team_id: number;
  declare away_team_goals: number;
  declare in_progress: boolean;
}

Match.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  home_team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  home_team_goals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  away_team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  away_team_goals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  in_progress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
}, {
  sequelize: db,
  timestamps: false,
  tableName: 'matches',
});

Team.hasMany(Match, { foreignKey:'home_team_id', as: 'id' });
Team.hasMany(Match, { foreignKey:'away_team_id', as: 'id' });

Match.belongsTo(Team, { foreignKey: 'id', as: 'home_team_id' });
Match.belongsTo(Team, { foreignKey: 'id', as: 'away_team_id' });
