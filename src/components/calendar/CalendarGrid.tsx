import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DayCell from './DayCell';
import {
  DAY_NAMES, getDaysInMonth, getFirstDayOfMonth,
  formatDateKey, isDateInRange, getNotesForDate, CalendarNote
} from '@/lib/calendar-utils';

interface CalendarGridProps {
  year: number;
  month: number;
  rangeStart: string | null;
  rangeEnd: string | null;
  hoverDate: string | null;
  notes: CalendarNote[];
  direction: number;
  onDayClick: (dateKey: string) => void;
  onDayHover: (dateKey: string) => void;
  onMouseLeave: () => void;
}

const CalendarGrid = ({
  year, month, rangeStart, rangeEnd, hoverDate, notes,
  direction, onDayClick, onDayHover, onMouseLeave
}: CalendarGridProps) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const effectiveEnd = rangeEnd || (rangeStart && hoverDate ? (hoverDate >= rangeStart ? hoverDate : rangeStart) : null);
  const effectiveStart = rangeEnd ? rangeStart : (rangeStart && hoverDate && hoverDate < rangeStart ? hoverDate : rangeStart);

  const datesWithNotes = useMemo(() => {
    const set = new Set<string>();
    for (let d = 1; d <= daysInMonth; d++) {
      const key = formatDateKey(year, month, d);
      if (getNotesForDate(notes, key).length > 0) set.add(key);
    }
    return set;
  }, [notes, year, month, daysInMonth]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div onMouseLeave={onMouseLeave}>
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider py-2">
            {d}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${year}-${month}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="grid grid-cols-7 gap-0.5"
        >
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = formatDateKey(year, month, day);
            const isRangeStart = dateKey === effectiveStart;
            const isRangeEnd = dateKey === effectiveEnd;
            const isInRange = isDateInRange(dateKey, effectiveStart, effectiveEnd);
            const isHoverPreview = !rangeEnd && rangeStart && hoverDate
              ? isDateInRange(dateKey, 
                  hoverDate < rangeStart ? hoverDate : rangeStart,
                  hoverDate < rangeStart ? rangeStart : hoverDate
                )
              : false;

            return (
              <DayCell
                key={dateKey}
                day={day}
                month={month}
                year={year}
                dateKey={dateKey}
                isSelected={isRangeStart || isRangeEnd}
                isRangeStart={isRangeStart}
                isRangeEnd={isRangeEnd}
                isInRange={isInRange}
                isHoverRange={isHoverPreview}
                hasNotes={datesWithNotes.has(dateKey)}
                onClick={() => onDayClick(dateKey)}
                onMouseEnter={() => onDayHover(dateKey)}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CalendarGrid;
