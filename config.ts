import { SettingsRepository } from '../db/repositories';
import { parseTimeConfig } from '../parsers';
import { configUpdatedMessage, errorMessage } from '../messages';

export async function handleConfigDigest(
  repo: SettingsRepository,
  text: string,
  onUpdate?: () => void
): Promise<string> {
  const parsed = parseTimeConfig(text);
  
  if (!parsed) {
    return errorMessage('Formato inválido. Exemplo: config resumo 07:30');
  }
  
  try {
    repo.setDigestTime(parsed.hour, parsed.minute);
    
    // Chamar callback para atualizar os cron jobs
    if (onUpdate) {
      onUpdate();
    }
    
    const timeStr = `${parsed.hour.toString().padStart(2, '0')}:${parsed.minute.toString().padStart(2, '0')}`;
    return configUpdatedMessage('horário do resumo diário', timeStr);
  } catch (error) {
    return errorMessage('Erro ao atualizar configuração.');
  }
}
