import { ExpenseRepository, TaskRepository, MeetingRepository } from '../db/repositories';
import { parseExpense, parsePeriod } from '../parsers';
import { expenseCreatedMessage, expensesSummaryMessage, errorMessage } from '../messages';
import { DateTime } from 'luxon';
import { formatCurrency } from '../utils/text';
import { nowInLisbon, startOfDay, endOfDay, dateTimeToTimestamp } from '../utils/time';

export async function handleAddExpense(repo: ExpenseRepository, text: string): Promise<string> {
  const parsed = parseExpense(text);
  
  if (!parsed) {
    return errorMessage('Não consegui entender a despesa. Exemplo: despesa 12.50 almoço café central');
  }
  
  try {
    const expense = repo.create(
      parsed.amountCents,
      parsed.category,
      parsed.note
    );
    
    return expenseCreatedMessage(
      expense.id,
      expense.amount_cents,
      expense.category,
      expense.note || undefined
    );
  } catch (error) {
    return errorMessage('Erro ao registrar despesa.');
  }
}

export async function handleListExpenses(repo: ExpenseRepository, text: string): Promise<string> {
  try {
    const period = parsePeriod(text);
    
    const total = repo.getTotalByPeriod(period.startTs, period.endTs);
    const categories = repo.getCategorySummary(period.startTs, period.endTs);
    
    let periodLabel = 'hoje';
    if (text.includes('semana')) {
      periodLabel = 'esta semana';
    } else if (text.includes('mês') || text.includes('mes')) {
      periodLabel = 'este mês';
    }
    
    return expensesSummaryMessage(total, categories, periodLabel);
  } catch (error) {
    return errorMessage('Erro ao listar gastos.');
  }
}

export async function handleReport(
  taskRepo: TaskRepository,
  meetingRepo: MeetingRepository,
  expenseRepo: ExpenseRepository,
  text: string
): Promise<string> {
  try {
    const period = parsePeriod(text);
    
    let periodLabel = 'hoje';
    if (text.includes('semana')) {
      periodLabel = 'esta semana';
    } else if (text.includes('mês') || text.includes('mes')) {
      periodLabel = 'este mês';
    }
    
    // Tarefas concluídas
    const completedTasks = taskRepo.list('done', period.startTs, period.endTs);
    
    // Tarefas pendentes
    const openTasks = taskRepo.list('open', period.startTs, period.endTs);
    
    // Reuniões
    const meetings = meetingRepo.list(period.startTs, period.endTs);
    
    // Despesas
    const totalExpenses = expenseRepo.getTotalByPeriod(period.startTs, period.endTs);
    const topCategories = expenseRepo.getCategorySummary(period.startTs, period.endTs).slice(0, 5);
    
    let msg = `📊 *Relatório (${periodLabel}):*\n\n`;
    
    // Tarefas
    msg += `📝 *Tarefas:*\n`;
    msg += `• Concluídas: ${completedTasks.length}\n`;
    msg += `• Pendentes: ${openTasks.length}\n\n`;
    
    // Reuniões
    msg += `📅 *Reuniões:* ${meetings.length}\n\n`;
    
    // Despesas
    msg += `💰 *Despesas:*\n`;
    msg += `• Total: ${formatCurrency(totalExpenses)}\n`;
    
    if (topCategories.length > 0) {
      msg += `• Top categorias:\n`;
      topCategories.forEach(cat => {
        msg += `  - ${cat.category}: ${formatCurrency(cat.total)}\n`;
      });
    }
    
    return msg.trim();
  } catch (error) {
    return errorMessage('Erro ao gerar relatório.');
  }
}

export async function handleBackup(
  taskRepo: TaskRepository,
  expenseRepo: ExpenseRepository
): Promise<string> {
  try {
    const now = nowInLisbon();
    const ninetyDaysAgo = now.minus({ days: 90 });
    
    // Buscar tarefas dos últimos 90 dias
    const tasks = taskRepo.list(undefined, dateTimeToTimestamp(ninetyDaysAgo), dateTimeToTimestamp(now));
    
    // Buscar despesas dos últimos 90 dias
    const expenses = expenseRepo.list(dateTimeToTimestamp(ninetyDaysAgo), dateTimeToTimestamp(now));
    
    let csv = '📋 *Backup (últimos 90 dias)*\n\n';
    
    csv += '*TAREFAS*\n';
    csv += 'ID,Título,Status,Tag,Data de Vencimento\n';
    tasks.forEach(task => {
      const dueDate = task.due_ts 
        ? DateTime.fromMillis(task.due_ts).toFormat('dd/MM/yyyy HH:mm')
        : 'N/A';
      csv += `${task.id},"${task.title}",${task.status},${task.tag || 'N/A'},${dueDate}\n`;
    });
    
    csv += '\n*DESPESAS*\n';
    csv += 'ID,Valor,Categoria,Descrição,Data\n';
    expenses.forEach(expense => {
      const date = DateTime.fromMillis(expense.ts).toFormat('dd/MM/yyyy HH:mm');
      const value = (expense.amount_cents / 100).toFixed(2);
      csv += `${expense.id},${value},${expense.category},"${expense.note || ''}",${date}\n`;
    });
    
    return csv;
  } catch (error) {
    return errorMessage('Erro ao gerar backup.');
  }
}
