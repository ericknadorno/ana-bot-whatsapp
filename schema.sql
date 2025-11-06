-- Schema para o bot Ana
-- SQLite database

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    due_ts INTEGER NULL,
    tag TEXT NULL,
    status TEXT CHECK(status IN ('open', 'done')) DEFAULT 'open',
    created_ts INTEGER NOT NULL,
    updated_ts INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_due_ts ON tasks(due_ts);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

CREATE TABLE IF NOT EXISTS meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    start_ts INTEGER NOT NULL,
    location TEXT NULL,
    attendees TEXT NULL,
    remind30 INTEGER DEFAULT 1,
    reminded INTEGER DEFAULT 0,
    created_ts INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_meetings_start_ts ON meetings(start_ts);
CREATE INDEX IF NOT EXISTS idx_meetings_reminded ON meetings(reminded);

CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'EUR',
    category TEXT NOT NULL,
    note TEXT NULL,
    ts INTEGER NOT NULL,
    created_ts INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_expenses_ts ON expenses(ts);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Inserir configurações padrão
INSERT OR IGNORE INTO settings (key, value) VALUES ('MORNING_DIGEST_HOUR', '8');
INSERT OR IGNORE INTO settings (key, value) VALUES ('MORNING_DIGEST_MINUTE', '0');
