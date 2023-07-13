import { Model, QueryInterface, DataTypes } from 'sequelize';
import IMatch from '../../Interfaces/IMatch';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<IMatch>>('matches', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      home_team_goals: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      home_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      away_team_goals: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      away_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      in_progress: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      }
    },);
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('matches');
  },
};