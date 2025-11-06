import Database from 'better-sqlite3';
import { nowInLisbon, dateTimeToTimestamp } from '../utils/time';

export interface Task {
  id: number;
  title: string;
  due_ts: number | null;
  tag: string | null;
  status: 'open' | 'done';
  created_ts: number;
  updated_ts: number;
}

export interface Meeting {
  id: number;
  title: string;
  start_ts: number;
  location: string | null;
  attendees: string | null;
  remind30: number;
  reminded: number;
  created_ts: number;
}

export interface Expense {
  id: number;
  amount_cents: number;
  currency: string;
  category: string;
  note: string | null;
  ts: number;
  created_ts: number;
}

export class TaskRepository {
  constructor(private db: Database.Database) {}

  create(title: string, dueTs: number | null, tag: string | null): Task {
    const now = dateTimeToTimestamp(nowInLisbon());
    const stmt = this.db.prepare(
      'INSERT INTO tasks (title, due_ts, tag, status, created_ts, updated_ts) VALUES (?, ?, ?, ?, ?, ?)'
    );
    
    const result = stmt.run(title, dueTs, tag, 'open', now, now);
    
    return {
      id: result.lastInsertRowid as number,
      title,
      due_ts: dueTs,
      tag,
      status: 'open',
      created_ts: now,
      updated_ts: now
    };
  }

  findById(id: number): Task | null {
    const stmt = this.db.prepare('SELECT * FROM tasks WHERE id = ?');
    return stmt.get(id) as Task | null;
  }

  findByKeyword(keyword: string): Task | null {
    const stmt = this.db.prepare(
      'SELECT * FROM tasks WHERE title LIKE ? AND status = ? ORDER BY created_ts DESC LIMIT 1'
    );
    return stmt.get(`%${keyword}%`, 'open') as Task | null;
  }

  list(status?: 'open' | 'done', startTs?: number, endTs?: number): Task[] {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (startTs !== undefined) {
      query += ' AND (due_ts >= ? OR due_ts IS NULL)';
      params.push(startTs);
    }
    
    if (endTs !== undefined) {
      query += ' AND (due_ts <= ? OR due_ts IS NULL)';
      params.push(endTs);
    }
    
    query += ' ORDER BY due_ts ASC NULLS LAST, created_ts DESC';
    
    const stmt = this.db.prepare(query);
    return stmt.all(...params) as Task[];
  }

  complete(id: number): boolean {
    const now = dateTimeToTimestamp(nowInLisbon());
    const stmt = this.db.prepare(
      'UPDATE tasks SET status = ?, updated_ts = ? WHERE id = ? AND status = ?'
    );
    const result = stmt.run('done', now, id, 'open');
    return result.changes > 0;
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  updateDueTime(id: number, newDueTs: number): boolean {
    const now = dateTimeToTimestamp(nowInLisbon());
    const stmt = this.db.prepare(
      'UPDATE tasks SET due_ts = ?, updated_ts = ? WHERE id = ?'
    );
    const result = stmt.run(newDueTs, now, id);
    return result.changes > 0;
  }
}

export class MeetingRepository {
  constructor(private db: Database.Database) {}

  create(
    title: string,
    startTs: number,
    location: string | null,
    attendees: string | null
  ): Meeting {
    const now = dateTimeToTimestamp(nowInLisbon());
    const stmt = this.db.prepare(
      'INSERT INTO meetings (title, start_ts, location, attendees, remind30, reminded, created_ts) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    
    const result = stmt.run(title, startTs, location, attendees, 1, 0, now);
    
    return {
      id: result.lastInsertRowid as number,
      title,
      start_ts: startTs,
      location,
      attendees,
      remind30: 1,
      reminded: 0,
      created_ts: now
    };
  }

  findById(id: number): Meeting | null {
    const stmt = this.db.prepare('SELECT * FROM meetings WHERE id = ?');
    return stmt.get(id) as Meeting | null;
  }

  list(startTs?: number, endTs?: number): Meeting[] {
    let query = 'SELECT * FROM meetings WHERE 1=1';
    const params: any[] = [];
    
    if (startTs !== undefined) {
      query += ' AND start_ts >= ?';
      params.push(startTs);
    }
    
    if (endTs !== undefined) {
      query += ' AND start_ts <= ?';
      params.push(endTs);
    }
    
    query += ' ORDER BY start_ts ASC';
    
    const stmt = this.db.prepare(query);
    return stmt.all(...params) as Meeting[];
  }

  findUpcomingReminders(nowTs: number, futureTs: number): Meeting[] {
    const stmt = this.db.prepare(
      'SELECT * FROM meetings WHERE remind30 = 1 AND reminded = 0 AND start_ts > ? AND start_ts <= ? ORDER BY start_ts ASC'
    );
    return stmt.all(nowTs, futureTs) as Meeting[];
  }

  markReminded(id: number): boolean {
    const stmt = this.db.prepare('UPDATE meetings SET reminded = 1 WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  updateStartTime(id: number, newStartTs: number): boolean {
    const stmt = this.db.prepare('UPDATE meetings SET start_ts = ?, reminded = 0 WHERE id = ?');
    const result = stmt.run(newStartTs, id);
    return result.changes > 0;
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM meetings WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export class ExpenseRepository {
  constructor(private db: Database.Database) {}

  create(
    amountCents: number,
    category: string,
    note: string | null,
    ts?: number
  ): Expense {
    const now = dateTimeToTimestamp(nowInLisbon());
    const expenseTs = ts || now;
    
    const stmt = this.db.prepare(
      'INSERT INTO expenses (amount_cents, currency, category, note, ts, created_ts) VALUES (?, ?, ?, ?, ?, ?)'
    );
    
    const result = stmt.run(amountCents, 'EUR', category, note, expenseTs, now);
    
    return {
      id: result.lastInsertRowid as number,
      amount_cents: amountCents,
      currency: 'EUR',
      category,
      note,
      ts: expenseTs,
      created_ts: now
    };
  }

  list(startTs?: number, endTs?: number): Expense[] {
    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params: any[] = [];
    
    if (startTs !== undefined) {
      query += ' AND ts >= ?';
      params.push(startTs);
    }
    
    if (endTs !== undefined) {
      query += ' AND ts <= ?';
      params.push(endTs);
    }
    
    query += ' ORDER BY ts DESC';
    
    const stmt = this.db.prepare(query);
    return stmt.all(...params) as Expense[];
  }

  getTotalByPeriod(startTs: number, endTs: number): number {
    const stmt = this.db.prepare(
      'SELECT COALESCE(SUM(amount_cents), 0) as total FROM expenses WHERE ts >= ? AND ts <= ?'
    );
    const result = stmt.get(startTs, endTs) as { total: number };
    return result.total;
  }

  getCategorySummary(startTs: number, endTs: number): Array<{ category: string; total: number }> {
    const stmt = this.db.prepare(
      'SELECT category, SUM(amount_cents) as total FROM expenses WHERE ts >= ? AND ts <= ? GROUP BY category ORDER BY total DESC'
    );
    return stmt.all(startTs, endTs) as Array<{ category: string; total: number }>;
  }
}

export class SettingsRepository {
  constructor(private db: Database.Database) {}

  get(key: string): string | null {
    const stmt = this.db.prepare('SELECT value FROM settings WHERE key = ?');
    const result = stmt.get(key) as { value: string } | undefined;
    return result?.value || null;
  }

  set(key: string, value: string): void {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)'
    );
    stmt.run(key, value);
  }

  getDigestTime(): { hour: number; minute: number } {
    const hour = parseInt(this.get('MORNING_DIGEST_HOUR') || '8', 10);
    const minute = parseInt(this.get('MORNING_DIGEST_MINUTE') || '0', 10);
    return { hour, minute };
  }

  setDigestTime(hour: number, minute: number): void {
    this.set('MORNING_DIGEST_HOUR', hour.toString());
    this.set('MORNING_DIGEST_MINUTE', minute.toString());
  }
}
