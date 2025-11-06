import { config } from 'dotenv';
import express from 'express';
import pino from 'pino';
import { z } from 'zod';
import { initDatabase, closeDatabase } from './db/sqlite';
import { AnaBot } from './bot';

// Carregar variáveis de ambiente
config();

// Configurar logger
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

// Schema de validação das variáveis de ambiente
const envSchema = z.object({
  TZ: z.string().default('Europe/Lisbon'),
  OWNER_NUMBER: z.string().optional(),
  MORNING_DIGEST_HOUR: z.string().default('8'),
  MORNING_DIGEST_MINUTE: z.string().default('0'),
  PORT: z.string().default('3000'),
  LOG_LEVEL: z.string().default('info')
});

async function main() {
  try {
    // Validar variáveis de ambiente
    const env = envSchema.parse(process.env);
    
    // Configurar timezone
    process.env.TZ = env.TZ;
    
    logger.info({ timezone: env.TZ }, 'Starting Ana Bot');
    
    // Validar OWNER_NUMBER se fornecido
    let ownerNumber: string | null = null;
    if (env.OWNER_NUMBER) {
      if (!env.OWNER_NUMBER.includes('@c.us')) {
        logger.warn('OWNER_NUMBER should be in format: 3519xxxxxxxx@c.us');
      }
      ownerNumber = env.OWNER_NUMBER;
      logger.info({ ownerNumber }, 'Bot configured for single owner');
    } else {
      logger.warn('No OWNER_NUMBER set - bot will respond to any user (not recommended)');
    }
    
    // Inicializar banco de dados
    const db = initDatabase();
    
    // Criar servidor HTTP para health check
    const app = express();
    const port = parseInt(env.PORT, 10);
    
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
    const server = app.listen(port, () => {
      logger.info({ port }, 'Health check server started');
    });
    
    // Inicializar bot
    const bot = new AnaBot(db, ownerNumber);
    await bot.start();
    
    logger.info('Ana Bot is ready! 🤖');
    
    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info({ signal }, 'Received shutdown signal');
      
      try {
        await bot.stop();
        server.close();
        closeDatabase(db);
        logger.info('Shutdown complete');
        process.exit(0);
      } catch (error) {
        logger.error({ error }, 'Error during shutdown');
        process.exit(1);
      }
    };
    
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
  } catch (error) {
    logger.error({ error }, 'Fatal error');
    process.exit(1);
  }
}

main();
