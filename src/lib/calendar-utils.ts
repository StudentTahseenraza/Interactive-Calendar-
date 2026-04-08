export interface CalendarNote {
  id: string;
  text: string;
  type: 'date' | 'range' | 'month';
  date?: string; // YYYY-MM-DD
  startDate?: string;
  endDate?: string;
  month?: string; // YYYY-MM
  color?: string;
  createdAt: string;
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const HOLIDAYS: Record<string, string> = {
  // January
  '01-01': "🎆 New Year's Day",
  '01-06': '👑 Epiphany',
  '01-15': '✊ MLK Jr. Day',
  '01-26': '🇮🇳 Republic Day (India)',
  // February
  '02-02': '🐿️ Groundhog Day',
  '02-14': "💕 Valentine's Day",
  // March
  '03-08': "👩 Int'l Women's Day",
  '03-17': "🍀 St. Patrick's Day",
  '03-20': '🌸 Spring Equinox',
  '03-21': '🎨 Holi',
  '03-25': '🇬🇷 Greek Independence',
  // April
  '04-01': "🤡 April Fools' Day",
  '04-22': '🌍 Earth Day',
  // May
  '05-01': '⚒️ May Day / Labor Day',
  '05-05': '🇲🇽 Cinco de Mayo',
  '05-11': "🌷 Mother's Day",
  // June
  '06-05': '🌱 World Environment Day',
  '06-14': '🇺🇸 Flag Day',
  '06-15': "👔 Father's Day",
  '06-19': '✊ Juneteenth',
  '06-21': '☀️ Summer Solstice',
  // July
  '07-04': '🇺🇸 Independence Day',
  '07-14': '🇫🇷 Bastille Day',
  // August
  '08-15': '🇮🇳 Independence Day (India)',
  '08-26': "👩‍🎓 Women's Equality Day",
  // September
  '09-01': '📚 Labor Day',
  '09-21': '☮️ Int\'l Day of Peace',
  '09-22': '🍂 Autumn Equinox',
  // October
  '10-02': '🇮🇳 Gandhi Jayanti',
  '10-09': '🇨🇦 Thanksgiving (Canada)',
  '10-14': '🧭 Columbus Day',
  '10-31': '🎃 Halloween',
  // November
  '11-01': '🕯️ All Saints\' Day',
  '11-05': '🎇 Guy Fawkes Night',
  '11-11': '🎖️ Veterans Day',
  '11-27': '🦃 Thanksgiving (US)',
  // December
  '12-21': '❄️ Winter Solstice',
  '12-24': '🎄 Christmas Eve',
  '12-25': '🎄 Christmas Day',
  '12-26': '🕎 Kwanzaa Begins',
  '12-31': "🎆 New Year's Eve",
};

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function isDateInRange(dateKey: string, start: string | null, end: string | null): boolean {
  if (!start || !end) return false;
  return dateKey >= start && dateKey <= end;
}

export function isToday(year: number, month: number, day: number): boolean {
  const today = new Date();
  return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
}

export function getHoliday(month: number, day: number): string | undefined {
  const key = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return HOLIDAYS[key];
}

export function getNotesForDate(notes: CalendarNote[], dateKey: string): CalendarNote[] {
  return notes.filter(n => {
    if (n.type === 'date') return n.date === dateKey;
    if (n.type === 'range' && n.startDate && n.endDate) {
      return dateKey >= n.startDate && dateKey <= n.endDate;
    }
    return false;
  });
}

export function getNotesForMonth(notes: CalendarNote[], monthKey: string): CalendarNote[] {
  return notes.filter(n => n.type === 'month' && n.month === monthKey);
}

export function loadNotes(): CalendarNote[] {
  try {
    const raw = localStorage.getItem('calendar-notes');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveNotes(notes: CalendarNote[]) {
  localStorage.setItem('calendar-notes', JSON.stringify(notes));
}

export function loadTheme(): 'light' | 'dark' {
  try {
    return (localStorage.getItem('calendar-theme') as 'light' | 'dark') || 'light';
  } catch { return 'light'; }
}

export function saveTheme(theme: 'light' | 'dark') {
  localStorage.setItem('calendar-theme', theme);
}
