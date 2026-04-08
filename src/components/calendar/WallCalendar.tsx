import { useState, useCallback, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import HeroImage from './HeroImage';
import MiniCalendar from './MiniCalendar';
import { CalendarNote, loadNotes, saveNotes, loadTheme, saveTheme } from '@/lib/calendar-utils';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const WallCalendar = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [direction, setDirection] = useState(0);
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [notes, setNotes] = useState<CalendarNote[]>(loadNotes);
  const [isDark, setIsDark] = useState(() => loadTheme() === 'dark');
  const [showNotesMobile, setShowNotesMobile] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    saveTheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => { saveNotes(notes); }, [notes]);

  const goNext = useCallback(() => {
    setDirection(1);
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }, [month]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }, [month]);

  const goToday = useCallback(() => {
    const t = new Date();
    setDirection(t.getMonth() > month || t.getFullYear() > year ? 1 : -1);
    setYear(t.getFullYear());
    setMonth(t.getMonth());
  }, [month, year]);

  const navigateTo = useCallback((y: number, m: number) => {
    setDirection(m > month || y > year ? 1 : -1);
    setYear(y);
    setMonth(m);
  }, [month, year]);

  const handleDayClick = useCallback((dateKey: string) => {
    if (!rangeStart || rangeEnd) {
      setRangeStart(dateKey);
      setRangeEnd(null);
    } else {
      if (dateKey < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(dateKey);
      } else if (dateKey === rangeStart) {
        setRangeEnd(null);
      } else {
        setRangeEnd(dateKey);
      }
    }
  }, [rangeStart, rangeEnd]);

  const clearSelection = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  const handleAddNote = useCallback((note: Omit<CalendarNote, 'id' | 'createdAt'>) => {
    setNotes(prev => [...prev, { ...note, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
  }, []);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleEditNote = useCallback((id: string, text: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goPrev, goNext]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Hero Image - Full width on top for all screen sizes */}
        <div className="mb-4 lg:mb-6">
          <HeroImage year={year} month={month} direction={direction} />
        </div>

        {/* Calendar + Notes - 2 column on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          
          {/* Calendar */}
          <div className="bg-card rounded-2xl shadow-card p-4 md:p-6 flex flex-col">
            <CalendarHeader
              year={year}
              month={month}
              onPrev={goPrev}
              onNext={goNext}
              onToday={goToday}
              isDark={isDark}
              onToggleTheme={() => setIsDark(d => !d)}
            />
            
            {/* Selection info */}
            {rangeStart && (
              <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
                <span className="text-xs font-body text-muted-foreground">
                  {rangeEnd ? `${rangeStart} → ${rangeEnd}` : rangeStart}
                </span>
                <button onClick={clearSelection} className="p-0.5 rounded hover:bg-muted text-muted-foreground">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex-1">
              <CalendarGrid
                year={year}
                month={month}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                hoverDate={hoverDate}
                notes={notes}
                direction={direction}
                onDayClick={handleDayClick}
                onDayHover={setHoverDate}
                onMouseLeave={() => setHoverDate(null)}
              />
            </div>

            {/* Mini calendar preview */}
            <div className="mt-4 hidden md:block">
              <MiniCalendar year={year} month={month} onNavigate={navigateTo} />
            </div>
          </div>

          {/* Notes Panel - Desktop */}
          <div className="hidden lg:block bg-card rounded-2xl shadow-card p-4 md:p-6 overflow-hidden">
            <NotesPanel
              year={year}
              month={month}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              notes={notes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onEditNote={handleEditNote}
            />
          </div>

          {/* Notes - Mobile toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowNotesMobile(true)}
              className="w-full py-3 bg-card rounded-xl shadow-soft text-sm font-body font-medium text-foreground"
            >
              📝 View Notes
            </button>
          </div>
        </div>
      </div>

      {/* Mobile notes modal */}
      {showNotesMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setShowNotesMobile(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-5 max-h-[70vh] overflow-y-auto shadow-elevated">
            <div className="flex justify-between items-center mb-3">
              <span className="font-display text-lg font-semibold text-foreground">Notes</span>
              <button onClick={() => setShowNotesMobile(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <NotesPanel
              year={year}
              month={month}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              notes={notes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onEditNote={handleEditNote}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WallCalendar;