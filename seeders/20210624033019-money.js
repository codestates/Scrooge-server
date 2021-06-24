'use strict';

const createdAt = new Date();
const updatedAt = new Date();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('money', [{
        cost: "1",
        memo: "피자",
        date: "2021-06-20",
        userId: "1",
        categoryId: "1",
        createdAt,
        updatedAt,
     },{
      cost: "10",
      memo: "치킨",
      date: "2021-06-20",
      userId: "1",
      categoryId: "1",
      createdAt,
      updatedAt,
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('money', null, {});
  }
};
