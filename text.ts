export function extractTags(text: string): string[] {
  const regex = /#(\w+)/g;
  const matches = text.match(regex);
  return matches ? matches.map(m => m.substring(1)) : [];
}

export function removeTags(text: string): string {
  return text.replace(/#\w+/g, '').trim();
}

export function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

export function extractLocation(text: string): string | null {
  const regex = /@([^@]+?)(?:\s|$)/;
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

export function removeLocation(text: string): string {
  return text.replace(/@[^\s]+/g, '').trim();
}

export function extractAttendees(text: string): string[] {
  const regex = /com\s+([^@#]+?)(?:\s@|\s#|$)/i;
  const match = text.match(regex);
  if (!match) return [];
  
  return match[1]
    .split(/[,e]/)
    .map(a => a.trim())
    .filter(a => a.length > 0);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function parseAmount(text: string): number | null {
  const cleaned = text.replace(/,/g, '.');
  const match = cleaned.match(/\d+\.?\d*/);
  if (!match) return null;
  
  const value = parseFloat(match[0]);
  return isNaN(value) ? null : Math.round(value * 100); // Convert to cents
}

export function formatCurrency(amountCents: number, currency: string = 'EUR'): string {
  const amount = amountCents / 100;
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function splitCommand(text: string): { command: string; args: string } {
  const parts = text.trim().split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');
  return { command, args };
}
