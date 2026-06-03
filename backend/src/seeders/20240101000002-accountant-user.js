'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// ── Fill in your credentials here ─────────────────────────────
const EMAIL = 'accountant@colonel.com';
const PASSWORD = 'accountant123';
// ──────────────────────────────────────────────────────────────

module.exports = {
  async up(queryInterface, Sequelize) {
    const existing = await queryInterface.rawSelect('users', {
      where: { email: EMAIL },
    }, ['id']);
    if (existing) return;

    const hashed = await bcrypt.hash(PASSWORD, 10);
    await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      name: 'Accountant',
      email: EMAIL,
      password: hashed,
      role: 'accountant',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: EMAIL });
  },
};
