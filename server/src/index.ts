import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { env } from './lib/env';
import { connectToDatabase } from './lib/db';

async function main(): Promise<void> {
  await connectToDatabase();
  console.log(`✓ Connected to MongoDB (db: ${mongoose.connection.name})`);

  const app = express();
  app.use(cors({ origin: env.clientOrigin, credentials: true }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      dbName: mongoose.connection.name,
      env: env.nodeEnv,
    });
  });

  app.listen(env.port, () => {
    console.log(`✓ Server listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
