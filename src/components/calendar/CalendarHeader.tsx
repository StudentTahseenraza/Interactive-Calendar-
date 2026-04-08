import { ChevronLeft, ChevronRight, Sun, Moon, CalendarDays } from 'lucide-react';
import { MONTH_NAMES } from '@/lib/calendar-utils';
import { motion } from 'framer-motion';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const CalendarHeader = ({ year, month, onPrev, onNext, onToday, isDark, onToggleTheme }: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-2 py-3">
      <motion.h2
        key={`${year}-${month}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl md:text-3xl font-semibold text-foreground tracking-tight"
      >
        {MONTH_NAMES[month]}{' '}
        <span className="text-muted-foreground font-normal">{year}</span>
      </motion.h2>
      <div className="flex items-center gap-1">
        <button
          onClick={onToday}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-body font-medium text-primary hover:bg-calendar-hover rounded-lg transition-colors"
          aria-label="Go to today"
        >
          <CalendarDays className="w-4 h-4" />
          <span className="hidden sm:inline">Today</span>
        </button>
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-calendar-hover transition-colors text-muted-foreground"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          onClick={onPrev}
          className="p-2 rounded-lg hover:bg-calendar-hover transition-colors text-foreground"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onNext}
          className="p-2 rounded-lg hover:bg-calendar-hover transition-colors text-foreground"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
