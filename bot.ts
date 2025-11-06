import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import Database from 'better-sqlite3';
import {
  TaskRepository,
  MeetingRepository,
  ExpenseRepository,
  SettingsRepository
} from './db/repositories';
import { handleAddTask, handleListTasks, handleCompleteTask, handleDeleteTask } from './commands/tasks';
import { handleCreateMeeting, handleListMeetings, handleSnoozeMeeting } from './commands/meetings';
import { handleAddExpense, handleListExpenses, handleReport, handleBackup } from './commands/expenses';
import { handleConfigDigest } from './commands/config';
import { HELP_MESSAGE, unknownCommandMessage, errorMessage } from './messages';
import { normalizeText, splitCommand } from './utils/text';
import { logger } from './index';
import { Scheduler } from './scheduler';

export class AnaBot {
  private client: Client;
  private taskRepo: TaskRepository;
  private meetingRepo: MeetingRepository;
  private expenseRepo: ExpenseRepository;
  private settingsRepo: SettingsRepository;
  private scheduler: Scheduler;
  private ownerNumber: string | null;
  private processedMessages: Set<string> = new Set();
  
  constructor(db: Database.Database, ownerNumber: string | null) {
    this.ownerNumber = ownerNumber;
    
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });
    
    this.taskRepo = new TaskRepository(db);
    this.meetingRepo = new MeetingRepository(db);
    this.expenseRepo = new ExpenseRepository(db);
    this.settingsRepo = new SettingsRepository(db);
    
    this.scheduler = new Scheduler(
      this.client,
      this.ownerNumber,
      this.taskRepo,
      this.meetingRepo,
      this.settingsRepo
    );
    
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    this.client.on('qr', (qr) => {
      const qrcode = require('qrcode-terminal');
      console.log('\n🔐 Escaneie o QR code com o WhatsApp:\n');
      qrcode.generate(qr, { small: true });
      logger.info('QR code generated');
    });
    
    this.client.on('authenticated', () => {
      logger.info('WhatsApp authenticated');
    });
    
    this.client.on('ready', () => {
      logger.info('WhatsApp client ready');
      this.scheduler.start();
    });
    
    this.client.on('auth_failure', (msg) => {
      logger.error({ msg }, 'WhatsApp authentication failure');
    });
    
    this.client.on('disconnected', (reason) => {
      logger.warn({ reason }, 'WhatsApp client disconnected');
      this.scheduler.stop();
    });
    
    this.client.on('message', async (message) => {
      await this.handleMessage(message);
    });
  }
  
  async start() {
    logger.info('Starting WhatsApp client...');
    await this.client.initialize();
  }
  
  async stop() {
    logger.info('Stopping WhatsApp client...');
    this.scheduler.stop();
    await this.client.destroy();
  }
  
  private async handleMessage(message: Message) {
    try {
      // Ignorar mensagens de grupos
      const chat = await message.getChat();
      if (chat.isGroup) {
        return;
      }
      
      // Verificar se é do proprietário (se configurado)
      if (this.ownerNumber && message.from !== this.ownerNumber) {
        logger.debug({ from: message.from }, 'Message from non-owner ignored');
        return;
      }
      
      // Evitar processar a mesma mensagem duas vezes
      if (this.processedMessages.has(message.id._serialized)) {
        return;
      }
      
      this.processedMessages.add(message.id._serialized);
      
      // Limpar cache de mensagens processadas (manter últimas 100)
      if (this.processedMessages.size > 100) {
        const toDelete = Array.from(this.processedMessages).slice(0, 50);
        toDelete.forEach(id => this.processedMessages.delete(id));
      }
      
      const text = message.body.trim();
      
      if (!text) {
        return;
      }
      
      logger.info({ from: message.from, text }, 'Processing message');
      
      const response = await this.processCommand(text);
      
      if (response) {
        await message.reply(response);
        logger.debug({ response: response.substring(0, 100) }, 'Response sent');
      }
    } catch (error) {
      logger.error({ error }, 'Error handling message');
      try {
        await message.reply(errorMessage('Ocorreu um erro ao processar sua mensagem.'));
      } catch (replyError) {
        logger.error({ error: replyError }, 'Error sending error message');
      }
    }
  }
  
  private async processCommand(text: string): Promise<string> {
    const normalized = normalizeText(text);
    
    // Ajuda
    if (normalized === 'ajuda' || normalized === 'help') {
      return HELP_MESSAGE;
    }
    
    // Adicionar tarefa
    if (
      normalized.startsWith('add tarefa') ||
      normalized.startsWith('adicionar tarefa') ||
      normalized.startsWith('criar tarefa')
    ) {
      const args = text.substring(text.indexOf('tarefa') + 6).trim();
      return await handleAddTask(this.taskRepo, args);
    }
    
    // Listar tarefas
    if (
      normalized.startsWith('minhas tarefas') ||
      normalized.startsWith('listar tarefas') ||
      normalized === 'tarefas'
    ) {
      const args = text.replace(/^(minhas|listar)?\s*tarefas/i, '').trim();
      return await handleListTasks(this.taskRepo, args);
    }
    
    // Concluir tarefa
    if (
      normalized.startsWith('concluir tarefa') ||
      normalized.startsWith('completar tarefa') ||
      normalized.startsWith('finalizar tarefa')
    ) {
      const args = text.replace(/^(concluir|completar|finalizar)\s+tarefa\s*/i, '').trim();
      return await handleCompleteTask(this.taskRepo, args);
    }
    
    // Remover tarefa
    if (
      normalized.startsWith('remover tarefa') ||
      normalized.startsWith('deletar tarefa') ||
      normalized.startsWith('excluir tarefa')
    ) {
      const args = text.replace(/^(remover|deletar|excluir)\s+tarefa\s*/i, '').trim();
      return await handleDeleteTask(this.taskRepo, args);
    }
    
    // Criar reunião
    if (
      normalized.startsWith('reunião') ||
      normalized.startsWith('reuniao') ||
      normalized.startsWith('meeting')
    ) {
      const args = text.replace(/^(reunião|reuniao|meeting)\s*/i, '').trim();
      return await handleCreateMeeting(this.meetingRepo, args);
    }
    
    // Listar reuniões
    if (
      normalized.startsWith('listar reuniões') ||
      normalized.startsWith('listar reunioes') ||
      normalized.startsWith('minhas reuniões') ||
      normalized.startsWith('minhas reunioes') ||
      normalized === 'reuniões' ||
      normalized === 'reunioes'
    ) {
      const args = text.replace(/^(listar|minhas)?\s*(reuniões|reunioes)/i, '').trim();
      return await handleListMeetings(this.meetingRepo, args);
    }
    
    // Soneca (snooze)
    if (normalized.startsWith('soneca') || normalized.startsWith('adiar')) {
      const args = text.replace(/^(soneca|adiar)\s*/i, '').trim();
      return await handleSnoozeMeeting(this.meetingRepo, args);
    }
    
    // Adicionar despesa
    if (
      normalized.startsWith('despesa') ||
      normalized.startsWith('gasto') ||
      normalized.startsWith('expense')
    ) {
      const args = text.replace(/^(despesa|gasto|expense)\s*/i, '').trim();
      return await handleAddExpense(this.expenseRepo, args);
    }
    
    // Listar gastos
    if (
      normalized.startsWith('gastos') ||
      normalized.startsWith('despesas') ||
      normalized.startsWith('expenses')
    ) {
      const args = text.replace(/^(gastos|despesas|expenses)\s*/i, '').trim();
      return await handleListExpenses(this.expenseRepo, args);
    }
    
    // Relatório
    if (
      normalized.startsWith('relatório') ||
      normalized.startsWith('relatorio') ||
      normalized.startsWith('report')
    ) {
      const args = text.replace(/^(relatório|relatorio|report)\s*/i, '').trim();
      return await handleReport(
        this.taskRepo,
        this.meetingRepo,
        this.expenseRepo,
        args
      );
    }
    
    // Backup
    if (normalized === 'backup') {
      return await handleBackup(this.taskRepo, this.expenseRepo);
    }
    
    // Configurar resumo
    if (normalized.startsWith('config resumo') || normalized.startsWith('configurar resumo')) {
      const args = text.replace(/^config(urar)?\s+resumo\s*/i, '').trim();
      return await handleConfigDigest(
        this.settingsRepo,
        args,
        () => this.scheduler.restart()
      );
    }
    
    // Comando não reconhecido
    return unknownCommandMessage();
  }
}
