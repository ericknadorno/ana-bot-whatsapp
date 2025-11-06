import Database from 'better-sqlite3';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { logger } from '../index';

const DB_PATH = join(process.cwd(), 'data', 'ana.db');
const SCHEMA_PATH = join(process.cwd(), 'schema.sql');

export function initDatabase(): Database.Database {
  // Garantir que o diretório data existe
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(DB_PATH);
  
  // Habilitar foreign keys
  db.pragma('foreign_keys = ON');
  
  // Aplicar schema se necessário
  applySchema(db);
  
  logger.info({ path: DB_PATH }, 'Database initialized');
  
  return db;
}

function applySchema(db: Database.Database) {
  try {
    // Verificar se as tabelas já existem
    const tableCheck = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'"
    ).get();
    
    if (!tableCheck) {
      logger.info('Applying database schema');
      const schema = readFileSync(SCHEMA_PATH, 'utf-8');
      db.exec(schema);
      logger.info('Database schema applied successfully');
    }
  } catch (error) {
    logger.error({ error }, 'Error applying schema');
    throw error;
  }
}

export function closeDatabase(db: Database.Database) {
  db.close();
  logger.info('Database connection closed');
}
