import { parseDateTime, nowInLisbon, addMinutes, dateTimeToTimestamp } from './utils/time';
import { extractTags, removeTags, extractLocation, removeLocation, extractAttendees, parseAmount } from './utils/text';

export interface ParsedTask {
  title: string;
  dueTs: number | null;
  tag: string | null;
}

export interface ParsedMeeting {
  title: string;
  startTs: number;
  location: string | null;
  attendees: string | null;
}

export interface ParsedExpense {
  amountCents: number;
  category: string;
  note: string | null;
}

export interface ParsedSnooze {
  minutes: number;
}

export function parseTask(text: string): ParsedTask | null {
  // Extrair tags
  const tags = extractTags(text);
  const tag = tags.length > 0 ? tags[0] : null;
  
  // Remover tags do texto
  let cleanText = removeTags(text);
  
  // Tentar extrair data/hora
  let dueTs: number | null = null;
  const dateTime = parseDateTime(cleanText);
  if (dateTime) {
    dueTs = dateTimeToTimestamp(dateTime);
  }
  
  // Limpar texto para pegar apenas o título
  // Remover expressões temporais comuns
  cleanText = cleanText
    .replace(/\b(hoje|amanhã|às|dia|semana|próxim[ao])\s+\d{1,2}(:\d{2})?\b/gi, '')
    .replace(/\b\d{1,2}(:\d{2})?\s*(h|horas?)?\b/gi, '')
    .replace(/\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/gi, '')
    .trim();
  
  if (!cleanText) {
    return null;
  }
  
  return {
    title: cleanText,
    dueTs,
    tag
  };
}

export function parseMeeting(text: string): ParsedMeeting | null {
  // Formato esperado: [data/hora]: título [@local] [com pessoas]
  
  // Separar por ":"
  const colonIndex = text.indexOf(':');
  if (colonIndex === -1) {
    return null;
  }
  
  const dateTimePart = text.substring(0, colonIndex).trim();
  let descriptionPart = text.substring(colonIndex + 1).trim();
  
  // Parse da data/hora
  const dateTime = parseDateTime(dateTimePart);
  if (!dateTime) {
    return null;
  }
  
  // Extrair local
  const location = extractLocation(descriptionPart);
  descriptionPart = removeLocation(descriptionPart);
  
  // Extrair participantes
  const attendees = extractAttendees(descriptionPart);
  const attendeesStr = attendees.length > 0 ? attendees.join(', ') : null;
  
  // Remover "com ..." do título
  const title = descriptionPart.replace(/\s+com\s+[^@#]+$/i, '').trim();
  
  if (!title) {
    return null;
  }
  
  return {
    title,
    startTs: dateTimeToTimestamp(dateTime),
    location,
    attendees: attendeesStr
  };
}

export function parseExpense(text: string): ParsedExpense | null {
  // Formato esperado: [valor] [categoria] [descrição opcional]
  
  const parts = text.trim().split(/\s+/);
  
  if (parts.length < 2) {
    return null;
  }
  
  // Parse do valor
  const amountCents = parseAmount(parts[0]);
  if (amountCents === null || amountCents <= 0) {
    return null;
  }
  
  // Categoria é o segundo token
  const category = parts[1];
  
  // Descrição é o resto
  const note = parts.slice(2).join(' ') || null;
  
  return {
    amountCents,
    category,
    note
  };
}

export function parseSnooze(text: string): ParsedSnooze | null {
  const normalized = text.toLowerCase().trim();
  
  if (normalized.includes('15') && normalized.includes('m')) {
    return { minutes: 15 };
  }
  
  if (normalized.includes('30') && normalized.includes('m')) {
    return { minutes: 30 };
  }
  
  if (normalized.includes('1') && normalized.includes('h')) {
    return { minutes: 60 };
  }
  
  return null;
}

export function parseTimeConfig(text: string): { hour: number; minute: number } | null {
  // Formato esperado: HH:MM
  const match = text.match(/(\d{1,2}):(\d{2})/);
  
  if (!match) {
    return null;
  }
  
  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }
  
  return { hour, minute };
}

export function parsePeriod(text: string): { startTs: number; endTs: number } {
  const now = nowInLisbon();
  const normalized = text.toLowerCase().trim();
  
  if (normalized.includes('hoje')) {
    return {
      startTs: dateTimeToTimestamp(now.startOf('day')),
      endTs: dateTimeToTimestamp(now.endOf('day'))
    };
  }
  
  if (normalized.includes('amanhã') || normalized.includes('amanha')) {
    const tomorrow = now.plus({ days: 1 });
    return {
      startTs: dateTimeToTimestamp(tomorrow.startOf('day')),
      endTs: dateTimeToTimestamp(tomorrow.endOf('day'))
    };
  }
  
  if (normalized.includes('semana')) {
    return {
      startTs: dateTimeToTimestamp(now.startOf('week')),
      endTs: dateTimeToTimestamp(now.endOf('week'))
    };
  }
  
  if (normalized.includes('mês') || normalized.includes('mes')) {
    return {
      startTs: dateTimeToTimestamp(now.startOf('month')),
      endTs: dateTimeToTimestamp(now.endOf('month'))
    };
  }
  
  // Padrão: hoje
  return {
    startTs: dateTimeToTimestamp(now.startOf('day')),
    endTs: dateTimeToTimestamp(now.endOf('day'))
  };
}
