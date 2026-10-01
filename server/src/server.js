/**
 * HTTP Server Entry Point
 * Architecture Boundary: Rare modification zone
 */

import app from './app.js';
import { config } from './config/environment.js';
import { connectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  // Connect to Database
  await connectDatabase();

  const server = app.listen(config.port, () => {
    logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    logger.info(`Health check available at http://localhost:${config.port}/api/health`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
  });

  return server;
};

// Start server if executed directly
if (process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].includes('src/server.js'))) {
  startServer();
}

export { startServer };
