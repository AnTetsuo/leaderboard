import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert(
      'teams',
      [
        {
          teamName: 'Avaí/Kindermann',
        },
        {
          teamName: 'Bahia',
        },
        {
          teamName: 'Botafogo',
        },
        {
          teamName: 'Corinthians',
        },
        {
          teamName: 'Cruzeiro',
        },
        {
          teamName: 'Ferroviária',
        },
        {
          teamName: 'Flamengo',
        },
        {
          teamName: 'Grêmio',
        },
        {
          teamName: 'Internacional',
        },
        {
          teamName: 'Minas Brasília',
        },
        {
          teamName: 'Napoli-SC',
        },
        {
          teamName: 'Palmeiras',
        },
        {
          teamName: 'Real Brasília',
        },
        {
          teamName: 'Santos',
        },
        {
          teamName: 'São José-SP',
        },
        {
          teamName: 'São Paulo',
        },
      ],
      {},
    );
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('teams', {});
  },
};
