import * as cron from 'node-cron';
import { Client } from 'whatsapp-web.js';
import {
  TaskRepository,
  MeetingRepository,
  SettingsRepository
} from './db/repositories';
import {
  nowInLisbon,
  startOfDay,
  endOfDay,
  dateTimeToTimestamp,
  addMinutes,
  timestampToDateTime
} from './utils/time';
import { morningDigestMessage, meetingReminderMessage } from './messages';
import { logger } from './index';

export class Scheduler {
  private digestJob: cron.ScheduledTask | null = null;
  private reminderJob: cron.ScheduledTask | null = null;
  
  constructor(
    private client: Client,
    private ownerNumber: string | null,
    private taskRepo: TaskRepository,
    private meetingRepo: MeetingRepository,
    private settingsRepo: SettingsRepository
  ) {}
  
  start() {
    this.scheduleDigest();
    this.scheduleReminders();
    logger.info('Scheduler started');
  }
  
  stop() {
    if (this.digestJob) {
      this.digestJob.stop();
      this.digestJob = null;
    }
    
    if (this.reminderJob) {
      this.reminderJob.stop();
      this.reminderJob = null;
    }
    
    logger.info('Scheduler stopped');
  }
  
  restart() {
    this.stop();
    this.start();
  }
  
  private scheduleDigest() {
    const { hour, minute } = this.settingsRepo.getDigestTime();
    
    // Cron expression: minute hour * * *
    const cronExpr = `${minute} ${hour} * * *`;
    
    logger.info({ cronExpr, hour, minute }, 'Scheduling morning digest');
    
    this.digestJob = cron.schedule(
      cronExpr,
      () => this.sendMorningDigest(),
      {
        timezone: 'Europe/Lisbon'
      }
    );
  }
  
  private scheduleReminders() {
    // Rodar a cada minuto
    this.reminderJob = cron.schedule(
      '* * * * *',
      () => this.checkReminders(),
      {
        timezone: 'Europe/Lisbon'
      }
    );
  }
  
  private async sendMorningDigest() {
    try {
      if (!this.ownerNumber) {
        logger.warn('No owner number configured, skipping digest');
        return;
      }
      
      const now = nowInLisbon();
      const startTs = dateTimeToTimestamp(startOfDay(now));
      const endTs = dateTimeToTimestamp(endOfDay(now));
      
      // Buscar tarefas do dia
      const tasks = this.taskRepo.list('open', startTs, endTs);
      
      // Buscar reuniões do dia
      const meetings = this.meetingRepo.list(startTs, endTs);
      
      const message = morningDigestMessage(tasks, meetings);
      
      await this.client.sendMessage(this.ownerNumber, message);
      
      logger.info({ tasksCount: tasks.length, meetingsCount: meetings.length }, 'Morning digest sent');
    } catch (error) {
      logger.error({ error }, 'Error sending morning digest');
    }
  }
  
  private async checkReminders() {
    try {
      if (!this.ownerNumber) {
        return;
      }
      
      const now = nowInLisbon();
      const nowTs = dateTimeToTimestamp(now);
      
      // Buscar reuniões que começam nos próximos 30 minutos
      const futureTime = addMinutes(now, 31); // 31 minutos para garantir cobertura
      const futureTs = dateTimeToTimestamp(futureTime);
      
      const upcomingMeetings = this.meetingRepo.findUpcomingReminders(nowTs, futureTs);
      
      for (const meeting of upcomingMeetings) {
        const meetingStart = timestampToDateTime(meeting.start_ts);
        const reminderTime = addMinutes(meetingStart, -30);
        
        // Verificar se já é hora de enviar o lembrete
        if (now >= reminderTime && now < meetingStart) {
          await this.sendReminder(meeting);
          this.meetingRepo.markReminded(meeting.id);
          
          logger.info({ meetingId: meeting.id, title: meeting.title }, 'Reminder sent');
        }
      }
    } catch (error) {
      logger.error({ error }, 'Error checking reminders');
    }
  }
  
  private async sendReminder(meeting: {
    id: number;
    title: string;
    start_ts: number;
    location: string | null;
    attendees: string | null;
  }) {
    try {
      if (!this.ownerNumber) {
        return;
      }
      
      const message = meetingReminderMessage(
        meeting.title,
        meeting.start_ts,
        meeting.location || undefined,
        meeting.attendees || undefined
      );
      
      await this.client.sendMessage(this.ownerNumber, message);
    } catch (error) {
      logger.error({ error, meetingId: meeting.id }, 'Error sending reminder');
    }
  }
}
