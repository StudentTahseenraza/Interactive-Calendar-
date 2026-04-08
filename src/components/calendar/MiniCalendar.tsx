import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth, MONTH_NAMES, isToday } from '@/lib/calendar-utils';
import { cn } from '@/lib/utils';

interface MiniCalendarProps {
  year: number;
  month: number;
  onNavigate: (year: number, month: number) => void;
}

const MiniCalendar = ({ year, month, onNavigate }: MiniCalendarProps) => {
  // Show next month as mini preview
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const days = getDaysInMonth(nextYear, nextMonth);
  const firstDay = getFirstDayOfMonth(nextYear, nextMonth);

  return (
    <div className="bg-secondary rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-sm font-semibold text-foreground">
          {MONTH_NAMES[nextMonth]} {nextYear}
        </span>
        <button
          onClick={() => onNavigate(nextYear, nextMonth)}
          className="text-xs font-body text-primary hover:underline"
        >
          Go →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-center text-[9px] font-body text-muted-foreground py-0.5">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const d = i + 1;
          const today = isToday(nextYear, nextMonth, d);
          return (
            <div
              key={d}
              className={cn(
                'text-center text-[10px] font-body py-0.5 rounded',
                today && 'bg-primary text-primary-foreground font-bold',
              )}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
