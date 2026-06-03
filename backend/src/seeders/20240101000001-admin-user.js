'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const existing = await queryInterface.rawSelect('users', {
      where: { email: 'admin@colonel.com' },
    }, ['id']);
    if (existing) return;

    const hashed = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      name: 'Admin',
      email: 'admin@colonel.com',
      password: hashed,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@colonel.com' });
  },
};
