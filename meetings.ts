import { MeetingRepository } from '../db/repositories';
import { parseMeeting, parsePeriod, parseSnooze } from '../parsers';
import { addMinutes, dateTimeToTimestamp, timestampToDateTime } from '../utils/time';
import {
  meetingCreatedMessage,
  meetingListMessage,
  snoozeMessage,
  errorMessage
} from '../messages';

export async function handleCreateMeeting(repo: MeetingRepository, text: string): Promise<string> {
  const parsed = parseMeeting(text);
  
  if (!parsed) {
    return errorMessage('Não consegui entender a reunião. Exemplo: reunião amanhã às 10h: alinhamento @Sala 2 com João');
  }
  
  try {
    const meeting = repo.create(
      parsed.title,
      parsed.startTs,
      parsed.location,
      parsed.attendees
    );
    
    return meetingCreatedMessage(
      meeting.id,
      meeting.title,
      meeting.start_ts,
      meeting.location || undefined,
      meeting.attendees || undefined
    );
  } catch (error) {
    return errorMessage('Erro ao criar reunião.');
  }
}

export async function handleListMeetings(repo: MeetingRepository, text: string): Promise<string> {
  try {
    let startTs: number | undefined;
    let endTs: number | undefined;
    
    if (text.trim()) {
      const period = parsePeriod(text);
      startTs = period.startTs;
      endTs = period.endTs;
    }
    
    const meetings = repo.list(startTs, endTs);
    return meetingListMessage(meetings);
  } catch (error) {
    return errorMessage('Erro ao listar reuniões.');
  }
}

export async function handleSnoozeMeeting(repo: MeetingRepository, text: string): Promise<string> {
  // Formato: soneca [id] [15m|30m|1h]
  const parts = text.trim().split(/\s+/);
  
  if (parts.length < 2) {
    return errorMessage('Informe o ID e o tempo. Exemplo: soneca 5 30m');
  }
  
  const idMatch = parts[0].match(/\d+/);
  if (!idMatch) {
    return errorMessage('Informe o ID da reunião. Exemplo: soneca 5 30m');
  }
  
  const id = parseInt(idMatch[0], 10);
  
  try {
    const meeting = repo.findById(id);
    
    if (!meeting) {
      return errorMessage(`Reunião #${id} não encontrada.`);
    }
    
    const snooze = parseSnooze(parts.slice(1).join(' '));
    
    if (!snooze) {
      return errorMessage('Tempo inválido. Use 15m, 30m ou 1h');
    }
    
    const currentStart = timestampToDateTime(meeting.start_ts);
    const newStart = addMinutes(currentStart, snooze.minutes);
    const newStartTs = dateTimeToTimestamp(newStart);
    
    repo.updateStartTime(id, newStartTs);
    
    return snoozeMessage(id, newStart);
  } catch (error) {
    return errorMessage('Erro ao adiar reunião.');
  }
}
