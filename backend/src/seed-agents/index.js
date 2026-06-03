'use strict';
const path = require('path');
const { sequelize } = require('../config/database');
const fs = require('fs');

async function runAgentSeeders() {
  try {
    await sequelize.authenticate();
    console.log('Database connected for seeding agents...');

    const files = fs.readdirSync(__dirname)
      .filter(f => f !== 'index.js' && f.endsWith('.js'))
      .sort();

    for (const file of files) {
      const seeder = require(path.join(__dirname, file));
      await seeder.seed();
      console.log(`✓ Seeded: ${file}`);
    }

    console.log('\nAll agent seeders completed.');
    await sequelize.close();
  } catch (err) {
    console.error('Agent seeding failed:', err);
    process.exit(1);
  }
}

runAgentSeeders();
