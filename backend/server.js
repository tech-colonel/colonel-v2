const app = require('./src/app');
const { sequelize } = require('./src/config/database');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 8001;

const start = async () => {
  try {
    // 1. Authenticate single DB connection
    await sequelize.authenticate();
    console.log('[DB] Connection established to colonel_v2.');

    // 2. Load models (registers all associations)
    require('./src/models');
    console.log('[DB] Models loaded.');

    // 3. Start Express server
    app.listen(PORT, () => {
      console.log(`[SERVER] Colonel V2 Backend running on port ${PORT}`);
      console.log(`[SERVER] Environment: ${process.env.NODE_ENV}`);
    });

  } catch (error) {
    console.error('[SERVER ERROR] Failed to start:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('[SERVER] Shutting down...');
  await sequelize.close();
  process.exit(0);
});

start();
