import { DateTime } from 'luxon';
import { formatDateTime, formatTime, getRelativeLabel } from './utils/time';
import { formatCurrency } from './utils/text';

export const HELP_MESSAGE = `🤖 *Ana - Sua Assistente Pessoal*

*Tarefas:*
• add tarefa [texto] [às HH:MM] [hoje|amanhã|data] [#tag]
• minhas tarefas [hoje|amanhã|semana]
• concluir tarefa [id ou palavra-chave]
• remover tarefa [id]

*Reuniões:*
• reunião [data/hora]: [título] [@local] [com pessoa]
• listar reuniões [hoje|amanhã|semana]
• soneca [id] [15m|30m|1h]

*Despesas:*
• despesa [valor] [categoria] [descrição]
• gastos [hoje|semana|mês]

*Outros:*
• relatório [hoje|semana|mês]
• config resumo [HH:MM]
• backup

*Exemplos:*
• add tarefa pagar conta às 14h #finanças
• reunião amanhã às 10h: alinhamento @Sala 2 com João
• despesa 12.50 almoço café central
• gastos semana`;

export function taskCreatedMessage(id: number, title: string, dueTs?: number, tag?: string): string {
  let msg = `✅ Tarefa criada (#${id}): ${title}`;
  
  if (dueTs) {
    const dt = DateTime.fromMillis(dueTs);
    msg += `\n⏰ ${getRelativeLabel(dt)} às ${formatTime(dt)}`;
  }
  
  if (tag) {
    msg += `\n🏷️ #${tag}`;
  }
  
  return msg;
}

export function taskListMessage(tasks: Array<{
  id: number;
  title: string;
  due_ts: number | null;
  tag: string | null;
  status: string;
}>): string {
  if (tasks.length === 0) {
    return '📝 Nenhuma tarefa encontrada.';
  }
  
  let msg = `📝 *Suas Tarefas (${tasks.length}):*\n\n`;
  
  tasks.forEach(task => {
    const check = task.status === 'done' ? '✅' : '⬜';
    msg += `${check} #${task.id}: ${task.title}`;
    
    if (task.due_ts) {
      const dt = DateTime.fromMillis(task.due_ts);
      msg += ` - ${getRelativeLabel(dt)} ${formatTime(dt)}`;
    }
    
    if (task.tag) {
      msg += ` #${task.tag}`;
    }
    
    msg += '\n';
  });
  
  return msg.trim();
}

export function taskCompletedMessage(id: number, title: string): string {
  return `✅ Tarefa concluída (#${id}): ${title}`;
}

export function taskDeletedMessage(id: number): string {
  return `🗑️ Tarefa #${id} removida.`;
}

export function meetingCreatedMessage(id: number, title: string, startTs: number, location?: string, attendees?: string): string {
  const dt = DateTime.fromMillis(startTs);
  let msg = `📅 Reunião agendada (#${id}): ${title}\n⏰ ${getRelativeLabel(dt)} às ${formatTime(dt)}`;
  
  if (location) {
    msg += `\n📍 ${location}`;
  }
  
  if (attendees) {
    msg += `\n👥 ${attendees}`;
  }
  
  msg += '\n\n💡 Você receberá um lembrete 30 minutos antes.';
  
  return msg;
}

export function meetingListMessage(meetings: Array<{
  id: number;
  title: string;
  start_ts: number;
  location: string | null;
  attendees: string | null;
}>): string {
  if (meetings.length === 0) {
    return '📅 Nenhuma reunião agendada.';
  }
  
  let msg = `📅 *Suas Reuniões (${meetings.length}):*\n\n`;
  
  meetings.forEach(meeting => {
    const dt = DateTime.fromMillis(meeting.start_ts);
    msg += `#${meeting.id}: ${meeting.title}\n`;
    msg += `⏰ ${getRelativeLabel(dt)} às ${formatTime(dt)}`;
    
    if (meeting.location) {
      msg += `\n📍 ${meeting.location}`;
    }
    
    if (meeting.attendees) {
      msg += `\n👥 ${meeting.attendees}`;
    }
    
    msg += '\n\n';
  });
  
  return msg.trim();
}

export function meetingReminderMessage(title: string, startTs: number, location?: string, attendees?: string): string {
  const dt = DateTime.fromMillis(startTs);
  let msg = `⏰ *Lembrete de Reunião*\n\n${title}\n⏰ Em 30 minutos (${formatTime(dt)})`;
  
  if (location) {
    msg += `\n📍 ${location}`;
  }
  
  if (attendees) {
    msg += `\n👥 ${attendees}`;
  }
  
  return msg;
}

export function expenseCreatedMessage(id: number, amountCents: number, category: string, note?: string): string {
  let msg = `💰 Despesa registrada (#${id}): ${formatCurrency(amountCents)}\n📂 ${category}`;
  
  if (note) {
    msg += `\n📝 ${note}`;
  }
  
  return msg;
}

export function expensesSummaryMessage(
  total: number,
  categories: Array<{ category: string; total: number }>,
  period: string
): string {
  let msg = `💰 *Gastos (${period}):*\n\n`;
  msg += `*Total: ${formatCurrency(total)}*\n\n`;
  
  if (categories.length > 0) {
    msg += '*Por categoria:*\n';
    categories.forEach(cat => {
      msg += `• ${cat.category}: ${formatCurrency(cat.total)}\n`;
    });
  }
  
  return msg.trim();
}

export function morningDigestMessage(
  tasks: Array<{ id: number; title: string; due_ts: number | null; tag: string | null }>,
  meetings: Array<{ id: number; title: string; start_ts: number; location: string | null }>
): string {
  let msg = `☀️ *Bom dia!*\n\nAqui está o seu plano para hoje:\n\n`;
  
  if (tasks.length > 0) {
    msg += `📝 *Tarefas (${tasks.length}):*\n`;
    tasks.forEach(task => {
      msg += `• #${task.id}: ${task.title}`;
      if (task.due_ts) {
        const dt = DateTime.fromMillis(task.due_ts);
        msg += ` - ${formatTime(dt)}`;
      }
      if (task.tag) {
        msg += ` #${task.tag}`;
      }
      msg += '\n';
    });
    msg += '\n';
  }
  
  if (meetings.length > 0) {
    msg += `📅 *Reuniões (${meetings.length}):*\n`;
    meetings.forEach(meeting => {
      const dt = DateTime.fromMillis(meeting.start_ts);
      msg += `• ${formatTime(dt)} - ${meeting.title}`;
      if (meeting.location) {
        msg += ` @${meeting.location}`;
      }
      msg += '\n';
    });
    msg += '\n';
  }
  
  if (tasks.length === 0 && meetings.length === 0) {
    msg += `Nada agendado para hoje. Aproveite seu dia! 🌟\n\n`;
  }
  
  msg += `💡 Dica: responda "minhas tarefas" ou "listar reuniões" a qualquer momento.`;
  
  return msg;
}

export function configUpdatedMessage(key: string, value: string): string {
  return `⚙️ Configuração atualizada: ${key} = ${value}`;
}

export function snoozeMessage(id: number, newTime: DateTime): string {
  return `⏰ Lembrete adiado para ${getRelativeLabel(newTime)} às ${formatTime(newTime)}`;
}

export function errorMessage(error: string): string {
  return `❌ Erro: ${error}\n\nDigite "ajuda" para ver os comandos disponíveis.`;
}

export function unknownCommandMessage(): string {
  return `🤔 Não entendi o comando.\n\nDigite "ajuda" para ver os comandos disponíveis.`;
}
