import { cn } from '@/lib/utils';
import { isToday, getHoliday } from '@/lib/calendar-utils';
import { motion } from 'framer-motion';

interface DayCellProps {
  day: number;
  month: number;
  year: number;
  dateKey: string;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isHoverRange: boolean;
  hasNotes: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

const DayCell = ({
  day, month, year, dateKey, isSelected, isRangeStart, isRangeEnd,
  isInRange, isHoverRange, hasNotes, onClick, onMouseEnter
}: DayCellProps) => {
  const today = isToday(year, month, day);
  const holiday = getHoliday(month, day);
  const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, delay: day * 0.01 }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        'relative flex flex-col items-center justify-center aspect-square rounded-xl text-sm font-body transition-all duration-150 cursor-pointer group',
        'hover:bg-calendar-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
        today && !isSelected && !isRangeStart && !isRangeEnd && 'ring-2 ring-calendar-today',
        isWeekend && 'text-muted-foreground',
        holiday && 'text-calendar-holiday',
        (isRangeStart || isRangeEnd) && 'bg-calendar-range-edge text-primary-foreground hover:bg-calendar-range-edge',
        isInRange && !isRangeStart && !isRangeEnd && 'bg-calendar-range rounded-none',
        isHoverRange && !isInRange && !isRangeStart && !isRangeEnd && 'bg-calendar-hover/60',
        isRangeStart && 'rounded-r-none',
        isRangeEnd && 'rounded-l-none',
        isInRange && !isRangeStart && !isRangeEnd && 'rounded-none',
      )}
      aria-label={`${day} ${holiday ? `, ${holiday}` : ''}`}
      title={holiday || undefined}
    >
      <span className={cn(
        'relative z-10 font-medium',
        today && !isRangeStart && !isRangeEnd && 'text-calendar-today font-bold',
      )}>
        {day}
      </span>
      {hasNotes && (
        <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-calendar-note-dot" />
      )}
      {holiday && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-calendar-holiday opacity-70" />
      )}
      {/* Festival tooltip on hover */}
      {holiday && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-foreground text-background text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
          {holiday}
        </span>
      )}
    </motion.button>
  );
};

export default DayCell;
